(function () {
  const DEFAULT_MANIFEST = {
    navItems: [
      {key: 'hardware', label: 'Hardware', href: '/hardware', external: false},
      {key: 'software', label: 'Software', href: '/software', external: false},
      {key: 'examples', label: 'Examples', href: '/examples', external: false},
      {key: 'models', label: 'Models', href: 'https://huggingface.co/simaai', external: true},
      {key: 'community', label: 'Community', href: 'https://developer.sima.ai', external: true},
    ],
    theme: {
      cookie: 'sima-neat-theme',
      keys: ['theme', 'portal-theme'],
    },
  };
  const VALID_THEMES = new Set(['light', 'dark']);

  function normalizeTheme(value) {
    return VALID_THEMES.has(value) ? value : null;
  }

  function normalizePath(pathname) {
    if (!pathname || pathname === '/') {
      return '/';
    }
    return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  }

  function cookieDomain() {
    const {hostname} = window.location;
    if (hostname === 'localhost' || /^[\d.]+$/.test(hostname)) {
      return '';
    }
    if (hostname.endsWith('.neat.sima.ai') || hostname.endsWith('.neat.paconsultings.com')) {
      const parts = hostname.split('.');
      return parts.length > 3 ? parts.slice(1).join('.') : hostname;
    }
    return '';
  }

  function readCookieTheme(cookieName) {
    const entry = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${cookieName}=`));
    return normalizeTheme(entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null);
  }

  function readStoredTheme(keys) {
    for (const key of keys) {
      try {
        const value = normalizeTheme(window.localStorage.getItem(key));
        if (value) return value;
      } catch (_) {
        // Ignore restricted storage modes.
      }
    }
    return null;
  }

  function writeCookieTheme(theme, cookieName) {
    const domain = cookieDomain();
    const domainPart = domain ? `; Domain=.${domain}` : '';
    const securePart = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${cookieName}=${encodeURIComponent(theme)}; Path=/; Max-Age=31536000; SameSite=Lax${securePart}${domainPart}`;
  }

  function writeStoredTheme(theme, keys) {
    keys.forEach((key) => {
      try {
        window.localStorage.setItem(key, theme);
      } catch (_) {
        // Ignore restricted storage modes.
      }
    });
  }

  function applyTheme(theme, manifest) {
    if (!theme) return;
    const themeConfig = manifest.theme || DEFAULT_MANIFEST.theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme-choice', theme);
    writeStoredTheme(theme, themeConfig.keys || DEFAULT_MANIFEST.theme.keys);
    writeCookieTheme(theme, themeConfig.cookie || DEFAULT_MANIFEST.theme.cookie);
    window.dispatchEvent(new CustomEvent('developer-center-theme-change', {detail: {theme}}));
  }

  function initialTheme(manifest) {
    const themeConfig = manifest.theme || DEFAULT_MANIFEST.theme;
    return (
      readCookieTheme(themeConfig.cookie || DEFAULT_MANIFEST.theme.cookie) ||
      readStoredTheme(themeConfig.keys || DEFAULT_MANIFEST.theme.keys) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  }

  function activeKey(manifest, configuredActive) {
    if (configuredActive) {
      return configuredActive;
    }
    const pathname = normalizePath(window.location.pathname);
    const match = (manifest.navItems || DEFAULT_MANIFEST.navItems).find(
      (item) => !item.external && normalizePath(item.href) === pathname,
    );
    return match ? match.key : '';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render(target, manifest, options) {
    target.__developerCenterShellCleanup?.();

    const theme = normalizeTheme(document.documentElement.getAttribute('data-theme')) || initialTheme(manifest);
    const active = activeKey(manifest, options.active);
    const navItems = manifest.navItems || DEFAULT_MANIFEST.navItems;
    const linkForItem = (item) => {
      const activeClass = item.key === active ? ' navbar__link--active' : '';
      const targetAttr = item.external ? ' target="_blank" rel="noreferrer"' : '';
      const externalIcon = item.external
        ? '<svg width="13.5" height="13.5" viewBox="0 0 24 24" aria-label="(opens in new tab)" class="iconExternalLink"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"></path></svg>'
        : '';
      return `<a class="navbar__item navbar__link${activeClass}" data-developer-center-section="${escapeHtml(item.key)}" href="${escapeHtml(item.href)}"${targetAttr}>${escapeHtml(item.label)}${externalIcon}</a>`;
    };
    const desktopItems = navItems
      .map((item) => {
        const link = linkForItem(item);
        return item.external ? link : `<div class="navbar__item">${link}</div>`;
      })
      .join('');

    target.innerHTML = `
      <div class="developer-center-shell">
        <header class="navbar dev-center-navbar">
          <div class="navbar__inner">
            <div class="navbar__items">
              <a class="navbar__brand" href="/" aria-label="Developer Center home">
                <span class="navbar__logo"><img src="/img/sima-logo.png" alt="" /></span>
                <span class="navbar__title">Developer Center</span>
              </a>
              <div class="navbar__items navbar__items--desktop">${desktopItems}</div>
            </div>
            <div class="navbar__items navbar__items--right">
              <div class="color-mode-toggle">
                <button class="color-mode-toggle-button" type="button" aria-label="Switch between dark and light mode" title="Switch between dark and light mode">
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" class="color-mode-toggle-icon color-mode-toggle-icon-light"><path fill="currentColor" d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5ZM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1Zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1ZM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1Zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1ZM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58Zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06ZM19.42 5.99a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06ZM7.05 18.36a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06Z"></path></svg>
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" class="color-mode-toggle-icon color-mode-toggle-icon-dark"><path fill="currentColor" d="M9.37 5.51A7.4 7.4 0 0 0 16.5 14.9c.68 0 1.35-.09 1.99-.27A7.03 7.03 0 0 1 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49ZM12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.4 5.4 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8A9.2 9.2 0 0 0 12 3Z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>`;

    target.querySelector('.color-mode-toggle-button')?.addEventListener('click', () => {
      const current = normalizeTheme(document.documentElement.getAttribute('data-theme')) || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light', manifest);
      render(target, manifest, options);
    });
  }

  async function loadManifest() {
    try {
      const response = await fetch('/developer-center-shell.json', {
        headers: {Accept: 'application/json'},
      });
      if (!response.ok) {
        throw new Error(`Developer Center shell manifest returned ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('Using local Developer Center shell fallback.', err);
      return DEFAULT_MANIFEST;
    }
  }

  async function mount(targetOrSelector, options = {}) {
    const target =
      typeof targetOrSelector === 'string'
        ? document.querySelector(targetOrSelector)
        : targetOrSelector;
    if (!target) return;

    const manifest = await loadManifest();
    applyTheme(initialTheme(manifest), manifest);
    render(target, manifest, options);
  }

  window.DeveloperCenterShell = {
    mount,
    applyTheme,
  };
})();

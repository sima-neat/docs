import shellConfig from './config.cjs';

const VALID_THEMES = new Set(shellConfig.VALID_THEMES);

export function normalizeTheme(value) {
  return VALID_THEMES.has(value) ? value : null;
}

export function readCookieTheme() {
  const entry = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${shellConfig.THEME_COOKIE}=`));
  return normalizeTheme(entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null);
}

export function cookieDomain() {
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

export function writeCookieTheme(theme) {
  const domain = cookieDomain();
  const domainPart = domain ? `; Domain=.${domain}` : '';
  const securePart = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${shellConfig.THEME_COOKIE}=${encodeURIComponent(theme)}; Path=/; Max-Age=31536000; SameSite=Lax${securePart}${domainPart}`;
}

export function writeLocalTheme(theme) {
  shellConfig.THEME_KEYS.forEach((key) => {
    try {
      window.localStorage.setItem(key, theme);
    } catch (_) {
      // Ignore private browsing and restricted storage modes.
    }
  });
}

export function applyTheme(theme) {
  if (!theme) return;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-theme-choice', theme);
  writeLocalTheme(theme);
}

export function persistTheme(theme) {
  if (!theme) return;
  writeLocalTheme(theme);
  writeCookieTheme(theme);
}

export function initializeDeveloperCenterThemeSync() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  applyTheme(readCookieTheme());

  function syncFromCookie() {
    const cookieTheme = readCookieTheme();
    if (cookieTheme && cookieTheme !== document.documentElement.getAttribute('data-theme')) {
      applyTheme(cookieTheme);
    }
  }

  let lastTheme = normalizeTheme(document.documentElement.getAttribute('data-theme'));
  const observer = new MutationObserver(() => {
    const nextTheme = normalizeTheme(document.documentElement.getAttribute('data-theme'));
    if (nextTheme && nextTheme !== lastTheme) {
      lastTheme = nextTheme;
      persistTheme(nextTheme);
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  window.addEventListener('focus', syncFromCookie);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      syncFromCookie();
    }
  });
}

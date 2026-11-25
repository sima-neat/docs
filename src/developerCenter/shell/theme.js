import shellConfig from './config.cjs';

const VALID_THEMES = new Set(shellConfig.VALID_THEMES);

export function normalizeTheme(value) {
  return VALID_THEMES.has(value) ? value : null;
}

function decodeCookieEntry(entry) {
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.split('=').slice(1).join('='));
  } catch (_) {
    return null;
  }
}

// ?theme=dark|light (sima-neat/docs#199) shows that theme on this page only and is never stored.
export function urlTheme() {
  try {
    return normalizeTheme(new URLSearchParams(window.location.search).get('theme'));
  } catch (_) {
    return null;
  }
}

export function readCookieTheme() {
  const entry = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${shellConfig.THEME_COOKIE}=`));
  return normalizeTheme(decodeCookieEntry(entry));
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

  const fromUrl = urlTheme();
  if (fromUrl) {
    document.documentElement.setAttribute('data-theme', fromUrl);
    document.documentElement.setAttribute('data-theme-choice', fromUrl);
  } else {
    applyTheme(readCookieTheme());
  }

  // The shell's non-persistent change (from ?theme) must not be stored by the observer below.
  let unstoredTheme = null;
  window.addEventListener('developer-center-theme-change', (event) => {
    unstoredTheme = event.detail && event.detail.persist === false ? event.detail.theme : null;
  });

  function syncFromCookie() {
    // The theme from the URL holds for this page; the stored one must not replace it.
    if (fromUrl) return;
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
      const unstored = nextTheme === unstoredTheme;
      unstoredTheme = null;
      if (!unstored) persistTheme(nextTheme);
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

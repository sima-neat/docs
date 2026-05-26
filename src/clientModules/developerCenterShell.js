const SHELL_ROOT_ID = 'developer-center-shell-root';
const SHELL_SCRIPT_ID = 'developer-center-shell-script';
const SHELL_STYLESHEET_ID = 'developer-center-shell-stylesheet';
const DESKTOP_NAV_QUERY = '(min-width: 997px)';

let navbarMediaQuery;

function desktopNavMediaQuery() {
  if (!navbarMediaQuery && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    navbarMediaQuery = window.matchMedia(DESKTOP_NAV_QUERY);
  }

  return navbarMediaQuery;
}

function loadStylesheet() {
  if (document.getElementById(SHELL_STYLESHEET_ID)) {
    return;
  }

  const link = document.createElement('link');
  link.id = SHELL_STYLESHEET_ID;
  link.rel = 'stylesheet';
  link.href = '/developer-center-shell.css';
  document.head.appendChild(link);
}

function loadScript() {
  if (window.DeveloperCenterShell) {
    return Promise.resolve();
  }

  const existingScript = document.getElementById(SHELL_SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', resolve, {once: true});
      existingScript.addEventListener('error', reject, {once: true});
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SHELL_SCRIPT_ID;
    script.src = '/developer-center-shell.js';
    script.async = true;
    script.addEventListener('load', resolve, {once: true});
    script.addEventListener('error', reject, {once: true});
    document.head.appendChild(script);
  });
}

function activeSection() {
  const path = window.location.pathname;
  if (path.startsWith('/software')) return 'software';
  if (path.startsWith('/examples')) return 'examples';
  if (path.startsWith('/hardware')) return 'hardware';
  return '';
}

function nativeNavbar() {
  return document.querySelector('nav.navbar');
}

function syncNativeNavbarVisibility() {
  const navbar = nativeNavbar();
  if (!navbar) {
    return;
  }

  const shouldHideNativeNavbar = Boolean(desktopNavMediaQuery()?.matches);
  navbar.hidden = shouldHideNativeNavbar;
  navbar.style.display = shouldHideNativeNavbar ? 'none' : '';
}

function watchNativeNavbarVisibility() {
  const mediaQuery = desktopNavMediaQuery();
  if (!mediaQuery || mediaQuery.__developerCenterShellBound) {
    return;
  }

  const listener = () => syncNativeNavbarVisibility();
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', listener);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(listener);
  }
  mediaQuery.__developerCenterShellBound = true;
}

function ensureRoot() {
  const existingRoot = document.getElementById(SHELL_ROOT_ID);
  if (existingRoot) {
    return existingRoot;
  }

  const root = document.createElement('div');
  root.id = SHELL_ROOT_ID;

  const navbar = nativeNavbar();
  if (navbar?.parentNode) {
    navbar.parentNode.insertBefore(root, navbar);
  } else {
    document.body.insertBefore(root, document.body.firstChild);
  }

  return root;
}

async function mountShell() {
  loadStylesheet();
  await loadScript();

  const root = ensureRoot();
  await window.DeveloperCenterShell?.mount(root, {active: activeSection()});
  document.documentElement.classList.add('developer-center-shell-active');
  syncNativeNavbarVisibility();
  watchNativeNavbarVisibility();
}

function scheduleMount() {
  if (typeof window === 'undefined') {
    return;
  }

  window.setTimeout(() => {
    mountShell().catch((error) => {
      console.warn('Unable to mount Developer Center shell.', error);
    });
  }, 0);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    scheduleMount();
  } else {
    window.addEventListener('load', scheduleMount, {once: true});
  }
}

export function onRouteDidUpdate() {
  scheduleMount();
}

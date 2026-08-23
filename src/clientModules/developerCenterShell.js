import developerCenterShell from '../developerCenter/shell/config.cjs';
import siteConfig from '@generated/docusaurus.config';

const SHELL_ROOT_ID = 'developer-center-shell-root';
const SHELL_SCRIPT_ID = 'developer-center-shell-script';
const SHELL_STYLESHEET_ID = 'developer-center-shell-stylesheet';
const DESKTOP_NAV_QUERY = '(min-width: 997px)';
const SITE_ROOT = siteConfig.baseUrl || '/';

let navbarMediaQuery;
let mobileLanguagePickerBound = false;
let nativeNavbarLocaleBound = false;
let nativeSectionNavigationBound = false;
let localizedContentNavigationBound = false;

function currentRoutePath() {
  return developerCenterShell.withoutSiteRoot(window.location.pathname, SITE_ROOT);
}

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
  link.href = developerCenterShell.withSiteRoot('/developer-center-shell.css', SITE_ROOT);
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
    script.src = developerCenterShell.withSiteRoot('/developer-center-shell.js', SITE_ROOT);
    script.async = true;
    script.addEventListener('load', resolve, {once: true});
    script.addEventListener('error', reject, {once: true});
    document.head.appendChild(script);
  });
}

function activeSection() {
  const path = currentRoutePath();
  if (path.startsWith('/software') || /^\/(?:ko|ja|zh-Hant|uk)\/software(?:\/|$)/.test(path)) return 'software';
  if (path.startsWith('/examples')) return 'examples';
  if (path.startsWith('/hardware') || /^\/(?:ko|ja|zh-Hant|uk)\/hardware(?:\/|$)/.test(path)) return 'hardware';
  return '';
}

function nativeNavbar() {
  return document.querySelector('nav.navbar');
}

function syncNativeNavbarLocale(selectedLocale) {
  const shell = window.DeveloperCenterShell;
  const locale = selectedLocale || shell?.localeFromPath?.(currentRoutePath());
  if (!locale) {
    return;
  }

  const navCopy = developerCenterShell.SHELL_TRANSLATIONS[locale]?.navItems || {};
  nativeNavbar()?.querySelectorAll('a.navbar__link[href]').forEach((link) => {
    const pathname = new URL(link.href, window.location.href).pathname;
    const routePath = developerCenterShell.withoutSiteRoot(pathname, SITE_ROOT);
    const section = developerCenterShell.activeSectionForPath(routePath);
    const absoluteHref = new URL(link.href, window.location.href);
    const configuredItem = developerCenterShell.navbarItems().find((item) => {
      if (item.external) {
        const itemHref = new URL(item.href);
        return itemHref.origin === absoluteHref.origin && itemHref.pathname === absoluteHref.pathname;
      }
      return developerCenterShell.normalizePath(
        developerCenterShell.withoutLocalePrefix(routePath),
      ) === developerCenterShell.normalizePath(item.href);
    });
    const key = configuredItem?.key || section;

    if (navCopy[key]) {
      const textNode = Array.from(link.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.nodeValue = navCopy[key];
      } else {
        link.insertBefore(document.createTextNode(navCopy[key]), link.firstChild);
      }
      link.dataset.developerCenterSection = key;
    }

    if (['hardware', 'software'].includes(section)) {
      link.setAttribute(
        'href',
        developerCenterShell.withSiteRoot(
          shell.localizedPath(developerCenterShell.SECTION_ROUTES[section], locale),
          SITE_ROOT,
        ),
      );
    }
  });
}

function watchNativeNavbarLocale() {
  if (nativeNavbarLocaleBound) {
    return;
  }

  window.addEventListener('developer-center-language-change', (event) => {
    const locale = event?.detail?.locale;
    if (!developerCenterShell.SHELL_TRANSLATIONS[locale]) {
      return;
    }
    syncNativeNavbarLocale(locale);
  });
  nativeNavbarLocaleBound = true;
}

function watchNativeSectionNavigation() {
  if (nativeSectionNavigationBound) {
    return;
  }

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
    ) {
      return;
    }

    const link = event.target.closest('nav.navbar a.navbar__link[href]');
    if (!link || (link.target && link.target !== '_self')) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    const routePath = developerCenterShell.withoutSiteRoot(url.pathname, SITE_ROOT);
    const section = developerCenterShell.activeSectionForPath(routePath);
    if (!['hardware', 'software'].includes(section)) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  }, {capture: true});
  nativeSectionNavigationBound = true;
}

function isLocalizedHardwarePath(pathname) {
  return /^\/(?:ko|ja|zh-Hant|uk)\/hardware(?:\/|$)/.test(pathname);
}

function syncLocalizedContentLinks() {
  if (SITE_ROOT === '/') {
    return;
  }

  document.querySelectorAll('main a[href]').forEach((link) => {
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname.startsWith(SITE_ROOT)) {
      return;
    }
    if (!isLocalizedHardwarePath(url.pathname)) {
      return;
    }

    link.setAttribute(
      'href',
      `${developerCenterShell.withSiteRoot(url.pathname, SITE_ROOT)}${url.search}${url.hash}`,
    );
    link.dataset.developerCenterBaseRooted = 'true';
  });
}

function watchLocalizedContentNavigation() {
  if (localizedContentNavigationBound || SITE_ROOT === '/') {
    return;
  }

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
    ) {
      return;
    }

    const link = event.target.closest('a[data-developer-center-base-rooted="true"]');
    if (!link || (link.target && link.target !== '_self')) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  }, {capture: true});
  localizedContentNavigationBound = true;
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

function localeForLanguageLink(link) {
  const htmlLang = link?.getAttribute('lang');
  return developerCenterShell.SUPPORTED_LOCALES.find(
    (locale) => locale.htmlLang === htmlLang,
  )?.code;
}

function watchMobileLanguagePicker() {
  if (mobileLanguagePickerBound) {
    return;
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('.navbar-sidebar a[lang]');
    const locale = localeForLanguageLink(link);
    if (!locale) {
      return;
    }

    window.DeveloperCenterShell?.writeLocale?.(locale);
    window.dispatchEvent(
      new CustomEvent('developer-center-language-change', {detail: {locale}}),
    );
  }, {capture: true});
  mobileLanguagePickerBound = true;
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
  const routeLocale = window.DeveloperCenterShell?.localeFromPath?.(currentRoutePath());
  await window.DeveloperCenterShell?.mount(root, {
    active: activeSection(),
    locale: routeLocale === developerCenterShell.DEFAULT_LOCALE ? undefined : routeLocale,
    siteRoot: SITE_ROOT,
  });
  document.documentElement.classList.add('developer-center-shell-active');
  syncNativeNavbarVisibility();
  syncNativeNavbarLocale();
  syncLocalizedContentLinks();
  watchNativeNavbarVisibility();
  watchMobileLanguagePicker();
  watchNativeNavbarLocale();
  watchNativeSectionNavigation();
  watchLocalizedContentNavigation();
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

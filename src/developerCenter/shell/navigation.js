import shellConfig from './config.cjs';
import siteConfig from '@generated/docusaurus.config';

const SITE_ROOT = siteConfig.baseUrl || '/';

function withoutSiteRoot(pathname) {
  return shellConfig.withoutSiteRoot(pathname, SITE_ROOT);
}

function normalizeDeveloperCenterBrand() {
  document.querySelectorAll('a.navbar__brand').forEach((brandLink) => {
    brandLink.removeAttribute('target');
    brandLink.removeAttribute('rel');
  });
}

function markActiveNavItem() {
  const activeSection = shellConfig.activeSectionForPath(withoutSiteRoot(window.location.pathname));
  document.querySelectorAll('.navbar__link').forEach((link) => {
    const section = link.dataset.developerCenterSection || shellConfig.activeSectionForPath(
      withoutSiteRoot(new URL(link.href, window.location.href).pathname),
    );
    if (section === 'home') {
      return;
    }

    link.classList.toggle('navbar__link--active', section === activeSection);
  });
}

function normalizeHardwareBreadcrumbHome() {
  const routePath = withoutSiteRoot(window.location.pathname);
  if (shellConfig.activeSectionForPath(routePath) !== 'hardware') {
    return;
  }

  document
    .querySelectorAll('.theme-doc-breadcrumbs a[aria-label="Home page"]')
    .forEach((link) => {
      link.setAttribute(
        'href',
        shellConfig.withSiteRoot(
          shellConfig.withLocalePrefixFromPath(
            shellConfig.SECTION_ROUTES.hardware,
            routePath,
          ),
          SITE_ROOT,
        ),
      );
    });
}

export function initializeDeveloperCenterNav() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const update = () => {
    normalizeDeveloperCenterBrand();
    markActiveNavItem();
    normalizeHardwareBreadcrumbHome();
  };

  update();

  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

export function initializeCloudFrontRouteNavigation() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  document.addEventListener(
    'click',
    (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const anchor = event.target?.closest?.('a[href]');
      if (!anchor || (anchor.target && anchor.target !== '_self')) {
        return;
      }

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('#')) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      const routePath = withoutSiteRoot(url.pathname);
      if (url.hash && shellConfig.normalizePath(routePath) === shellConfig.normalizePath(withoutSiteRoot(window.location.pathname))) {
        return;
      }

      if (!shellConfig.isCloudFrontRoutedPath(routePath)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      const pathname = shellConfig.withSiteRoot(shellConfig.normalizePath(routePath), SITE_ROOT);
      window.location.assign(`${pathname}${url.search}${url.hash}`);
    },
    true,
  );
}

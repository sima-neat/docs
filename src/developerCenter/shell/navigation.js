import shellConfig from './config.cjs';

function normalizeDeveloperCenterBrand() {
  document.querySelectorAll('a.navbar__brand').forEach((brandLink) => {
    brandLink.removeAttribute('target');
    brandLink.removeAttribute('rel');
  });
}

function markActiveNavItem() {
  const activeSection = shellConfig.activeSectionForPath(window.location.pathname);
  document.querySelectorAll('.navbar__link').forEach((link) => {
    const section = link.dataset.developerCenterSection || shellConfig.activeSectionForPath(new URL(link.href, window.location.href).pathname);
    if (section === 'home') {
      return;
    }

    link.classList.toggle('navbar__link--active', section === activeSection);
  });
}

export function initializeDeveloperCenterNav() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const update = () => {
    normalizeDeveloperCenterBrand();
    markActiveNavItem();
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

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (!shellConfig.isCloudFrontRoutedPath(url.pathname)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      const pathname = shellConfig.normalizePath(url.pathname) + '/';
      window.location.assign(`${pathname}${url.search}${url.hash}`);
    },
    true,
  );
}

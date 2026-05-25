const cloudFrontRoutes = new Set(['/hardware', '/software', '/examples']);

function normalizePath(pathname) {
  return pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
}

if (typeof document !== 'undefined') {
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

      if (!cloudFrontRoutes.has(normalizePath(url.pathname))) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      const pathname = normalizePath(url.pathname) + '/';
      window.location.assign(`${pathname}${url.search}${url.hash}`);
    },
    true,
  );
}

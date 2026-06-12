const FIRMWARE_UPDATE_PATH = '/hardware/getting-started/firmware-update';

const HASH_TO_TAB_LABEL = {
  '#sima-cli': 'Update with sima-cli',
  '#bootimage': 'Update with Boot Image',
  '#netboot': 'Update with Net Boot',
};

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '');
}

function isFirmwareUpdatePath(pathname) {
  return normalizePath(pathname).endsWith(FIRMWARE_UPDATE_PATH);
}

function tabForHash(hash) {
  const label = HASH_TO_TAB_LABEL[hash];
  if (!label) {
    return null;
  }

  return Array.from(document.querySelectorAll('[role="tab"]')).find(
    (tab) => tab.textContent.trim() === label,
  );
}

function scrollToMethod(hash) {
  const target = document.getElementById(hash.slice(1));
  if (target) {
    target.scrollIntoView({block: 'start'});
  }
}

function activateMethod(hash = window.location.hash) {
  if (!isFirmwareUpdatePath(window.location.pathname)) {
    return;
  }

  const tab = tabForHash(hash);
  if (!tab) {
    return;
  }

  tab.click();
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => scrollToMethod(hash));
  });
}

function handleFirmwareMethodClick(event) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const link = event.target?.closest?.('a[href]');
  if (!link) {
    return;
  }

  const url = new URL(link.href, window.location.href);
  if (
    url.origin !== window.location.origin ||
    !isFirmwareUpdatePath(url.pathname) ||
    !HASH_TO_TAB_LABEL[url.hash]
  ) {
    return;
  }

  if (!isFirmwareUpdatePath(window.location.pathname)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  window.history.pushState(null, '', url.hash);
  activateMethod(url.hash);
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', handleFirmwareMethodClick, true);
  window.addEventListener('hashchange', () => activateMethod());
}

export function onRouteDidUpdate() {
  if (typeof window === 'undefined') {
    return;
  }

  window.setTimeout(() => activateMethod(), 0);
}

export function onClientEntry() {
  if (typeof window === 'undefined') {
    return;
  }

  window.setTimeout(() => activateMethod(), 0);
}

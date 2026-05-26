export function trackDeveloperCenterEvent(name, params = {}) {
  if (typeof window === 'undefined' || !name) {
    return;
  }

  const detail = {name, params};
  if (typeof window.developerCenterTrack === 'function') {
    window.developerCenterTrack(name, params);
    return;
  }

  window.dispatchEvent(new CustomEvent('developer-center:analytics-track', {detail}));
}

import {initializeDeveloperCenterNav} from '../developerCenter/shell/navigation';

function scheduleDeveloperCenterNav() {
  window.setTimeout(() => {
    initializeDeveloperCenterNav();
  }, 0);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    scheduleDeveloperCenterNav();
  } else {
    window.addEventListener('load', scheduleDeveloperCenterNav, {once: true});
  }
}

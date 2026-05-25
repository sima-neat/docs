import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const CONSENT_KEY = 'sima-developer-center-cookie-consent';
const CONSENT_VERSION = 1;
const CONSENT_EVENT = 'developer-center:analytics-consent';
const TRACK_EVENT = 'developer-center:analytics-track';
const DOWNLOAD_EXTENSIONS = new Set(['deb', 'gz', 'tgz', 'whl', 'zip', 'pdf']);

let gtagLoaded = false;
let lastTrackedLocation = '';

const deniedConsent = {
  ad_personalization: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  analytics_storage: 'denied',
};

const analyticsGrantedConsent = {
  ...deniedConsent,
  analytics_storage: 'granted',
};

function getAnalyticsConfig() {
  return window.__DEVELOPER_CENTER_ANALYTICS__ || {};
}

function cleanString(value, maxLength = 160) {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).replace(/\s+/g, ' ').trim();
  return normalized ? normalized.slice(0, maxLength) : undefined;
}

function sanitizeUrl(value) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value, window.location.href);
    url.username = '';
    url.password = '';
    url.search = '';
    return url.toString().slice(0, 240);
  } catch {
    return cleanString(value, 240);
  }
}

function pagePath() {
  return `${window.location.pathname}${window.location.search}`;
}

function sectionFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts[0] || 'home';
}

function pageContext() {
  return {
    page_path: pagePath(),
    page_section: sectionFromPath(window.location.pathname),
    page_title: cleanString(document.title, 120),
  };
}

function normalizeParams(params = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    if (key === 'link_url') {
      normalized[key] = sanitizeUrl(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      normalized[key] = value;
    } else {
      normalized[key] = cleanString(value);
    }
  }
  return normalized;
}

function storedConsent() {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    const parsed = value ? JSON.parse(value) : null;
    if (!parsed || parsed.version !== CONSENT_VERSION) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function setStoredConsent(consent) {
  const next = {
    version: CONSENT_VERSION,
    analytics: Boolean(consent.analytics),
    marketing: false,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable in strict privacy modes. Keep the in-memory
    // consent update for the current page and avoid failing the site.
  }

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, {detail: next}));
  return next;
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
  window.gtag('consent', 'default', deniedConsent);
}

function updateGtagConsent(consent) {
  ensureGtag();
  window.gtag(
    'consent',
    'update',
    consent.analytics ? analyticsGrantedConsent : deniedConsent,
  );
}

function trackPageView() {
  if (!window.gtag || !storedConsent()?.analytics) {
    return;
  }

  const currentPath = pagePath();
  if (currentPath === lastTrackedLocation) {
    return;
  }
  lastTrackedLocation = currentPath;

  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: currentPath,
  });
}

function loadGtag() {
  const {measurementId} = getAnalyticsConfig();
  if (!measurementId || gtagLoaded) {
    return;
  }

  ensureGtag();
  gtagLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    measurementId,
  )}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });

  trackPageView();
}

function applyConsent(consent) {
  updateGtagConsent(consent);
  if (consent.analytics) {
    loadGtag();
  }
}

function trackEvent(name, params = {}) {
  if (!name || !window.gtag || !storedConsent()?.analytics) {
    return;
  }

  window.gtag('event', name, {
    ...pageContext(),
    ...normalizeParams(params),
  });
}

function isDownloadUrl(urlValue) {
  try {
    const url = new URL(urlValue, window.location.href);
    const ext = url.pathname.split('.').pop()?.toLowerCase();
    return DOWNLOAD_EXTENSIONS.has(ext || '');
  } catch {
    return false;
  }
}

function linkUrl(link) {
  try {
    return new URL(link.getAttribute('href'), window.location.href).toString();
  } catch {
    return link.getAttribute('href') || '';
  }
}

function linkText(link) {
  return cleanString(link?.textContent || link?.getAttribute('aria-label'), 120);
}

function bindInteractionTracking() {
  if (document.body.dataset.developerCenterAnalyticsBound === '1') {
    return;
  }
  document.body.dataset.developerCenterAnalyticsBound = '1';

  document.addEventListener(
    'click',
    (event) => {
      const link = event.target?.closest?.('a[href]');
      if (!link) {
        return;
      }

      const href = linkUrl(link);
      const text = linkText(link);
      const params = {
        link_text: text,
        link_url: href,
      };

      if (link.closest('[aria-label="Documentation sections"]')) {
        trackEvent('developer_center_section_click', params);
      } else if (isDownloadUrl(href)) {
        trackEvent('developer_center_download_click', params);
      } else if (!href.startsWith(window.location.origin) && /^https?:\/\//i.test(href)) {
        trackEvent('developer_center_external_link_click', params);
      }
    },
    true,
  );
}

function closeConsentUi() {
  document.querySelectorAll('.cookie-consent').forEach((el) => el.remove());
}

function renderPreferences() {
  closeConsentUi();
  const consent = storedConsent();
  const analyticsEnabled = consent?.analytics ?? false;

  const panel = document.createElement('section');
  panel.className = 'cookie-consent cookie-consent--panel';
  panel.setAttribute('aria-label', 'Cookie preferences');
  panel.innerHTML = `
    <div class="cookie-consent__content">
      <p class="cookie-consent__eyebrow">Privacy preferences</p>
      <h2 class="cookie-consent__title">Cookie settings</h2>
      <p class="cookie-consent__text">Necessary storage keeps the Developer Center working. Optional analytics helps SiMa.ai understand aggregate site usage. Marketing cookies are not used on this site today.</p>
      <label class="cookie-consent__toggle">
        <span>
          <strong>Analytics</strong>
          <small>Google Analytics 4, loaded only after consent.</small>
        </span>
        <input type="checkbox" ${analyticsEnabled ? 'checked' : ''} />
      </label>
      <div class="cookie-consent__details">
        <h3>What is collected</h3>
        <p>When analytics is accepted, the site may collect aggregate usage such as page views, navigation paths, and engagement events. The site should not send names, email addresses, account identifiers, or other personal content to analytics.</p>
        <h3>Your choices</h3>
        <p>You can accept or reject optional analytics. The Developer Center continues to work either way, and these settings can be reopened from this page.</p>
      </div>
      <p class="cookie-consent__note">Global Privacy Control is respected by keeping marketing disabled.</p>
    </div>
    <div class="cookie-consent__actions">
      <button type="button" class="button button--primary" data-cookie-save>Save settings</button>
      <button type="button" class="button button--secondary" data-cookie-reject>Reject optional analytics</button>
    </div>
  `;

  panel.querySelector('[data-cookie-save]').addEventListener('click', () => {
    const input = panel.querySelector("input[type='checkbox']");
    applyConsent(setStoredConsent({analytics: input.checked}));
    closeConsentUi();
  });
  panel.querySelector('[data-cookie-reject]').addEventListener('click', () => {
    applyConsent(setStoredConsent({analytics: false}));
    closeConsentUi();
  });

  document.body.appendChild(panel);
}

function renderBanner() {
  if (document.querySelector('.cookie-consent')) {
    return;
  }

  const banner = document.createElement('section');
  banner.className = 'cookie-consent cookie-consent--banner';
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.innerHTML = `
    <div class="cookie-consent__content">
      <p class="cookie-consent__eyebrow">Privacy</p>
      <h2 class="cookie-consent__title">Help improve the Developer Center</h2>
      <p class="cookie-consent__text">We use optional Google Analytics cookies to understand aggregate site usage. The Developer Center works without them.</p>
      <div class="cookie-consent__details">
        <h3>What is collected</h3>
        <p>When analytics is accepted, the site may collect aggregate usage such as page views, navigation paths, and engagement events. The site should not send names, email addresses, account identifiers, or other personal content to analytics.</p>
        <h3>Your choices</h3>
        <p>You can accept or reject optional analytics now and reopen these settings later.</p>
      </div>
    </div>
    <div class="cookie-consent__actions">
      <button type="button" class="button button--primary" data-cookie-accept>Accept analytics</button>
      <button type="button" class="button button--secondary" data-cookie-reject>Reject optional analytics</button>
    </div>
  `;

  banner.querySelector('[data-cookie-accept]').addEventListener('click', () => {
    applyConsent(setStoredConsent({analytics: true}));
    closeConsentUi();
  });
  banner.querySelector('[data-cookie-reject]').addEventListener('click', () => {
    applyConsent(setStoredConsent({analytics: false}));
    closeConsentUi();
  });

  document.body.appendChild(banner);
}

function bindPreferenceLinks() {
  document.querySelectorAll('[data-cookie-preferences]').forEach((button) => {
    if (button.dataset.cookieBound === '1') {
      return;
    }
    button.dataset.cookieBound = '1';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      renderPreferences();
    });
  });
}

function initConsent() {
  ensureGtag();
  window.developerCenterTrack = trackEvent;
  window.addEventListener(TRACK_EVENT, (event) => {
    const detail = event?.detail || {};
    trackEvent(detail.name, detail.params);
  });

  bindInteractionTracking();
  bindPreferenceLinks();

  const consent = storedConsent();
  if (consent) {
    applyConsent(consent);
    return;
  }

  if (navigator.globalPrivacyControl === true) {
    updateGtagConsent({analytics: false});
  }

  renderBanner();
}

export function onClientEntry() {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }
  initConsent();
}

export function onRouteDidUpdate() {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }

  bindPreferenceLinks();
  const consent = storedConsent();
  if (!consent) {
    renderBanner();
    return;
  }
  if (consent.analytics) {
    window.setTimeout(trackPageView, 80);
  }
}

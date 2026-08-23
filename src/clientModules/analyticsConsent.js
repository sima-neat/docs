import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';
import docusaurusI18n from '@generated/i18n';
import developerCenterShell from '../developerCenter/shell/config.cjs';

const SITE_ROOT = developerCenterShell.deploymentSiteRoot(
  siteConfig.baseUrl || '/',
  docusaurusI18n.currentLocale,
);

const CONSENT_KEY = 'sima-developer-center-cookie-consent';
const CONSENT_VERSION = 1;
const CONSENT_EVENT = 'developer-center:analytics-consent';
const TRACK_EVENT = 'developer-center:analytics-track';
const DOWNLOAD_EXTENSIONS = new Set(['deb', 'gz', 'tgz', 'whl', 'zip', 'pdf']);
const CONSENT_COPY = {
  en: {
    preferencesLabel: 'Cookie preferences', preferencesEyebrow: 'Privacy preferences', settingsTitle: 'Cookie settings',
    settingsText: 'Necessary storage keeps the Developer Center working. Optional analytics helps SiMa.ai understand aggregate site usage. Marketing cookies are not used on this site today.',
    analytics: 'Analytics', analyticsDescription: 'Google Analytics 4, loaded only after consent.',
    collectedTitle: 'What is collected', collectedText: 'When analytics is accepted, the site may collect aggregate usage such as page views, navigation paths, and engagement events. The site should not send names, email addresses, account identifiers, or other personal content to analytics.',
    choicesTitle: 'Your choices', preferencesChoices: 'You can accept or reject optional analytics. The Developer Center continues to work either way, and these settings can be reopened from this page.',
    bannerChoices: 'You can accept or reject optional analytics now and reopen these settings later.',
    privacyNote: 'Global Privacy Control is respected by keeping marketing disabled.', save: 'Save settings', reject: 'Reject optional analytics',
    noticeLabel: 'Cookie notice', privacy: 'Privacy', bannerTitle: 'Help improve the Developer Center',
    bannerText: 'We use optional Google Analytics cookies to understand aggregate site usage. The Developer Center works without them.', accept: 'Accept analytics', preferencesLink: 'Cookie preferences', feedbackLink: 'Documentation feedback',
  },
  ko: {
    preferencesLabel: '쿠키 환경설정', preferencesEyebrow: '개인정보 보호 설정', settingsTitle: '쿠키 설정',
    settingsText: '필수 저장소는 개발자 센터의 작동을 유지합니다. 선택적 분석은 SiMa.ai가 집계된 사이트 사용 현황을 이해하는 데 도움이 됩니다. 현재 이 사이트는 마케팅 쿠키를 사용하지 않습니다.',
    analytics: '분석', analyticsDescription: '동의한 후에만 로드되는 Google Analytics 4입니다.',
    collectedTitle: '수집 정보', collectedText: '분석에 동의하면 페이지 조회, 탐색 경로, 참여 이벤트와 같은 집계된 사용 정보가 수집될 수 있습니다. 이름, 이메일 주소, 계정 식별자 또는 기타 개인 콘텐츠는 분석 서비스로 전송되지 않아야 합니다.',
    choicesTitle: '선택 사항', preferencesChoices: '선택적 분석을 허용하거나 거부할 수 있습니다. 어떤 선택을 해도 개발자 센터는 계속 작동하며 이 페이지에서 설정을 다시 열 수 있습니다.',
    bannerChoices: '지금 선택적 분석을 허용하거나 거부하고 나중에 이 설정을 다시 열 수 있습니다.',
    privacyNote: '마케팅을 비활성화하여 Global Privacy Control을 준수합니다.', save: '설정 저장', reject: '선택적 분석 거부',
    noticeLabel: '쿠키 알림', privacy: '개인정보 보호', bannerTitle: '개발자 센터 개선에 참여해 주세요',
    bannerText: '집계된 사이트 사용 현황을 이해하기 위해 선택적 Google Analytics 쿠키를 사용합니다. 쿠키를 허용하지 않아도 개발자 센터는 작동합니다.', accept: '분석 허용', preferencesLink: '쿠키 환경설정', feedbackLink: '문서 피드백',
  },
  ja: {
    preferencesLabel: 'Cookie の設定', preferencesEyebrow: 'プライバシー設定', settingsTitle: 'Cookie 設定',
    settingsText: '必須ストレージはデベロッパーセンターの動作に必要です。任意の分析は、SiMa.ai がサイト利用状況の集計を把握するために役立ちます。現在、このサイトではマーケティング Cookie を使用していません。',
    analytics: '分析', analyticsDescription: '同意後にのみ読み込まれる Google Analytics 4 です。',
    collectedTitle: '収集される情報', collectedText: '分析に同意すると、ページビュー、移動経路、操作イベントなどの集計された利用情報が収集される場合があります。氏名、メールアドレス、アカウント識別子、その他の個人情報は分析サービスに送信されません。',
    choicesTitle: '選択肢', preferencesChoices: '任意の分析を許可または拒否できます。どちらを選択してもデベロッパーセンターは動作し、このページから設定を再度開けます。',
    bannerChoices: '任意の分析を今すぐ許可または拒否し、後で設定を再度開けます。',
    privacyNote: 'マーケティングを無効にすることで Global Privacy Control を尊重します。', save: '設定を保存', reject: '任意の分析を拒否',
    noticeLabel: 'Cookie に関するお知らせ', privacy: 'プライバシー', bannerTitle: 'デベロッパーセンターの改善にご協力ください',
    bannerText: 'サイト利用状況の集計を把握するため、任意の Google Analytics Cookie を使用します。許可しなくてもデベロッパーセンターは動作します。', accept: '分析を許可', preferencesLink: 'Cookie の設定', feedbackLink: 'ドキュメントのフィードバック',
  },
  'zh-Hant': {
    preferencesLabel: 'Cookie 偏好設定', preferencesEyebrow: '隱私權偏好設定', settingsTitle: 'Cookie 設定',
    settingsText: '必要的儲存空間可讓開發者中心正常運作。選用的分析功能可協助 SiMa.ai 瞭解彙總的網站使用情況。目前本網站不使用行銷 Cookie。',
    analytics: '分析', analyticsDescription: '僅在您同意後載入 Google Analytics 4。',
    collectedTitle: '收集的資訊', collectedText: '接受分析後，網站可能會收集頁面瀏覽、導覽路徑和互動事件等彙總使用資訊。網站不會將姓名、電子郵件地址、帳戶識別碼或其他個人內容傳送至分析服務。',
    choicesTitle: '您的選擇', preferencesChoices: '您可以接受或拒絕選用的分析功能。無論如何選擇，開發者中心都會繼續運作，且您可從此頁面重新開啟這些設定。',
    bannerChoices: '您現在可以接受或拒絕選用的分析功能，稍後也可重新開啟這些設定。',
    privacyNote: '我們會停用行銷功能，以尊重全域隱私控制 (GPC)。', save: '儲存設定', reject: '拒絕選用分析',
    noticeLabel: 'Cookie 通知', privacy: '隱私權', bannerTitle: '協助改善開發者中心',
    bannerText: '我們使用選用的 Google Analytics Cookie 來瞭解彙總的網站使用情況。即使不允許，開發者中心仍可正常運作。', accept: '接受分析', preferencesLink: 'Cookie 偏好設定', feedbackLink: '文件意見回饋',
  },
  uk: {
    preferencesLabel: 'Налаштування файлів cookie', preferencesEyebrow: 'Налаштування конфіденційності', settingsTitle: 'Налаштування файлів cookie',
    settingsText: 'Необхідне сховище забезпечує роботу Центру розробника. Необов’язкова аналітика допомагає SiMa.ai розуміти сукупне використання сайту. Наразі цей сайт не використовує маркетингові файли cookie.',
    analytics: 'Аналітика', analyticsDescription: 'Google Analytics 4 завантажується лише після надання згоди.',
    collectedTitle: 'Які дані збираються', collectedText: 'Після згоди на аналітику сайт може збирати сукупні дані про перегляди сторінок, шляхи навігації та події взаємодії. Сайт не надсилає до аналітики імена, адреси електронної пошти, ідентифікатори облікових записів чи інший особистий вміст.',
    choicesTitle: 'Ваш вибір', preferencesChoices: 'Ви можете дозволити або відхилити необов’язкову аналітику. Центр розробника працюватиме в обох випадках, а ці налаштування можна знову відкрити на цій сторінці.',
    bannerChoices: 'Ви можете зараз дозволити або відхилити необов’язкову аналітику й повернутися до цих налаштувань пізніше.',
    privacyNote: 'Глобальний контроль конфіденційності враховується завдяки вимкненню маркетингу.', save: 'Зберегти налаштування', reject: 'Відхилити необов’язкову аналітику',
    noticeLabel: 'Повідомлення про файли cookie', privacy: 'Конфіденційність', bannerTitle: 'Допоможіть покращити Центр розробника',
    bannerText: 'Ми використовуємо необов’язкові файли cookie Google Analytics, щоб розуміти сукупне використання сайту. Центр розробника працює і без них.', accept: 'Дозволити аналітику', preferencesLink: 'Налаштування файлів cookie', feedbackLink: 'Відгук про документацію',
  },
};

let gtagLoaded = false;
let lastTrackedLocation = '';
let preferenceLinksBound = false;
let initialized = false;
let selectedConsentLocale = null;

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

function activeLocale() {
  const routePath = developerCenterShell.withoutSiteRoot(
    window.location.pathname,
    SITE_ROOT,
  );
  const routeLocale = routePath.split('/').filter(Boolean)[0];
  if (routeLocale !== developerCenterShell.DEFAULT_LOCALE && CONSENT_COPY[routeLocale]) {
    return routeLocale;
  }
  return selectedConsentLocale || developerCenterShell.DEFAULT_LOCALE;
}

function consentCopy() {
  return CONSENT_COPY[activeLocale()] || CONSENT_COPY.en;
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
  const routePath = developerCenterShell.withoutSiteRoot(
    pathname,
    SITE_ROOT,
  );
  const parts = routePath.split('/').filter(Boolean);
  if (developerCenterShell.SUPPORTED_LOCALES.some(({code}) => code === parts[0])) {
    parts.shift();
  }
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

      if (link.closest('[data-developer-center-sections]')) {
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
  const copy = consentCopy();
  const consent = storedConsent();
  const analyticsEnabled = consent?.analytics ?? false;

  const panel = document.createElement('section');
  panel.className = 'cookie-consent cookie-consent--panel';
  panel.setAttribute('aria-label', copy.preferencesLabel);
  panel.innerHTML = `
    <div class="cookie-consent__content">
      <p class="cookie-consent__eyebrow">${copy.preferencesEyebrow}</p>
      <h2 class="cookie-consent__title">${copy.settingsTitle}</h2>
      <p class="cookie-consent__text">${copy.settingsText}</p>
      <label class="cookie-consent__toggle">
        <span>
          <strong>${copy.analytics}</strong>
          <small>${copy.analyticsDescription}</small>
        </span>
        <input type="checkbox" ${analyticsEnabled ? 'checked' : ''} />
      </label>
      <div class="cookie-consent__details">
        <h3>${copy.collectedTitle}</h3>
        <p>${copy.collectedText}</p>
        <h3>${copy.choicesTitle}</h3>
        <p>${copy.preferencesChoices}</p>
      </div>
      <p class="cookie-consent__note">${copy.privacyNote}</p>
    </div>
    <div class="cookie-consent__actions">
      <button type="button" class="button button--primary" data-cookie-save>${copy.save}</button>
      <button type="button" class="button button--secondary" data-cookie-reject>${copy.reject}</button>
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

  const copy = consentCopy();
  const banner = document.createElement('section');
  banner.className = 'cookie-consent cookie-consent--banner';
  banner.setAttribute('aria-label', copy.noticeLabel);
  banner.innerHTML = `
    <div class="cookie-consent__content">
      <p class="cookie-consent__eyebrow">${copy.privacy}</p>
      <h2 class="cookie-consent__title">${copy.bannerTitle}</h2>
      <p class="cookie-consent__text">${copy.bannerText}</p>
      <div class="cookie-consent__details">
        <h3>${copy.collectedTitle}</h3>
        <p>${copy.collectedText}</p>
        <h3>${copy.choicesTitle}</h3>
        <p>${copy.bannerChoices}</p>
      </div>
    </div>
    <div class="cookie-consent__actions">
      <button type="button" class="button button--primary" data-cookie-accept>${copy.accept}</button>
      <button type="button" class="button button--secondary" data-cookie-reject>${copy.reject}</button>
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

function syncLocalizedFooterCopy() {
  const copy = consentCopy();
  document.querySelectorAll('[data-cookie-preferences]').forEach((link) => {
    link.textContent = copy.preferencesLink;
  });
  document.querySelectorAll('[data-documentation-feedback]').forEach((link) => {
    link.textContent = copy.feedbackLink;
  });
}

function bindPreferenceLinks() {
  syncLocalizedFooterCopy();
  if (preferenceLinksBound) {
    return;
  }
  preferenceLinksBound = true;

  document.addEventListener(
    'click',
    (event) => {
      if (!event.target?.closest?.('[data-cookie-preferences]')) {
        return;
      }
      event.preventDefault();
      renderPreferences();
    },
    true,
  );
}

function onLanguageChange(event) {
  const locale = event?.detail?.locale;
  if (!CONSENT_COPY[locale]) {
    return;
  }
  selectedConsentLocale = locale;
  syncLocalizedFooterCopy();

  const preferencesOpen = Boolean(document.querySelector('.cookie-consent--panel'));
  const bannerOpen = Boolean(document.querySelector('.cookie-consent--banner'));
  if (!preferencesOpen && !bannerOpen) {
    return;
  }
  closeConsentUi();
  if (preferencesOpen) {
    renderPreferences();
  } else {
    renderBanner();
  }
}

function initConsent() {
  if (initialized) {
    return;
  }
  initialized = true;
  window.addEventListener('developer-center-language-change', onLanguageChange);

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

  // onClientEntry does not fire reliably in the deployed build, so run the
  // one-time init here too (it is idempotent). Without this, gtag is never
  // bootstrapped on a page load and trackPageView() silently no-ops, so the
  // only page_view ever recorded is the one emitted by the consent banner's
  // accept handler — which is why analytics only captured the landing page.
  initConsent();

  bindPreferenceLinks();
  const consent = storedConsent();
  if (!consent) {
    renderBanner();
    return;
  }
  if (consent.analytics) {
    // applyConsent is idempotent (loadGtag guards on gtagLoaded); it guarantees
    // gtag is loaded for returning visitors whose consent was stored on a
    // previous visit, so the view below is actually sent.
    applyConsent(consent);
    window.setTimeout(trackPageView, 80);
  }
}

const SECTION_ROUTES = {
  home: '/',
  hardware: '/hardware',
  software: '/software',
  examples: '/examples/',
};

const EXTERNAL_ROUTES = {
  models: 'https://huggingface.co/simaai',
  community: 'https://community.sima.ai',
};

const THEME_COOKIE = 'sima-neat-theme';
const THEME_KEYS = ['theme', 'portal-theme'];
const VALID_THEMES = ['light', 'dark'];
const LOCALE_COOKIE = 'sima-neat-locale';
const LOCALE_KEY = 'sima-neat-locale';
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = [
  {code: 'en', shortLabel: '🇺🇸', label: 'English', htmlLang: 'en-US'},
  {code: 'ko', shortLabel: '🇰🇷', label: '한국어', htmlLang: 'ko-KR'},
  {code: 'ja', shortLabel: '🇯🇵', label: '日本語', htmlLang: 'ja-JP'},
  {code: 'zh-Hant', shortLabel: '🇹🇼', label: '繁體中文', htmlLang: 'zh-Hant-TW'},
  {code: 'uk', shortLabel: '🇺🇦', label: 'Українська', htmlLang: 'uk-UA'},
];
const SHELL_TRANSLATIONS = {
  en: {
    brand: 'Developer Portal',
    landing: {
      kicker: 'Developer Center',
      title: 'Open, Simple, Performant, Neat!',
      summary: 'Learn how to build physical AI with SiMa.ai technology. Explore hardware interfaces, software tools, and best practices for building high-performance AI applications.',
      sectionsLabel: 'Documentation sections',
    },
    search: {
      label: 'Search',
      placeholder: 'Search Developer Center',
      clear: 'Clear search',
    },
    navItems: {
      hardware: 'Hardware',
      software: 'Software',
      examples: 'Examples',
      models: 'Models',
      community: 'Community',
    },
  },
  ko: {
    brand: '개발자 포털',
    landing: {
      kicker: '개발자 센터',
      title: '개방적이고, 단순하며, 뛰어난 성능의 Neat!',
      summary: 'SiMa.ai 기술로 피지컬 AI를 구축하는 방법을 알아보세요. 하드웨어 인터페이스, 소프트웨어 도구, 고성능 AI 애플리케이션 구축을 위한 모범 사례를 살펴보세요.',
      sectionsLabel: '문서 섹션',
    },
    search: {
      label: '검색',
      placeholder: '개발자 센터 검색',
      clear: '검색 지우기',
    },
    navItems: {
      hardware: '하드웨어',
      software: '소프트웨어',
      examples: '예제',
      models: '모델',
      community: '커뮤니티',
    },
  },
  ja: {
    brand: '開発者ポータル',
    landing: {
      kicker: 'デベロッパーセンター',
      title: 'オープン、シンプル、高性能、Neat！',
      summary: 'SiMa.ai のテクノロジーを使用してフィジカル AI を構築する方法を学びましょう。ハードウェアインターフェース、ソフトウェアツール、高性能 AI アプリケーションを構築するためのベストプラクティスをご覧ください。',
      sectionsLabel: 'ドキュメントセクション',
    },
    search: {
      label: '検索',
      placeholder: 'デベロッパーセンターを検索',
      clear: '検索をクリア',
    },
    navItems: {
      hardware: 'ハードウェア',
      software: 'ソフトウェア',
      examples: '使用例',
      models: 'モデル',
      community: 'コミュニティ',
    },
  },
  'zh-Hant': {
    brand: '開發者入口網站',
    landing: {
      kicker: '開發者中心',
      title: '開放、簡單、高效能、Neat！',
      summary: '瞭解如何運用 SiMa.ai 技術打造實體 AI。探索硬體介面、軟體工具，以及建置高效能 AI 應用程式的最佳實務。',
      sectionsLabel: '文件區段',
    },
    search: {
      label: '搜尋',
      placeholder: '搜尋開發者中心',
      clear: '清除搜尋',
    },
    navItems: {
      hardware: '硬體',
      software: '軟體',
      examples: '範例',
      models: '模型',
      community: '社群',
    },
  },
  uk: {
    brand: 'Портал розробника',
    landing: {
      kicker: 'Центр розробника',
      title: 'Відкрито, просто, продуктивно, Neat!',
      summary: 'Дізнайтеся, як створювати фізичний ШІ за допомогою технологій SiMa.ai. Ознайомтеся з апаратними інтерфейсами, програмними інструментами та найкращими практиками створення високопродуктивних застосунків ШІ.',
      sectionsLabel: 'Розділи документації',
    },
    search: {
      label: 'Пошук',
      placeholder: 'Пошук у Центрі розробника',
      clear: 'Очистити пошук',
    },
    navItems: {
      hardware: 'Апаратне забезпечення',
      software: 'Програмне забезпечення',
      examples: 'Приклади',
      models: 'Моделі',
      community: 'Спільнота',
    },
  },
};

const routeItems = [
  {
    key: 'hardware',
    label: 'Hardware',
    href: SECTION_ROUTES.hardware,
    tone: 'orange',
  },
  {
    key: 'software',
    label: 'Software',
    href: SECTION_ROUTES.software,
    tone: 'blue',
  },
  {
    key: 'examples',
    label: 'Examples',
    href: SECTION_ROUTES.examples,
    tone: 'green',
  },
];

const externalItems = [
  {
    key: 'models',
    label: 'Models',
    href: EXTERNAL_ROUTES.models,
    tone: 'black',
    external: true,
  },
  {
    key: 'community',
    label: 'Community',
    href: EXTERNAL_ROUTES.community,
    tone: 'lime',
    external: true,
  },
];

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function withoutLocalePrefix(pathname) {
  const normalized = normalizePath(pathname);
  const segments = normalized.split('/').filter(Boolean);
  if (SUPPORTED_LOCALES.some((locale) => locale.code !== DEFAULT_LOCALE && locale.code === segments[0])) {
    segments.shift();
    return `/${segments.join('/')}`;
  }
  return normalized;
}

function withLocalePrefixFromPath(destination, pathname) {
  const segments = normalizePath(pathname).split('/').filter(Boolean);
  const routeLocale = SUPPORTED_LOCALES.find(
    (locale) => locale.code !== DEFAULT_LOCALE && locale.code === segments[0],
  );
  if (!routeLocale) {
    return destination;
  }

  return `/${routeLocale.code}${destination}`;
}

function isCloudFrontRoutedPath(pathname) {
  const normalized = normalizePath(pathname);
  return routeItems.some((item) => normalizePath(item.href) === normalized);
}

function activeSectionForPath(pathname) {
  const normalized = withoutLocalePrefix(pathname);
  const match = routeItems.find((item) => normalizePath(item.href) === normalized);
  if (match) return match.key;
  if (normalized.startsWith(`${SECTION_ROUTES.hardware}/`)) return 'hardware';
  if (normalized.startsWith(`${SECTION_ROUTES.software}/`)) return 'software';
  return 'home';
}

function withSiteRoot(href, siteRoot = '') {
  if (!siteRoot || !href.startsWith('/')) {
    return href;
  }

  return `${siteRoot.replace(/\/+$/, '')}${href}`;
}

function navbarItems(siteRoot = '') {
  return [...routeItems, ...externalItems].map((item) => ({
    ...item,
    href: item.external ? item.href : withSiteRoot(item.href, siteRoot),
  }));
}

function docusaurusNavbarItems(siteRoot = '') {
  return navbarItems(siteRoot).map((item) => ({
    href: item.href,
    label: item.label,
    position: 'left',
  }));
}

module.exports = {
  SECTION_ROUTES,
  EXTERNAL_ROUTES,
  THEME_COOKIE,
  THEME_KEYS,
  VALID_THEMES,
  LOCALE_COOKIE,
  LOCALE_KEY,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  SHELL_TRANSLATIONS,
  activeSectionForPath,
  docusaurusNavbarItems,
  externalItems,
  isCloudFrontRoutedPath,
  navbarItems,
  normalizePath,
  withoutLocalePrefix,
  withLocalePrefixFromPath,
  routeItems,
};

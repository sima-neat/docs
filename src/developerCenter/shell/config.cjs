const SECTION_ROUTES = {
  home: '/',
  hardware: '/hardware',
  software: '/software',
  examples: '/examples/',
};

const EXTERNAL_ROUTES = {
  models: 'https://huggingface.co/simaai',
  community: 'https://developer.sima.ai',
};

const THEME_COOKIE = 'sima-neat-theme';
const THEME_KEYS = ['theme', 'portal-theme'];
const VALID_THEMES = ['light', 'dark'];

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

function isCloudFrontRoutedPath(pathname) {
  const normalized = normalizePath(pathname);
  return routeItems.some((item) => normalizePath(item.href) === normalized);
}

function activeSectionForPath(pathname) {
  const normalized = normalizePath(pathname);
  const match = routeItems.find((item) => normalizePath(item.href) === normalized);
  return match ? match.key : 'home';
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
  activeSectionForPath,
  docusaurusNavbarItems,
  externalItems,
  isCloudFrontRoutedPath,
  navbarItems,
  normalizePath,
  routeItems,
};

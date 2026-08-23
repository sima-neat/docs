// @ts-check

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;
const developerCenterShell = require('./src/developerCenter/shell/config.cjs');

const url = process.env.SYSDOC_URL || 'https://sysdoc.neat.sima.ai';
const baseUrl = process.env.SYSDOC_BASE_URL || '/';
const analyticsConfig = {
  measurementId: process.env.SYSDOC_GA_MEASUREMENT_ID || '',
};

// Runs in <head>, before Docusaurus's (in-<body>) color-mode init script. The
// theme preference is shared across docs sections via the cookie (which carries
// a parent Domain), but localStorage is per-subdomain — so Docusaurus would read
// an empty localStorage on a fresh section and reset to light. Seed
// localStorage.theme from the cookie here so Docusaurus initializes to the
// user's actual choice and dark mode persists across section navigations.
const themeBootstrapScript = `(function(){try{
  var m=document.cookie.match(/(?:^|; )${developerCenterShell.THEME_COOKIE}=([^;]*)/);
  var t=m?decodeURIComponent(m[1]):null;
  if(${JSON.stringify(developerCenterShell.VALID_THEMES)}.indexOf(t)===-1)return;
  ${JSON.stringify(developerCenterShell.THEME_KEYS)}.forEach(function(k){try{window.localStorage.setItem(k,t)}catch(e){}});
  document.documentElement.setAttribute('data-theme',t);
  document.documentElement.setAttribute('data-theme-choice',t);
}catch(e){}})();`;

// Apply the cross-site documentation-language preference before Docusaurus
// hydrates so Hardware and Software switch without flashing the previous
// locale. Hardware's locale prefix precedes its route base (`/ja/hardware`).
const languageBootstrapScript = `(function(){try{
  var supported=${JSON.stringify(developerCenterShell.SUPPORTED_LOCALES.map(({code}) => code))};
  var m=document.cookie.match(/(?:^|; )${developerCenterShell.LOCALE_COOKIE}=([^;]*)/);
  var preferred=null;
  if(m){try{preferred=decodeURIComponent(m[1])}catch(e){}}
  if(supported.indexOf(preferred)===-1){try{preferred=window.localStorage.getItem(${JSON.stringify(developerCenterShell.LOCALE_KEY)})}catch(e){}}
  if(supported.indexOf(preferred)===-1)return;
  var parts=window.location.pathname.split('/').filter(Boolean);
  var baseParts=${JSON.stringify(baseUrl.split('/').filter(Boolean))};
  var routeParts=parts.slice(0,baseParts.length).join('/')===baseParts.join('/')?parts.slice(baseParts.length):parts;
  var landingLocale=routeParts.length===0?${JSON.stringify(developerCenterShell.DEFAULT_LOCALE)}:(routeParts.length===1&&supported.indexOf(routeParts[0])>0?routeParts[0]:null);
  if(landingLocale!==null){
    if(landingLocale===preferred)return;
    var destinationParts=baseParts.slice();
    if(preferred!==${JSON.stringify(developerCenterShell.DEFAULT_LOCALE)})destinationParts.push(preferred);
    var destination='/'+destinationParts.join('/');
    if(destination!=='/')destination+='/'
    window.location.replace(destination+window.location.search+window.location.hash);
    return;
  }
  var hardwareIndex=parts.indexOf('hardware');
  if(hardwareIndex<0)return;
  var localeIndex=hardwareIndex>0&&supported.indexOf(parts[hardwareIndex-1])>0?hardwareIndex-1:-1;
  var current=localeIndex>=0?parts[localeIndex]:${JSON.stringify(developerCenterShell.DEFAULT_LOCALE)};
  if(current===preferred)return;
  if(localeIndex>=0)parts.splice(localeIndex,1);
  if(preferred!==${JSON.stringify(developerCenterShell.DEFAULT_LOCALE)}){
    hardwareIndex=parts.indexOf('hardware');
    parts.splice(hardwareIndex,0,preferred);
  }
  window.location.replace('/'+parts.join('/')+window.location.search+window.location.hash);
}catch(e){}})();`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SiMa.ai System Documentation',
  tagline: 'Hardware, software, and developer resources for SiMa.ai systems.',
  favicon: 'img/sima-logo.png',
  url,
  baseUrl,
  organizationName: 'sima-neat',
  projectName: 'docs',
  trailingSlash: false,
  headTags: [
    {
      tagName: 'script',
      attributes: {},
      innerHTML: themeBootstrapScript,
    },
    {
      tagName: 'script',
      attributes: {},
      innerHTML: languageBootstrapScript,
    },
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `window.__DEVELOPER_CENTER_ANALYTICS__ = ${JSON.stringify(analyticsConfig)};`,
    },
  ],
  clientModules: [
    require.resolve('./src/clientModules/analyticsConsent.js'),
    require.resolve('./src/clientModules/cloudfrontRoutes.js'),
    require.resolve('./src/clientModules/developerCenterShell.js'),
    require.resolve('./src/clientModules/developerCenterNav.js'),
    require.resolve('./src/clientModules/firmwareUpdateTabs.js'),
    require.resolve('./src/clientModules/globalTheme.js'),
    require.resolve('./src/clientModules/collapseSidebarOnHome.js'),
  ],
  onBrokenLinks: process.env.SYSDOC_STRICT_LINKS === '1' ? 'throw' : 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: developerCenterShell.SUPPORTED_LOCALES.map(({code}) => code),
    localeConfigs: Object.fromEntries(
      developerCenterShell.SUPPORTED_LOCALES.map(({code, label, htmlLang}) => [
        code,
        {label, htmlLang},
      ]),
    ),
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'hardware',
          // Substitute %platform_version% (and any other key in src/versions.cjs) at build
          // time, including inside fenced code blocks. See src/remark/substituteVersions.cjs.
          remarkPlugins: [require('./src/remark/substituteVersions.cjs')],
        },
        pages: {
          // src/pages/agents.md (served at /agents) uses the same %key% tokens.
          remarkPlugins: [require('./src/remark/substituteVersions.cjs')],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/sima-logo.png',
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: 'Developer Center',
        logo: {
          alt: 'SiMa.ai',
          src: 'img/sima-logo.png',
        },
        items: [
          ...developerCenterShell.docusaurusNavbarItems(),
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            html: '<a class="footer__link-item" href="https://github.com/sima-neat/docs/issues/new?template=doc-feedback-report.md" data-documentation-feedback>Documentation feedback</a>',
          },
          {
            html: '<button type="button" class="footer__link-item cookie-preferences-link" data-cookie-preferences>Cookie preferences</button>',
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} SiMa.ai.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  customFields: {
    analytics: analyticsConfig,
  },
};

module.exports = config;

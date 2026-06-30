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
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'hardware',
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
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            label: 'Documentation feedback',
            href: 'https://github.com/sima-neat/docs/issues/new?template=doc-feedback-report.md',
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

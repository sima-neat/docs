// @ts-check

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

const url = process.env.SYSDOC_URL || 'https://sysdoc.neat.sima.ai';
const baseUrl = process.env.SYSDOC_BASE_URL || '/';

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
  clientModules: [require.resolve('./src/clientModules/cloudfrontRoutes.js')],
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
          routeBasePath: 'docs',
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
      navbar: {
        title: 'Developer Center',
        logo: {
          alt: 'SiMa.ai',
          src: 'img/sima-logo.png',
        },
        items: [
          {type: 'doc', docId: 'hardware/index', label: 'Hardware', position: 'left'},
          {href: '/software/', label: 'Software', position: 'left'},
          {href: '/examples/', label: 'Examples', position: 'left'},
          {href: 'https://huggingface.co/simaai', label: 'Models', position: 'left'},
          {href: 'https://developer.sima.ai', label: 'Community', position: 'left'},
        ],
      },
      footer: {
        style: 'light',
        copyright: `Copyright © ${new Date().getFullYear()} SiMa.ai.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

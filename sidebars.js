// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  systemDocs: [
    'index',
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'Quick Start Guide',
          href: 'pathname:///tools/qsg/index.html',
        },
        'getting-started/setup-devkit',
        'getting-started/setup-serial',
        'getting-started/standalone-mode/index',
        'getting-started/pcie-mode',
        'getting-started/firmware-update/index',
      ],
    },
    {
      type: 'category',
      label: 'DevKit Variants',
      collapsible: true,
      collapsed: true,
      items: [
        'devkit/modalix-devkit',
        'devkit/modalix-ea-kit',
        'devkit/modalix-ea-pcie',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      collapsible: true,
      collapsed: true,
      items: [
        'tools/web-serial-console',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsible: true,
      collapsed: true,
      items: [
        'reference/bsp',
        {
          type: 'category',
          label: 'Tech Notes',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/tech-notes/index',
            'reference/tech-notes/nfs',
            'reference/tech-notes/elxr-conversion',
            'reference/tech-notes/bluetooth',
            'reference/tech-notes/ros2',
          ],
        },
        'reference/glossary',
        'reference/extra-docs',
      ],
    },
  ],
};

module.exports = sidebars;

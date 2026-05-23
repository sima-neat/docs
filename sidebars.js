// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  systemDocs: [
    'hardware/index',
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
        'hardware/getting-started/setup-devkit',
        'hardware/getting-started/setup-serial',
        'hardware/getting-started/standalone-mode/index',
        'hardware/getting-started/pcie-mode',
        'hardware/getting-started/firmware-update/index',
      ],
    },
    {
      type: 'category',
      label: 'DevKit Variants',
      collapsible: true,
      collapsed: true,
      items: [
        'hardware/devkit/modalix-devkit',
        'hardware/devkit/modalix-ea-kit',
        'hardware/devkit/modalix-ea-pcie',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      collapsible: true,
      collapsed: true,
      items: [
        'hardware/tools/web-serial-console',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsible: true,
      collapsed: true,
      items: [
        'hardware/reference/bsp',
        {
          type: 'category',
          label: 'Tech Notes',
          collapsible: true,
          collapsed: true,
          items: [
            'hardware/reference/tech-notes/index',
            'hardware/reference/tech-notes/nfs',
            'hardware/reference/tech-notes/elxr-conversion',
            'hardware/reference/tech-notes/bluetooth',
            'hardware/reference/tech-notes/ros2',
          ],
        },
        'hardware/reference/glossary',
        'hardware/reference/extra-docs',
      ],
    },
  ],
};

module.exports = sidebars;

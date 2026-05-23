// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  systemDocs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: false,
      items: [
        'hardware/index',
        'getting-started/setup-devkit',
        'getting-started/setup-serial',
        {
          type: 'category',
          label: 'Standalone Mode',
          collapsible: true,
          collapsed: false,
          items: [
            'getting-started/standalone-mode/index',
            'getting-started/standalone-mode/network',
            'getting-started/standalone-mode/nvme',
            'getting-started/standalone-mode/mipi',
          ],
        },
        'getting-started/pcie-mode',
        {
          type: 'category',
          label: 'Firmware Update',
          collapsible: true,
          collapsed: false,
          items: [
            'getting-started/firmware-update/index',
            'getting-started/firmware-update/netboot',
            'getting-started/firmware-update/sima-cli',
            'getting-started/firmware-update/bootimage',
            'getting-started/firmware-update/os',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'DevKit Variants',
      collapsible: true,
      collapsed: false,
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
      collapsed: false,
      items: [
        'tools/web-serial-console',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsible: true,
      collapsed: false,
      items: [
        'reference/bsp',
        {
          type: 'category',
          label: 'Tech Notes',
          collapsible: true,
          collapsed: false,
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

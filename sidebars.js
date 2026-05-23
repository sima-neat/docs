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
        'hardware/getting-started/setup-devkit',
        'hardware/getting-started/setup-serial',
        {
          type: 'category',
          label: 'Standalone Mode',
          collapsible: true,
          collapsed: false,
          items: [
            'hardware/getting-started/standalone-mode/index',
            'hardware/getting-started/standalone-mode/network',
            'hardware/getting-started/standalone-mode/nvme',
            'hardware/getting-started/standalone-mode/mipi',
          ],
        },
        'hardware/getting-started/pcie-mode',
        {
          type: 'category',
          label: 'Firmware Update',
          collapsible: true,
          collapsed: false,
          items: [
            'hardware/getting-started/firmware-update/index',
            'hardware/getting-started/firmware-update/netboot',
            'hardware/getting-started/firmware-update/sima-cli',
            'hardware/getting-started/firmware-update/bootimage',
            'hardware/getting-started/firmware-update/os',
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
        'hardware/devkit/modalix-devkit',
        'hardware/devkit/modalix-ea-kit',
        'hardware/devkit/modalix-ea-pcie',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      collapsible: true,
      collapsed: false,
      items: [
        'hardware/tools/web-serial-console',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsible: true,
      collapsed: false,
      items: [
        'hardware/reference/bsp',
        {
          type: 'category',
          label: 'Tech Notes',
          collapsible: true,
          collapsed: false,
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

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  systemDocs: [
    'index',
    {
      // Lives at the site root (src/pages/agents.md), not under /hardware:
      // it spans hardware setup AND the software/SDK onboarding.
      type: 'link',
      label: 'For AI Agents',
      href: '/agents',
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: true,
      link: {
        type: 'doc',
        id: 'getting-started/index',
      },
      items: [
        {
          type: 'link',
          label: 'Quick Start Guide',
          href: 'pathname:///tools/qsg/index.html',
        },
        'getting-started/setup-serial',
        {
          type: 'category',
          label: 'Standalone Mode',
          collapsible: true,
          collapsed: true,
          link: {
            type: 'doc',
            id: 'getting-started/standalone-mode/index',
          },
          items: [
            'getting-started/standalone-mode/network',
            'getting-started/standalone-mode/nvme-storage',
            'getting-started/standalone-mode/mipi-camera-interfaces',
          ],
        },
        {
          type: 'category',
          label: 'PCIe Mode',
          collapsible: true,
          collapsed: true,
          link: {
            type: 'doc',
            id: 'getting-started/pcie-mode/index',
          },
          items: [
            'getting-started/pcie-mode/hardware-preparation',
            'getting-started/pcie-mode/driver-installation',
            'getting-started/pcie-mode/virtual-network',
          ],
        },
        {
          type: 'category',
          label: 'Firmware Update',
          collapsible: true,
          collapsed: true,
          link: {
            type: 'doc',
            id: 'getting-started/firmware-update/index',
          },
          items: [
            'getting-started/firmware-update/sima-cli',
            'getting-started/firmware-update/net-boot',
            'getting-started/firmware-update/boot-image',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'DevKit Variants',
      collapsible: true,
      collapsed: true,
      items: [
        'devkit/modalix-devkit',
        'devkit/modalix-pcie-card',
        'devkit/modalix-ea-kit',
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

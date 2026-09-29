// @ts-check

// Grouped by what the reader is trying to do (sima-neat/docs#80). Routes are
// independent of this grouping: pages keep their URLs when they change section.

/** @param {string} label @param {string | undefined} link @param {any[]} items */
const section = (label, link, items) => ({
  type: 'category',
  label,
  collapsible: true,
  collapsed: true,
  ...(link ? {link: {type: 'doc', id: link}} : {}),
  items,
});

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
    section('Evaluate with a DevKit', 'getting-started/index', [
      {
        type: 'link',
        label: 'Quick Start Guide',
        href: 'pathname:///tools/qsg/index.html',
      },
      'getting-started/setup-serial',
      'getting-started/firmware-update/sima-cli',
      section('Standalone Mode', 'getting-started/standalone-mode/index', [
        'getting-started/standalone-mode/network',
      ]),
      section('PCIe Mode', 'getting-started/pcie-mode/index', [
        'getting-started/pcie-mode/hardware-preparation',
        'getting-started/pcie-mode/driver-installation',
        'getting-started/pcie-mode/virtual-network',
      ]),
      section('DevKit Variants', undefined, [
        'devkit/modalix-devkit',
        'devkit/modalix-pcie-card',
        'devkit/modalix-ea-kit',
      ]),
      'tools/web-serial-console',
    ]),
    section('Design Your Hardware', 'design/index', ['design/som-carrier']),
    section('Build & Customize eLxr', 'software/index', [
      'software/build-from-source',
      'software/release-compatibility',
      'reference/tech-notes/elxr-conversion',
    ]),
    section('Interfaces & Peripherals', undefined, [
      'interfaces/low-speed-io',
      'getting-started/standalone-mode/mipi-camera-interfaces',
      'getting-started/standalone-mode/nvme-storage',
      'reference/tech-notes/bluetooth',
    ]),
    section('Flash, Update & Recover', 'getting-started/firmware-update/index', [
      'getting-started/firmware-update/net-boot',
      'getting-started/firmware-update/boot-image',
      'deployment/flash-image',
      'deployment/factory-build-and-test',
    ]),
    section('Reference & Downloads', undefined, [
      'reference/extra-docs',
      'reference/glossary',
      section('Tech Notes', 'reference/tech-notes/index', [
        'reference/tech-notes/nfs',
        'reference/tech-notes/ros2',
      ]),
    ]),
  ],
};

module.exports = sidebars;

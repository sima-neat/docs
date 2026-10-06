// @ts-check

// Grouped into the customer workflows of sima-neat/docs#80. Routes are
// independent of this grouping: pages keep their URLs when they change section.
// A section appears here only once it has published content.

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
    // Platform Overview. The label comes from sidebar_label in the page.
    'index',
    {
      // Lives at the site root (src/pages/agents.md), not under /hardware:
      // it spans hardware setup AND the software/SDK onboarding.
      type: 'link',
      label: 'For AI Agents',
      href: '/agents',
    },
    section('Evaluate & Use a DevKit', 'getting-started/index', [
      {
        type: 'link',
        label: 'Quick Start Guide',
        href: 'pathname:///tools/qsg/index.html',
      },
      section('DevKit Variants', undefined, [
        'devkit/modalix-devkit',
        'devkit/modalix-pcie-card',
        'devkit/modalix-ea-kit',
      ]),
      'getting-started/setup-serial',
      section('Standalone Mode', 'getting-started/standalone-mode/index', [
        'getting-started/standalone-mode/network',
        'getting-started/standalone-mode/nvme-storage',
        'reference/tech-notes/bluetooth',
      ]),
      section('PCIe Mode', 'getting-started/pcie-mode/index', [
        'getting-started/pcie-mode/hardware-preparation',
        'getting-started/pcie-mode/driver-installation',
        'getting-started/pcie-mode/virtual-network',
      ]),
      // sima-cli update, net boot and boot media install SiMa.ai-provided
      // images. Flashing a customer-built image is under custom system software.
      section('Update & Recover SiMa Images', 'getting-started/firmware-update/index', [
        'getting-started/firmware-update/sima-cli',
        'getting-started/firmware-update/net-boot',
        'getting-started/firmware-update/boot-image',
        'reference/tech-notes/elxr-conversion',
      ]),
      'tools/web-serial-console',
    ]),
    section('Integrate a SoM & Carrier Board', 'design/carrier-board', [
      'design/third-party-carriers',
      'design/som-carrier',
    ]),
    // Design with the SoC — Chip-Down. One page, so not a category; the label
    // comes from sidebar_label in the page.
    'design/chip-down',
    section('Build & Deploy Custom System Software', 'software/index', [
      'software/release-compatibility',
      'software/build-from-source',
      'software/device-tree',
      'deployment/flash-image',
      'deployment/factory-build-and-test',
    ]),
    section('Integrate Cameras & Tune the ISP', undefined, [
      'interfaces/supported-cameras',
      'getting-started/standalone-mode/mipi-camera-interfaces',
    ]),
    section('Reference & Downloads', undefined, [
      'reference/extra-docs',
      'reference/devkit-interface-support',
      'interfaces/low-speed-io',
      'reference/glossary',
      section('Tech Notes', 'reference/tech-notes/index', [
        'reference/tech-notes/nfs',
        'reference/tech-notes/ros2',
      ]),
    ]),
  ],
};

module.exports = sidebars;

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  systemDocs: [
    {
      type: 'category',
      label: 'SiMa.ai Hardware',
      collapsible: false,
      collapsed: false,
      items: [
        'hardware/index',
        'hardware/setup-devkit',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      collapsible: false,
      collapsed: false,
      items: [
        'tools/web-serial-console',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsible: false,
      collapsed: false,
      items: [
        'reference/hardware-reference',
      ],
    },
  ],
};

module.exports = sidebars;

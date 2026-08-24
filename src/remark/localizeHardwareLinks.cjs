// Keep translated Markdown link targets identical to the English source so the
// shared i18n validator can verify document structure. Docusaurus stores the
// active Hardware locale before the route (`/ja/hardware`), so add that prefix
// while compiling translated documents instead of baking it into translations.

const TRANSLATED_DOC_PATH =
  /(?:^|[\\/])i18n[\\/](ko|ja|zh-Hant|uk)[\\/]docusaurus-plugin-content-docs[\\/]/;

function localeForFile(file) {
  const paths = [file?.path, ...(file?.history || [])].filter(Boolean);
  for (const filePath of paths) {
    const match = String(filePath).match(TRANSLATED_DOC_PATH);
    if (match) return match[1];
  }
  return null;
}

function localizedHardwareUrl(url, locale) {
  if (!locale || typeof url !== 'string' || !/^\/hardware(?:[/?#]|$)/.test(url)) {
    return url;
  }
  return `/${locale}${url}`;
}

function walk(node, locale) {
  if (!node || typeof node !== 'object') return;

  if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') {
    node.url = localizedHardwareUrl(node.url, locale);
  }

  if (
    (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
    Array.isArray(node.attributes)
  ) {
    for (const attribute of node.attributes) {
      if (attribute?.name === 'href' && typeof attribute.value === 'string') {
        attribute.value = localizedHardwareUrl(attribute.value, locale);
      }
    }
  }

  if (Array.isArray(node.children)) node.children.forEach((child) => walk(child, locale));
}

function localizeHardwareLinks() {
  return (tree, file) => {
    const locale = localeForFile(file);
    if (locale) walk(tree, locale);
  };
}

localizeHardwareLinks.localeForFile = localeForFile;
localizeHardwareLinks.localizedHardwareUrl = localizedHardwareUrl;

module.exports = localizeHardwareLinks;

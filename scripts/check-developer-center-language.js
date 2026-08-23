const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const docsRoot = path.resolve(__dirname, '..');
const shellSource = fs.readFileSync(
  path.join(docsRoot, 'static/developer-center-shell.js'),
  'utf8',
);
const hardwareRootSource = fs.readFileSync(
  path.join(docsRoot, 'src/theme/Root.js'),
  'utf8',
);
const landingSource = fs.readFileSync(
  path.join(docsRoot, 'src/pages/index.jsx'),
  'utf8',
);
const i18nReadmeSource = fs.readFileSync(path.join(docsRoot, 'i18n/README.md'), 'utf8');
const docusaurusConfigSource = fs.readFileSync(
  path.join(docsRoot, 'docusaurus.config.js'),
  'utf8',
);
const shellClientSource = fs.readFileSync(
  path.join(docsRoot, 'src/clientModules/developerCenterShell.js'),
  'utf8',
);
const shellNavigationSource = fs.readFileSync(
  path.join(docsRoot, 'src/developerCenter/shell/navigation.js'),
  'utf8',
);
const shellThemeSource = fs.readFileSync(
  path.join(docsRoot, 'src/developerCenter/shell/theme.js'),
  'utf8',
);
const manifest = JSON.parse(
  fs.readFileSync(path.join(docsRoot, 'static/developer-center-shell.json'), 'utf8'),
);
const shellConfig = require('../src/developerCenter/shell/config.cjs');
const expectedSidebarMessages = {
  ko: ['시작하기', '빠른 시작 가이드', 'DevKit 변형', '도구', '참조', '기술 노트'],
  ja: ['はじめに', 'クイックスタートガイド', 'DevKit バリエーション', 'ツール', 'リファレンス', '技術ノート'],
  'zh-Hant': ['開始使用', '快速入門指南', 'DevKit 型號', '工具', '參考資料', '技術說明'],
  uk: ['Початок роботи', 'Посібник зі швидкого старту', 'Варіанти DevKit', 'Інструменти', 'Довідкові матеріали', 'Технічні нотатки'],
};
const sidebarTranslationKeys = [
  'sidebar.systemDocs.category.Getting Started',
  'sidebar.systemDocs.link.Quick Start Guide',
  'sidebar.systemDocs.category.DevKit Variants',
  'sidebar.systemDocs.category.Tools',
  'sidebar.systemDocs.category.References',
  'sidebar.systemDocs.category.Tech Notes',
];
const context = {window: {}};
vm.runInNewContext(shellSource, context);

const {localeFromPath, localizedPath} = context.window.DeveloperCenterShell;
for (const [, sourcePath] of i18nReadmeSource.matchAll(/--source\s+(\S+)/g)) {
  assert.ok(
    fs.existsSync(path.join(docsRoot, sourcePath)),
    `i18n/README.md references missing translation source ${sourcePath}`,
  );
}
assert.equal(localeFromPath('/', manifest), 'en');
assert.equal(localeFromPath('/ja/', manifest), 'ja');
assert.equal(localeFromPath('/zh-Hant', manifest), 'zh-Hant');
assert.equal(localeFromPath('/ja/hardware/getting-started/', manifest), 'ja');
assert.equal(localizedPath('/hardware/getting-started/', 'ja', manifest), '/ja/hardware/getting-started/');
assert.equal(
  localizedPath('/zh-Hant/hardware/getting-started/', 'ja', manifest),
  '/ja/hardware/getting-started/',
);
assert.equal(
  localizedPath('/hardware/zh-Hant/getting-started/', 'ja', manifest),
  '/ja/hardware/getting-started/',
);
assert.equal(
  localizedPath('/software/zh-Hant/getting-started/', 'ja', manifest),
  '/software/ja/getting-started/',
);
assert.equal(
  localizedPath('/software/ja/getting-started/', 'en', manifest),
  '/software/getting-started/',
);
assert.equal(localizedPath('/examples/', 'ko', manifest), '/examples/');
assert.equal(localizedPath('/', 'ja', manifest), '/ja/');
assert.equal(localizedPath('/ja/', 'ko', manifest), '/ko/');
assert.equal(localizedPath('/ja/', 'en', manifest), '/');
assert.equal(localizedPath('/ja', 'ko', manifest), '/ko');

assert.equal(shellConfig.activeSectionForPath('/ja/hardware/getting-started/'), 'hardware');
assert.equal(shellConfig.activeSectionForPath('/software/ja/getting-started/'), 'software');
assert.equal(shellConfig.withLocalePrefixFromPath('/hardware', '/hardware/getting-started/'), '/hardware');
assert.equal(
  shellConfig.withLocalePrefixFromPath('/hardware', '/ja/hardware/getting-started/'),
  '/ja/hardware',
);
assert.deepEqual(
  manifest.language.locales.map(({label}) => label),
  ['English', '한국어', '日本語', '繁體中文', 'Українська'],
);
assert.deepEqual(
  manifest.language.locales.map(({shortLabel}) => shortLabel),
  ['🇺🇸', '🇰🇷', '🇯🇵', '🇹🇼', '🇺🇦'],
);
assert.deepEqual(manifest.language.translations, shellConfig.SHELL_TRANSLATIONS);
for (const locale of manifest.language.locales) {
  const translation = manifest.language.translations[locale.code];
  assert.ok(translation.brand, `${locale.code} is missing the shell brand translation`);
  assert.deepEqual(
    Object.keys(translation.landing),
    ['kicker', 'title', 'summary', 'sectionsLabel'],
    `${locale.code} is missing landing-page translations`,
  );
  assert.deepEqual(
    Object.keys(translation.search),
    ['label', 'placeholder', 'clear'],
    `${locale.code} is missing search translations`,
  );
  assert.deepEqual(
    Object.keys(translation.navItems),
    ['hardware', 'software', 'examples', 'models', 'community'],
  );
}

assert.match(shellSource, /aria-haspopup="menu"/);
assert.match(shellSource, /role="menuitemradio"/);
assert.match(shellSource, /developer-center-language-change/);
assert.match(
  shellSource,
  /index\.languageFacet \? \{facetFilters: \[`language:\$\{locale\}`\]\} : \{\}/,
);
assert.match(docusaurusConfigSource, /type: 'localeDropdown'/);
assert.match(
  docusaurusConfigSource,
  /preferred=window\.localStorage\.getItem\(\$\{JSON\.stringify\(developerCenterShell\.LOCALE_KEY\)\}\)/,
);
assert.match(docusaurusConfigSource, /parts\.length===0&&preferred!==/);
assert.match(shellClientSource, /\.navbar-sidebar a\[lang\]/);
assert.match(shellClientSource, /developer-center-language-change/);
assert.match(shellSource, /shellCopy\.navItems\[item\.key\]/);
assert.match(shellSource, /localizedPath\('\/', locale, manifest\)/);
assert.match(shellSource, /function decodeCookieEntry\(entry\)/);
assert.match(shellSource, /catch \(_\) \{\s*return null;\s*\}/);
assert.match(shellNavigationSource, /withLocalePrefixFromPath/);
assert.match(shellThemeSource, /function decodeCookieEntry\(entry\)/);
assert.match(shellSource, /placeholder="\$\{escapeHtml\(shellCopy\.search\.placeholder/);
assert.match(shellSource, /aria-label="\$\{escapeHtml\(shellCopy\.search\.clear\)\}"/);
assert.match(
  shellSource,
  /render\(target, manifest, \{\.\.\.options, locale\}\)/,
);
assert.match(shellSource, /addEventListener\('developer-center-language-change', onLanguageChange\)/);
assert.match(hardwareRootSource, /function useShellLocale\(\)/);
assert.match(hardwareRootSource, /addEventListener\("developer-center-language-change"/);
assert.match(landingSource, /function readLocalePreference\(routeLocale\)/);
assert.match(
  landingSource,
  /routeLocale !== developerCenterShell\.DEFAULT_LOCALE\s*&& supported\.has\(routeLocale\)/,
);
assert.doesNotMatch(landingSource, /if \(supported\.has\(routeLocale\)\) return routeLocale/);
assert.match(landingSource, /Ignore malformed cookie values and fall back to local storage/);
assert.match(landingSource, /window\.location\.replace\(/);
assert.match(
  landingSource,
  /routeLocale === developerCenterShell\.DEFAULT_LOCALE\s*&& preferredLocale !== developerCenterShell\.DEFAULT_LOCALE/,
);
assert.match(landingSource, /useDocusaurusContext\(\)/);
assert.match(landingSource, /setLocale\(preferredLocale\)/);
assert.match(landingSource, /addEventListener\('developer-center-language-change'/);
assert.match(landingSource, /action\.key === 'hardware'/);
assert.match(landingSource, /action\.key === 'software'/);
assert.doesNotMatch(landingSource, /@docusaurus\/Link/);
assert.match(landingSource, /<a className=\{className\} href=\{localizedActionHref\(action, locale\)\}>/);
for (const locale of shellConfig.SUPPORTED_LOCALES) {
  assert.match(hardwareRootSource, new RegExp(`(?:\\b${locale.code}|["']${locale.code}["'])\\s*:`));
}
for (const [locale, messages] of Object.entries(expectedSidebarMessages)) {
  const translations = JSON.parse(
    fs.readFileSync(
      path.join(docsRoot, 'i18n', locale, 'docusaurus-plugin-content-docs', 'current.json'),
      'utf8',
    ),
  );
  assert.deepEqual(
    sidebarTranslationKeys.map((key) => translations[key]?.message),
    messages,
    `${locale} Hardware sidebar translations are incomplete`,
  );

  const translatedDocsRoot = path.join(
    docsRoot,
    'i18n',
    locale,
    'docusaurus-plugin-content-docs',
    'current',
  );
  const translatedDocs = fs.readdirSync(translatedDocsRoot, {recursive: true, withFileTypes: true})
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name));
  for (const translatedDoc of translatedDocs) {
    const translatedSource = fs.readFileSync(translatedDoc, 'utf8');
    assert.doesNotMatch(
      translatedSource,
      /(?:href=["']|\]\()\/hardware(?:\/|["')])/,
      `${path.relative(docsRoot, translatedDoc)} contains an English-only Hardware link`,
    );
    if (locale === 'zh-Hant') {
      assert.doesNotMatch(
        translatedSource,
        /Bluetooth 水槽/,
        `${path.relative(docsRoot, translatedDoc)} mistranslates an audio sink as a water sink`,
      );
    }
  }
}

console.log('Developer Center language checks passed.');

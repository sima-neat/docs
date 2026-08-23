const assert = require('node:assert');
const crypto = require('node:crypto');
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
const gettingStartedSource = fs.readFileSync(
  path.join(docsRoot, 'docs/getting-started/index.md'),
  'utf8',
);
const i18nReadmeSource = fs.readFileSync(path.join(docsRoot, 'i18n/README.md'), 'utf8');
const docusaurusConfigSource = fs.readFileSync(
  path.join(docsRoot, 'docusaurus.config.js'),
  'utf8',
);
const vulcanWorkflowSource = fs.readFileSync(
  path.join(docsRoot, '.github/workflows/vulcan-docs.yml'),
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
const translationSources = JSON.parse(
  fs.readFileSync(path.join(docsRoot, 'i18n/translation-sources.json'), 'utf8'),
);
const shellConfig = require('../src/developerCenter/shell/config.cjs');

for (const [locale, sources] of Object.entries(translationSources)) {
  for (const [sourcePath, expectedHash] of Object.entries(sources)) {
    const actualHash = crypto
      .createHash('sha256')
      .update(fs.readFileSync(path.join(docsRoot, sourcePath)))
      .digest('hex');
    assert.equal(
      actualHash,
      expectedHash,
      `${locale} translation source hash is stale for ${sourcePath}`,
    );
  }
}
const expectedSidebarMessages = {
  ko: ['시작하기', '빠른 시작 가이드', 'DevKit 변형', '도구', '참조', '기술 노트'],
  ja: ['はじめに', 'クイックスタートガイド', 'DevKit バリエーション', 'ツール', 'リファレンス', '技術ノート'],
  'zh-Hant': ['開始使用', '快速入門指南', 'DevKit 型號', '工具', '參考資料', '技術說明'],
  uk: ['Початок роботи', 'Посібник зі швидкого старту', 'Варіанти DevKit', 'Інструменти', 'Довідкові матеріали', 'Технічні нотатки'],
};
const earlyAccessConstraints = {
  ko: ['레거시', '기존 Early Access 고객'],
  ja: ['レガシー', '既存の Early Access のお客様'],
  'zh-Hant': ['舊版', '現有搶先體驗客戶'],
  uk: ['застарілий', 'наявних клієнтів програми раннього доступу'],
};
const currentDevKitPositioning = {
  ko: ['MLSoC Modalix를 평가', '엣지 AI 애플리케이션을 구축'],
  ja: ['MLSoC Modalix の評価', 'エッジ AI アプリケーションの構築'],
  'zh-Hant': ['評估 MLSoC Modalix', '建置邊緣 AI 應用程式'],
  uk: ['оцінювання MLSoC Modalix', 'створення периферійних застосунків ШІ'],
};
const pcieTabLabels = {
  ko: ['인터페이스', '주요 기능'],
  ja: ['インターフェース', '主な機能'],
  'zh-Hant': ['介面', '主要功能'],
  uk: ['Інтерфейси', 'Основні функції'],
};
const networkTabLabels = {
  ko: ['Linux 셸에서 네트워크 설정', '호스트 네트워크 연결 공유', 'U-Boot 셸에서 네트워크 설정'],
  ja: ['Linux シェルでのネットワーク設定', 'ホストのネットワーク接続を共有', 'U-Boot シェルでのネットワーク設定'],
  'zh-Hant': ['Linux Shell 中的網路設定', '共用主機網路連線', 'U-Boot Shell 中的網路設定'],
  uk: ['Налаштування мережі в оболонці Linux', 'Спільний доступ до мережевого підключення хоста', 'Налаштування мережі в оболонці U-Boot'],
};
const modeTabLabels = {
  ko: ['독립 실행형 모드', 'PCIe 모드'],
  ja: ['スタンドアロンモード', 'PCIe モード'],
  'zh-Hant': ['獨立模式', 'PCIe 模式'],
  uk: ['Автономний режим', 'Режим PCIe'],
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
const storedShellValues = new Map();
const shellCookieWrites = [];
context.window.location = {hostname: 'localhost', protocol: 'https:'};
context.window.localStorage = {
  setItem(key, value) {
    storedShellValues.set(key, value);
  },
};
context.document = {
  get cookie() {
    return '';
  },
  set cookie(value) {
    shellCookieWrites.push(value);
  },
};
context.window.DeveloperCenterShell.writeLocale('ja');
assert.equal(storedShellValues.get(shellConfig.LOCALE_KEY), 'ja');
assert.ok(
  shellCookieWrites.some((value) => value.startsWith(`${shellConfig.LOCALE_COOKIE}=ja;`)),
  'one-argument shell locale persistence did not write the locale cookie',
);
assert.equal(context.window.DeveloperCenterShell.localeFromPath('/ja/hardware/getting-started/'), 'ja');
assert.equal(context.window.DeveloperCenterShell.localizedPath('/hardware', 'ja'), '/ja/hardware');
assert.equal(context.window.DeveloperCenterShell.localizedPath('/software', 'ja'), '/software/ja');
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
assert.equal(shellConfig.withSiteRoot('/ja/hardware', '/docs/'), '/docs/ja/hardware');
assert.equal(
  shellConfig.withoutSiteRoot('/docs/ja/hardware/getting-started/', '/docs/'),
  '/ja/hardware/getting-started/',
);
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
assert.deepEqual(
  manifest.language.pickerTranslations,
  shellConfig.LANGUAGE_PICKER_TRANSLATIONS,
);
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
    [
      'label', 'placeholder', 'clear', 'sources', 'overview', 'filtersLabel',
      'resultsLabel', 'searching', 'unavailable', 'prompt', 'noMatches',
      'noSectionMatches', 'error',
    ],
    `${locale.code} is missing search translations`,
  );
  assert.deepEqual(Object.keys(translation.search.sources), ['all', 'hardware', 'software', 'examples']);
  if (locale.code !== 'en') {
    for (const searchValue of [
      ...Object.values(translation.search.sources),
      translation.search.overview,
      translation.search.filtersLabel,
      translation.search.resultsLabel,
      translation.search.searching,
      translation.search.unavailable,
      translation.search.prompt,
      translation.search.noMatches,
      translation.search.noSectionMatches,
      translation.search.error,
    ]) {
      assert.ok(shellSource.includes(searchValue), `${locale.code} is missing fallback search copy`);
    }
  }
  assert.deepEqual(
    Object.keys(translation.navItems),
    ['hardware', 'software', 'examples', 'models', 'community'],
  );
  const pickerTranslation = manifest.language.pickerTranslations[locale.code];
  assert.deepEqual(
    Object.keys(pickerTranslation),
    ['heading', 'menuLabel', 'currentLabel'],
    `${locale.code} is missing language-picker translations`,
  );
  if (locale.code !== 'en') {
    for (const pickerValue of Object.values(pickerTranslation)) {
      assert.ok(shellSource.includes(pickerValue), `${locale.code} is missing fallback picker copy`);
    }
  }
}

assert.match(shellSource, /aria-haspopup="menu"/);
assert.match(shellSource, /role="menuitemradio"/);
assert.match(shellSource, /developer-center-language-change/);
assert.match(
  shellSource,
  /index\.languageFacet \? \{facetFilters: \[`language:\$\{locale\}`\]\} : \{\}/,
);
const documentationRoots = [
  path.join(docsRoot, 'docs'),
  ...manifest.language.locales
    .filter(({code}) => code !== manifest.language.defaultLocale)
    .map(({code}) =>
      path.join(docsRoot, 'i18n', code, 'docusaurus-plugin-content-docs', 'current'),
    ),
];
for (const documentationRoot of documentationRoots) {
  for (const entry of fs.readdirSync(documentationRoot, {recursive: true})) {
    if (!/\.mdx?$/.test(entry)) continue;
    const source = fs.readFileSync(path.join(documentationRoot, entry), 'utf8');
    assert.doesNotMatch(
      source,
      /src="\/img\//,
      `${path.join(documentationRoot, entry)} contains an image that ignores the base URL`,
    );
    if (source.includes("src={useBaseUrl('/img/")) {
      assert.match(
        source,
        /import useBaseUrl from '@docusaurus\/useBaseUrl';/,
        `${path.join(documentationRoot, entry)} uses useBaseUrl without importing it`,
      );
    }
  }
}
assert.match(docusaurusConfigSource, /type: 'localeDropdown'/);
assert.match(
  vulcanWorkflowSource,
  /npm run fetch:serial-tool\s+npm run check:i18n-complete\s+npm --ignore-scripts run build/,
  'Vulcan deployment bypasses the translation completeness check',
);
assert.match(
  vulcanWorkflowSource,
  /name: Install shared i18n tooling[\s\S]*sima-cli" neat install i18n[\s\S]*sima-i18n" --version[\s\S]*npm run check:i18n-complete/,
  'Vulcan deployment invokes the translation check without installing its CLI',
);
const algoliaPublishIndex = vulcanWorkflowSource.indexOf('- name: Publish Algolia hardware records');
const sitePublishIndex = vulcanWorkflowSource.indexOf('- name: Publish site to S3');
assert.ok(algoliaPublishIndex >= 0, 'Vulcan deployment is missing the Algolia publish step');
assert.ok(
  sitePublishIndex > algoliaPublishIndex,
  'Vulcan publishes the localized client before its Algolia records and facets',
);
assert.ok(
  vulcanWorkflowSource.slice(algoliaPublishIndex, sitePublishIndex).includes('--sync'),
  'Vulcan does not synchronize Algolia before publishing the localized client',
);
assert.match(
  docusaurusConfigSource,
  /preferred=window\.localStorage\.getItem\(\$\{JSON\.stringify\(developerCenterShell\.LOCALE_KEY\)\}\)/,
);
assert.match(docusaurusConfigSource, /parts\.length===0&&preferred!==/);
assert.match(shellClientSource, /\.navbar-sidebar a\[lang\]/);
assert.match(shellClientSource, /DeveloperCenterShell\?\.writeLocale\?\.\(locale\)/);
assert.match(shellClientSource, /function syncNativeNavbarLocale\(\)/);
assert.match(shellClientSource, /withoutSiteRoot\(pathname, SITE_ROOT\)/);
assert.match(shellClientSource, /function watchNativeSectionNavigation\(\)/);
assert.match(shellClientSource, /function syncLocalizedContentLinks\(\)/);
assert.match(shellClientSource, /data-developer-center-base-rooted/);
assert.match(shellClientSource, /event\.stopImmediatePropagation\(\)/);
assert.match(shellClientSource, /siteRoot: SITE_ROOT/);
assert.match(shellClientSource, /developer-center-language-change/);
assert.match(shellSource, /shellCopy\.navItems\[item\.key\]/);
assert.match(shellSource, /localizedPath\('\/', locale, manifest\)/);
assert.match(shellSource, /withSiteRoot\('\/img\/sima-logo\.png', siteRoot\)/);
assert.match(shellSource, /function mountSearch\(root, manifest, locale, siteRoot = '\/'\)/);
assert.match(shellSource, /withSiteRoot\(hitRoute\(hit\), state\.siteRoot\)/);
assert.match(shellSource, /mountSearch\(target, manifest, locale, siteRoot\)/);
assert.match(shellSource, /const searchCopy = state\.copy/);
assert.match(shellSource, /sources: \{\.\.\.english\.search\.sources, \.\.\.localized\.search\.sources\}/);
assert.match(shellSource, /searchCopy\.sources\[source\.key\]/);
assert.match(shellSource, /searchCopy\.filtersLabel/);
assert.match(shellSource, /searchCopy\.resultsLabel/);
assert.match(shellSource, /state\.error = state\.copy\.error/);
assert.match(shellSource, /languagePicker: \{\.\.\.englishPicker, \.\.\.localizedPicker\}/);
assert.match(shellSource, /escapeHtml\(languageCopy\.menuLabel\)/);
assert.match(shellSource, /escapeHtml\(languageCopy\.heading\)/);
assert.doesNotMatch(shellSource, /aria-label="Documentation language:/);
assert.doesNotMatch(shellSource, /aria-label="Select documentation language"/);
assert.doesNotMatch(shellSource, />Documentation language<\/div>/);
assert.match(shellSource, /const routePath = withoutSiteRoot\(window\.location\.pathname, siteRoot\)/);
assert.match(shellSource, /withSiteRoot\(localizedPath\(routePath, locale, manifest\), siteRoot\)/);
assert.match(shellSource, /function decodeCookieEntry\(entry\)/);
assert.match(shellSource, /catch \(_\) \{\s*return null;\s*\}/);
assert.match(shellNavigationSource, /withLocalePrefixFromPath/);
assert.match(shellNavigationSource, /@generated\/docusaurus\.config/);
assert.match(shellNavigationSource, /withoutSiteRoot\(window\.location\.pathname\)/);
assert.match(shellNavigationSource, /shellConfig\.withSiteRoot\([\s\S]*SITE_ROOT/);
assert.match(shellNavigationSource, /isCloudFrontRoutedPath\(routePath\)/);
assert.match(shellThemeSource, /function decodeCookieEntry\(entry\)/);
assert.match(shellSource, /placeholder="\$\{escapeHtml\(shellCopy\.search\.placeholder/);
assert.match(shellSource, /aria-label="\$\{escapeHtml\(shellCopy\.search\.clear\)\}"/);
assert.match(
  shellSource,
  /render\(target, manifest, \{\.\.\.options, locale\}\)/,
);
assert.match(shellSource, /addEventListener\('developer-center-language-change', onLanguageChange\)/);
assert.match(shellSource, /localizedPath,\s*writeLocale,/);
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
assert.match(landingSource, /const siteRoot = useBaseUrl\('\/'\)/);
assert.match(landingSource, /`\$\{siteRoot\}\$\{preferredLocale\}\//);
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
assert.match(landingSource, /const href = useBaseUrl\(localizedActionHref\(action, locale\)\)/);
assert.match(landingSource, /<a className=\{className\} href=\{href\}>/);
assert.match(gettingStartedSource, /import useBaseUrl from '@docusaurus\/useBaseUrl'/);
assert.match(gettingStartedSource, /href=\{useBaseUrl\('\/tools\/qsg\/index\.html'\)\}/);
assert.doesNotMatch(gettingStartedSource, /href="\/tools\/qsg\/index\.html"/);
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
  const translatedCorpus = translatedDocs
    .map((translatedDoc) => fs.readFileSync(translatedDoc, 'utf8'))
    .join('\n');
  const localizedIndexSource = fs.readFileSync(path.join(translatedDocsRoot, 'index.mdx'), 'utf8');
  const localizedGettingStartedSource = fs.readFileSync(
    path.join(translatedDocsRoot, 'getting-started/index.md'),
    'utf8',
  );
  assert.match(localizedGettingStartedSource, /import useBaseUrl from '@docusaurus\/useBaseUrl'/);
  assert.match(
    localizedGettingStartedSource,
    /href=\{useBaseUrl\('\/tools\/qsg\/index\.html'\)\}/,
  );
  assert.doesNotMatch(localizedGettingStartedSource, /href="\/tools\/qsg\/index\.html"/);
  const networkSource = fs.readFileSync(
    path.join(translatedDocsRoot, 'getting-started/standalone-mode/network.mdx'),
    'utf8',
  );
  for (const tabLabel of networkTabLabels[locale]) {
    assert.ok(networkSource.includes(`label="${tabLabel}"`), `${locale} leaves a network tab untranslated`);
  }
  for (const tabLabel of modeTabLabels[locale]) {
    assert.ok(localizedIndexSource.includes(`label="${tabLabel}"`), `${locale} leaves a mode tab untranslated`);
  }
  const modalixDevKitSource = fs.readFileSync(
    path.join(translatedDocsRoot, 'devkit/modalix-devkit.mdx'),
    'utf8',
  );
  const modalixEarlyAccessSource = fs.readFileSync(
    path.join(translatedDocsRoot, 'devkit/modalix-ea-kit.mdx'),
    'utf8',
  );
  const modalixPcieSource = fs.readFileSync(
    path.join(translatedDocsRoot, 'devkit/modalix-pcie-card.mdx'),
    'utf8',
  );
  for (const tabLabel of pcieTabLabels[locale]) {
    assert.ok(
      modalixPcieSource.includes(`label="${tabLabel}"`),
      `${locale} leaves a Modalix PCIe tab label untranslated`,
    );
  }
  for (const positioningFragment of currentDevKitPositioning[locale]) {
    assert.ok(
      modalixDevKitSource.includes(positioningFragment),
      `${locale} does not preserve the current Modalix DevKit positioning`,
    );
  }
  assert.doesNotMatch(modalixDevKitSource, /Dhrystone/i, `${locale} adds an unsupported Dhrystone claim`);
  assert.doesNotMatch(modalixEarlyAccessSource, /Dhrystone/i, `${locale} adds an unsupported Dhrystone claim`);
  for (const constraint of earlyAccessConstraints[locale]) {
    assert.ok(
      modalixEarlyAccessSource.includes(constraint),
      `${locale} does not preserve the Early Access kit's legacy/customer constraint`,
    );
  }
  if (locale === 'zh-Hant') {
    const glossarySource = fs.readFileSync(path.join(translatedDocsRoot, 'reference/glossary.md'), 'utf8');
    assert.doesNotMatch(glossarySource, /750 MHz/, 'zh-Hant converts GOPS throughput into MHz');
    assert.match(glossarySource, /750 16 位元 GOPS/);
    assert.doesNotMatch(translatedCorpus, /條紋/, 'zh-Hant translates a MIPI lane as a visual stripe');
    assert.doesNotMatch(translatedCorpus, /港口/, 'zh-Hant translates a hardware port as a maritime harbor');
    assert.doesNotMatch(translatedCorpus, /建立人脈/, 'zh-Hant translates networking as relationship-building');
    assert.match(translatedCorpus, /2 個 2 通道 MIPI CSI/);
    assert.match(translatedCorpus, /4 個 4 通道 MIPI CSI/);
    assert.doesNotMatch(localizedIndexSource, /應用程式的 ID/);
    assert.match(
      localizedIndexSource,
      /\[NEAT 應用程式\]\(https:\/\/developer\.sima\.ai\/software\)/,
    );
  }
  if (locale === 'ja') {
    assert.doesNotMatch(translatedCorpus, /750\s*MHz/, 'ja converts GOPS throughput into MHz');
    assert.match(translatedCorpus, /750 16ビット GOPS/);
    const elxrConversionSource = fs.readFileSync(
      path.join(translatedDocsRoot, 'reference/tech-notes/elxr-conversion.mdx'),
      'utf8',
    );
    assert.doesNotMatch(elxrConversionSource, /こちらをクリック/);
    assert.match(elxrConversionSource, /\*\*DevKit の電源を入れ直します\*\*/);
  }
  if (locale === 'uk') {
    assert.doesNotMatch(
      translatedCorpus,
      /750[^\n|.]*операцій[^\n|.]*секунду/i,
      'uk drops the giga scale from GOPS throughput',
    );
    assert.ok(
      (translatedCorpus.match(/750 16-бітних GOPS/g) || []).length >= 6,
      'uk does not consistently preserve the canonical CVU throughput unit',
    );
    assert.doesNotMatch(
      translatedCorpus,
      /Підрозділ комп’ютерного зору/,
      'uk translates a hardware unit as an organizational subdivision',
    );
    assert.doesNotMatch(translatedCorpus, /Налагодження зв’язків/, 'uk mistranslates networking');
    assert.doesNotMatch(
      translatedCorpus,
      /встановлюється на материнську плату|інтеграції з материнською платою|апаратного забезпечення материнської плати SoM|модульної обчислювальної системи на материнській платі/,
      'uk translates carrier or generic boards as motherboards',
    );
    assert.doesNotMatch(modalixDevKitSource, /через основну плату/);
    assert.doesNotMatch(
      modalixDevKitSource,
      /label="Редагування"|>Перегляд(?:<| SoM)|Основна плата|материнськими платами/,
      'uk uses editing, view, or motherboard terminology for hardware revisions and carrier boards',
    );
    assert.match(modalixDevKitSource, /label="Ревізії"/);
    assert.match(modalixDevKitSource, />Ревізія SoM</);
    assert.ok(
      (modalixDevKitSource.match(/плат(?:а|и|і|ами)-носі(?:й|я|ї|ями)/gi) || []).length >= 3,
      'uk does not consistently identify the Modalix DevKit carrier board',
    );
    const mipiCameraSource = fs.readFileSync(
      path.join(translatedDocsRoot, 'getting-started/standalone-mode/mipi-camera-interfaces.mdx'),
      'utf8',
    );
    assert.doesNotMatch(mipiCameraSource, /материнської плати|Основна плата/);
    assert.ok(
      (mipiCameraSource.match(/плат(?:а|и|і)-носі(?:й|я|ї)/g) || []).length >= 4,
      'uk does not consistently identify the MIPI carrier board',
    );
  }
  if (locale === 'ko') {
    assert.match(networkSource, /:::note[\s\S]*?\n:::\n\n1\./);
    assert.doesNotMatch(networkSource, /^:::경고$/m, 'ko translates a Docusaurus directive keyword');
    assert.doesNotMatch(translatedCorpus, /Bluetooth 세면대/, 'ko translates an audio sink as a washbasin');
    assert.doesNotMatch(translatedCorpus, /컴퓨터 비전 부서/, 'ko translates a hardware unit as a department');
    assert.doesNotMatch(translatedCorpus, /\d+차선 MIPI/, 'ko translates a MIPI lane as a traffic lane');
    assert.match(localizedIndexSource, /2개의 2레인 MIPI CSI/);
    assert.match(localizedIndexSource, /4개의 4레인 MIPI CSI/);
    assert.match(translatedCorpus, /컴퓨터 비전 유닛\(CVU\)/);
  }
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
      assert.doesNotMatch(
        translatedSource,
        /750\s*(?:MHz|兆赫)/,
        `${path.relative(docsRoot, translatedDoc)} converts GOPS throughput into a clock frequency`,
      );
    }
  }
}

console.log('Developer Center language checks passed.');

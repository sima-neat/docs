import React, {useEffect, useState} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {useLocation} from "@docusaurus/router";

const LOCALIZED_UI = {
  en: {
    hardwareDocs: "Hardware documentation",
    gettingStarted: "Getting Started",
    devkitVariants: "DevKit Variants",
    tools: "Tools",
    references: "References",
    webSerial: "Web Serial Console",
    quickStart: "Quick Start",
    buyDevkit: "Buy Your DevKit",
  },
  ko: {
    hardwareDocs: "하드웨어 문서",
    gettingStarted: "시작하기",
    devkitVariants: "DevKit 변형",
    tools: "도구",
    references: "참조",
    webSerial: "웹 시리얼 콘솔",
    quickStart: "빠른 시작",
    buyDevkit: "DevKit 구매",
  },
  ja: {
    hardwareDocs: "ハードウェアドキュメント",
    gettingStarted: "はじめに",
    devkitVariants: "DevKit バリエーション",
    tools: "ツール",
    references: "リファレンス",
    webSerial: "Web シリアルコンソール",
    quickStart: "クイックスタート",
    buyDevkit: "DevKit を購入",
  },
  "zh-Hant": {
    hardwareDocs: "硬體文件",
    gettingStarted: "開始使用",
    devkitVariants: "DevKit 型號",
    tools: "工具",
    references: "參考資料",
    webSerial: "網頁序列主控台",
    quickStart: "快速入門",
    buyDevkit: "購買 DevKit",
  },
  uk: {
    hardwareDocs: "Документація апаратного забезпечення",
    gettingStarted: "Початок роботи",
    devkitVariants: "Варіанти DevKit",
    tools: "Інструменти",
    references: "Довідкові матеріали",
    webSerial: "Вебконсоль послідовного порту",
    quickStart: "Швидкий старт",
    buyDevkit: "Придбати DevKit",
  },
};

function useShellLocale() {
  const {i18n} = useDocusaurusContext();
  const [locale, setLocale] = useState(i18n.currentLocale);

  useEffect(() => setLocale(i18n.currentLocale), [i18n.currentLocale]);
  useEffect(() => {
    const onLanguageChange = (event) => {
      if (LOCALIZED_UI[event?.detail?.locale]) setLocale(event.detail.locale);
    };
    window.addEventListener("developer-center-language-change", onLanguageChange);
    return () => window.removeEventListener("developer-center-language-change", onLanguageChange);
  }, []);

  return locale;
}

function HardwareSubnav() {
  const location = useLocation();
  const {i18n} = useDocusaurusContext();
  const locale = useShellLocale();
  const copy = LOCALIZED_UI[locale] || LOCALIZED_UI.en;
  const localePrefix = i18n.currentLocale === i18n.defaultLocale ? "" : `/${i18n.currentLocale}`;
  const hardwareBase = useBaseUrl(`${localePrefix}/hardware`);
  const gettingStartedBase = useBaseUrl(`${localePrefix}/hardware/getting-started`);
  const devkitBase = useBaseUrl(`${localePrefix}/hardware/devkit`);
  const toolsBase = useBaseUrl(`${localePrefix}/hardware/tools`);
  const referenceBase = useBaseUrl(`${localePrefix}/hardware/reference`);

  const links = [
    {
      label: copy.gettingStarted,
      href: useBaseUrl(`${localePrefix}/hardware/getting-started`),
      active: location.pathname.includes(gettingStartedBase),
    },
    {
      label: copy.devkitVariants,
      href: useBaseUrl(`${localePrefix}/hardware/devkit/modalix-devkit`),
      active: location.pathname.includes(devkitBase),
    },
    {
      label: copy.tools,
      href: useBaseUrl(`${localePrefix}/hardware/tools/web-serial-console`),
      active: location.pathname.includes(toolsBase),
    },
    {
      label: copy.references,
      href: useBaseUrl(`${localePrefix}/hardware/reference/bsp`),
      active: location.pathname.includes(referenceBase),
    },
  ];

  const quickStartHref = useBaseUrl("/tools/qsg/index.html");
  const serialConsoleHref = useBaseUrl("/tools/serial/index.html");

  // Only render the secondary bar on Hardware doc routes, not on the
  // landing page (/) or the /software and /examples fallbacks.
  if (!location.pathname.startsWith(hardwareBase)) {
    return null;
  }

  return (
    <nav className="docs-subnav" aria-label={copy.hardwareDocs}>
      <div className="docs-subnav__inner">
        <div className="docs-subnav__links">
          {links.map((link) => (
            <a
              key={link.label}
              className={`docs-subnav__link${link.active ? " docs-subnav__link--active" : ""}`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="docs-subnav__controls">
          <a
            className="docs-subnav__link"
            href={serialConsoleHref}
            target="_blank"
            rel="noreferrer"
          >
            {copy.webSerial}
          </a>
          <a
            className="docs-subnav__button"
            href={quickStartHref}
            target="_blank"
            rel="noreferrer"
          >
            {copy.quickStart}
          </a>
          <a
            className="docs-subnav__button docs-subnav__button--buy"
            href="https://devkit.sima.ai"
            target="_blank"
            rel="noreferrer"
          >
            {copy.buyDevkit}
          </a>
        </div>
      </div>
    </nav>
  );
}

export default function Root({children}) {
  return (
    <>
      <HardwareSubnav />
      {children}
    </>
  );
}

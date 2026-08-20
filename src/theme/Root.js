import React, {useEffect, useRef, useState} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {useLocation} from "@docusaurus/router";

// 11:59:59 PM Pacific (PDT, UTC-7) on Jun 15, 2026. The WIP banner auto-hides
// once the viewer's clock passes this instant.
const WIP_DEADLINE = Date.parse("2026-06-15T23:59:59-07:00");
const LOCALIZED_UI = {
  en: {
    wip: "🚧 This documentation site is a work in progress — content is incomplete and may change.",
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
    wip: "🚧 이 문서 사이트는 작업 중입니다 — 콘텐츠가 불완전하며 변경될 수 있습니다.",
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
    wip: "🚧 このドキュメントサイトは作成中です — 内容は不完全で、変更される可能性があります。",
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
    wip: "🚧 此文件網站仍在建置中 — 內容尚未完整，可能會有所變更。",
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
    wip: "🚧 Цей сайт документації перебуває в розробці — вміст неповний і може змінюватися.",
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

function WipBanner() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  const locale = useShellLocale();
  const copy = LOCALIZED_UI[locale] || LOCALIZED_UI.en;

  useEffect(() => {
    // Hide once the viewer's clock passes the deadline.
    if (Date.now() >= WIP_DEADLINE) {
      setVisible(false);
      return undefined;
    }
    // Publish the banner's height so the fixed bars and content below it are
    // pushed down by exactly the right amount (--wip-offset, default 0).
    const root = document.documentElement;
    const syncOffset = () => {
      if (ref.current) {
        root.style.setProperty("--wip-offset", `${ref.current.offsetHeight}px`);
      }
    };
    syncOffset();
    window.addEventListener("resize", syncOffset);
    return () => {
      window.removeEventListener("resize", syncOffset);
      root.style.removeProperty("--wip-offset");
    };
  }, [copy.wip]);

  if (!visible) {
    return null;
  }
  return (
    <div ref={ref} className="wip-banner" role="status">
      {copy.wip}
    </div>
  );
}

function HardwareSubnav() {
  const location = useLocation();
  const locale = useShellLocale();
  const copy = LOCALIZED_UI[locale] || LOCALIZED_UI.en;
  const hardwareBase = useBaseUrl("/hardware");
  const gettingStartedBase = useBaseUrl("/hardware/getting-started");
  const devkitBase = useBaseUrl("/hardware/devkit");
  const toolsBase = useBaseUrl("/hardware/tools");
  const referenceBase = useBaseUrl("/hardware/reference");

  const links = [
    {
      label: copy.gettingStarted,
      href: useBaseUrl("/hardware/getting-started/setup-devkit"),
      active: location.pathname.includes(gettingStartedBase),
    },
    {
      label: copy.devkitVariants,
      href: useBaseUrl("/hardware/devkit/modalix-devkit"),
      active: location.pathname.includes(devkitBase),
    },
    {
      label: copy.tools,
      href: useBaseUrl("/hardware/tools/web-serial-console"),
      active: location.pathname.includes(toolsBase),
    },
    {
      label: copy.references,
      href: useBaseUrl("/hardware/reference/bsp"),
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
      <WipBanner />
      <HardwareSubnav />
      {children}
    </>
  );
}

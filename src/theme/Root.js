import React, {useEffect, useState} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {useLocation} from "@docusaurus/router";

const LOCALIZED_UI = {
  en: {
    hardwareDocs: "Hardware documentation",
    evaluate: "Evaluate",
    design: "Design",
    software: "Build eLxr",
    deploy: "Flash & Update",
    references: "References",
    webSerial: "Web Serial Console",
    quickStart: "Quick Start",
    buyDevkit: "Buy Your DevKit",
  },
  ko: {
    hardwareDocs: "하드웨어 문서",
    evaluate: "평가",
    design: "설계",
    software: "eLxr 빌드",
    deploy: "플래시 및 업데이트",
    references: "참조",
    webSerial: "웹 시리얼 콘솔",
    quickStart: "빠른 시작",
    buyDevkit: "DevKit 구매",
  },
  ja: {
    hardwareDocs: "ハードウェアドキュメント",
    evaluate: "評価",
    design: "設計",
    software: "eLxr のビルド",
    deploy: "書き込みと更新",
    references: "リファレンス",
    webSerial: "Web シリアルコンソール",
    quickStart: "クイックスタート",
    buyDevkit: "DevKit を購入",
  },
  "zh-Hant": {
    hardwareDocs: "硬體文件",
    evaluate: "評估",
    design: "設計",
    software: "建置 eLxr",
    deploy: "燒錄與更新",
    references: "參考資料",
    webSerial: "網頁序列主控台",
    quickStart: "快速入門",
    buyDevkit: "購買 DevKit",
  },
  uk: {
    hardwareDocs: "Документація апаратного забезпечення",
    evaluate: "Оцінка",
    design: "Проєктування",
    software: "Збірка eLxr",
    deploy: "Оновлення",
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
  const locale = useShellLocale();
  const copy = LOCALIZED_UI[locale] || LOCALIZED_UI.en;
  const hardwareBase = useBaseUrl("/hardware");
  const gettingStartedBase = useBaseUrl("/hardware/getting-started");
  const firmwareBase = useBaseUrl("/hardware/getting-started/firmware-update");
  const devkitBase = useBaseUrl("/hardware/devkit");
  const toolsBase = useBaseUrl("/hardware/tools");
  const designBase = useBaseUrl("/hardware/design");
  const softwareBase = useBaseUrl("/hardware/software");
  const referenceBase = useBaseUrl("/hardware/reference");
  const path = location.pathname;
  const deploymentBase = useBaseUrl("/hardware/deployment");
  // Updating with sima-cli is part of DevKit setup, so it belongs to Evaluate.
  const simaCliUpdate = path.includes(useBaseUrl("/hardware/getting-started/firmware-update/sima-cli"));
  const deployActive =
    (path.includes(firmwareBase) && !simaCliUpdate) || path.includes(deploymentBase);

  const links = [
    {
      label: copy.evaluate,
      href: useBaseUrl("/hardware/getting-started"),
      active:
        (path.includes(gettingStartedBase) && !deployActive) ||
        path.includes(devkitBase) ||
        path.includes(toolsBase),
    },
    {
      label: copy.design,
      href: useBaseUrl("/hardware/design"),
      active: path.includes(designBase),
    },
    {
      label: copy.software,
      href: useBaseUrl("/hardware/software"),
      active: path.includes(softwareBase),
    },
    {
      label: copy.deploy,
      href: useBaseUrl("/hardware/getting-started/firmware-update"),
      active: deployActive,
    },
    {
      label: copy.references,
      href: useBaseUrl("/hardware/reference/extra-docs"),
      active: path.includes(referenceBase),
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

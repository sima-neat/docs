import React, {useEffect, useState} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {useLocation} from "@docusaurus/router";

const LOCALIZED_UI = {
  en: {
    hardwareDocs: "Hardware documentation",
    devkit: "DevKit",
    somCarrier: "SoM & Carrier",
    chipDown: "Chip-Down",
    systemSoftware: "System Software",
    cameras: "Cameras",
    references: "Reference Documents",
    webSerial: "Web Serial Console",
    quickStart: "Quick Start",
    buyDevkit: "Buy Your DevKit",
  },
  ko: {
    hardwareDocs: "하드웨어 문서",
    devkit: "DevKit",
    somCarrier: "SoM 및 캐리어",
    chipDown: "칩다운",
    systemSoftware: "시스템 소프트웨어",
    cameras: "카메라",
    references: "참조",
    webSerial: "웹 시리얼 콘솔",
    quickStart: "빠른 시작",
    buyDevkit: "DevKit 구매",
  },
  ja: {
    hardwareDocs: "ハードウェアドキュメント",
    devkit: "DevKit",
    somCarrier: "SoM とキャリア",
    chipDown: "チップダウン",
    systemSoftware: "システムソフトウェア",
    cameras: "カメラ",
    references: "リファレンス",
    webSerial: "Web シリアルコンソール",
    quickStart: "クイックスタート",
    buyDevkit: "DevKit を購入",
  },
  "zh-Hant": {
    hardwareDocs: "硬體文件",
    devkit: "DevKit",
    somCarrier: "SoM 與載板",
    chipDown: "Chip-Down",
    systemSoftware: "系統軟體",
    cameras: "相機",
    references: "參考資料",
    webSerial: "網頁序列主控台",
    quickStart: "快速入門",
    buyDevkit: "購買 DevKit",
  },
  uk: {
    hardwareDocs: "Документація апаратного забезпечення",
    devkit: "DevKit",
    somCarrier: "SoM і носій",
    chipDown: "Chip-Down",
    systemSoftware: "Системне ПЗ",
    cameras: "Камери",
    // Short on purpose: a longer label overflows the bar at 1280px.
    references: "Довідка",
    webSerial: "Вебконсоль послідовного порту",
    quickStart: "Швидкий старт",
    buyDevkit: "Придбати DevKit",
  },
};

// Which toolbar section a page belongs to, as the path below /hardware. Pages
// keep their URLs when the sidebar regroups them (sima-neat/docs#80), so a
// folder is not a section: the first matching rule wins, most specific first.
const SECTION_RULES = [
  ["cameras", "/getting-started/standalone-mode/mipi-camera-interfaces"],
  ["chipDown", "/design/chip-down"],
  ["devkit", "/reference/tech-notes/elxr-conversion"],
  ["devkit", "/reference/tech-notes/bluetooth"],
  ["references", "/interfaces/low-speed-io"],
  ["cameras", "/interfaces"],
  ["devkit", "/getting-started"],
  ["devkit", "/devkit"],
  ["devkit", "/tools"],
  ["somCarrier", "/design"],
  ["systemSoftware", "/software"],
  ["systemSoftware", "/deployment"],
  ["references", "/reference"],
];

function sectionForPath(page) {
  const path = page.replace(/\/+$/, "");
  const rule = SECTION_RULES.find(([, prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  return rule ? rule[0] : null;
}

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
  const path = location.pathname;
  const activeSection = path.startsWith(hardwareBase)
    ? sectionForPath(path.slice(hardwareBase.length))
    : null;

  const links = [
    {id: "devkit", label: copy.devkit, href: useBaseUrl("/hardware/getting-started")},
    {id: "somCarrier", label: copy.somCarrier, href: useBaseUrl("/hardware/design/carrier-board")},
    {id: "chipDown", label: copy.chipDown, href: useBaseUrl("/hardware/design/chip-down")},
    {id: "systemSoftware", label: copy.systemSoftware, href: useBaseUrl("/hardware/software")},
    {id: "cameras", label: copy.cameras, href: useBaseUrl("/hardware/interfaces/supported-cameras")},
    {id: "references", label: copy.references, href: useBaseUrl("/hardware/reference/extra-docs")},
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
              key={link.id}
              className={`docs-subnav__link${link.id === activeSection ? " docs-subnav__link--active" : ""}`}
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

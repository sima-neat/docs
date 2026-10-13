import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";
// One JSON file per board in src/data/board-support. Import a second board
// here and pass it to BoardSupportTable to give it its own table.
import MODALIX_DEVKIT from "@site/src/data/board-support/modalix-devkit.json";

const LOCALIZED_UI = {
  en: {
    interface: "Interface",
    connector: "On the board",
    som: "SoM signals",
    deviceTree: (release) => `Device tree in release ${release}`,
    status: "Status",
    supported: "Supported",
    overlay: "Needs an overlay",
    unsupported: "Not supported",
    unconfirmed: "Not confirmed",
  },
  ja: {
    interface: "インターフェース",
    connector: "ボード上の接続先",
    som: "SoM の信号",
    deviceTree: (release) => `リリース ${release} のデバイスツリー`,
    status: "ステータス",
    supported: "対応",
    overlay: "オーバーレイが必要",
    unsupported: "非対応",
    unconfirmed: "未確認",
  },
  ko: {
    interface: "인터페이스",
    connector: "보드의 연결 위치",
    som: "SoM 신호",
    deviceTree: (release) => `릴리스 ${release}의 디바이스 트리`,
    status: "상태",
    supported: "지원",
    overlay: "오버레이 필요",
    unsupported: "지원되지 않음",
    unconfirmed: "확인되지 않음",
  },
  "zh-Hant": {
    interface: "介面",
    connector: "電路板上的位置",
    som: "SoM 訊號",
    deviceTree: (release) => `版本 ${release} 的 device tree`,
    status: "狀態",
    supported: "支援",
    overlay: "需要 overlay",
    unsupported: "不支援",
    unconfirmed: "尚未確認",
  },
  uk: {
    interface: "Інтерфейс",
    connector: "На платі",
    som: "Сигнали SoM",
    deviceTree: (release) => `Дерево пристроїв у випуску ${release}`,
    status: "Статус",
    supported: "Підтримується",
    overlay: "Потрібен оверлей",
    unsupported: "Не підтримується",
    unconfirmed: "Не підтверджено",
  },
};

// Text in the data marks code with backticks.
function Rich({value}) {
  if (!value) return "—";
  return value.split("`").map((part, index) => (index % 2 ? <code key={index}>{part}</code> : part));
}

export function BoardSupportTable({board = MODALIX_DEVKIT}) {
  const {i18n, siteConfig} = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const copy = LOCALIZED_UI[locale] || LOCALIZED_UI.en;
  // A value is a language-neutral string or an object keyed by locale.
  const text = (value) => (value && typeof value === "object" ? value[locale] || value.en : value);
  // Guides are site paths; baseUrl carries the locale prefix.
  const href = (path) => siteConfig.baseUrl.replace(/\/$/, "") + path;

  return (
    <table>
      <thead>
        <tr>
          <th>{copy.interface}</th>
          <th>{copy.connector}</th>
          <th>{copy.som}</th>
          <th>{copy.deviceTree(board.release)}</th>
          <th>{copy.status}</th>
        </tr>
      </thead>
      <tbody>
        {board.rows.map((row) => (
          <tr key={row.id}>
            <th scope="row" className={styles.name}>
              {row.guide ? <a href={href(row.guide)}>{text(row.name)}</a> : text(row.name)}
            </th>
            <td>
              <Rich value={text(row.connector)} />
            </td>
            <td>
              <Rich value={text(row.som)} />
            </td>
            <td>
              <Rich value={text(row.deviceTree)} />
            </td>
            <td>
              <span className={styles[row.status]}>{copy[row.status]}</span>
              {row.note && (
                <span className={styles.note}>
                  <Rich value={text(row.note)} />
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

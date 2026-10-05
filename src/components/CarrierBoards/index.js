import React, {useSyncExternalStore} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";
// What the Modalix SoM supports for each interface, whatever the carrier provides.
import SOM_SUPPORT from "@site/src/data/modalix-som-interface-support.json";

// One JSON file per board in src/data/carrier-boards. Adding a file adds the
// board to the list and to the specification table.
const context = require.context("@site/src/data/carrier-boards", false, /\.json$/);
const BOARDS = context
  .keys()
  .map((key) => context(key))
  .sort((a, b) => Number(b.reference) - Number(a.reference) || a.vendor.localeCompare(b.vendor));

const MAX_COMPARE = 4;

// The list and the specification table sit under separate headings on the
// page, so they share the selection through a small store instead of a parent.
let selection = [BOARDS[0].id];
const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSelection = () => selection;
const setSelection = (next) => {
  selection = next;
  listeners.forEach((listener) => listener());
};
const useSelection = () => useSyncExternalStore(subscribe, getSelection, getSelection);
const removeBoard = (id) => setSelection(selection.filter((item) => item !== id));
// Showing a board from the list always works: when the table is full, the
// board takes the last column.
const showBoard = (id) => {
  if (selection.includes(id)) return;
  setSelection([...selection.slice(0, MAX_COMPARE - 1), id]);
};

const SPEC_GROUPS = [
  {id: "general", keys: ["applications", "cooling", "temperatureGrade"]},
  {id: "connectivity", keys: ["hdmi", "ethernet", "usb3", "usb2"]},
  {id: "m2", keys: ["m2KeyMx4", "m2KeyMx2", "m2KeyE", "m2KeyB"]},
  {id: "cameras", keys: ["csi4Lane", "csi2Lane", "gmsl"]},
  {id: "lowSpeed", keys: ["uart", "i2c", "i2s", "gpio", "can", "spi", "rs232"]},
];

const NEUTRAL_LABELS = {
  hdmi: "HDMI",
  ethernet: "Ethernet",
  usb3: "USB 3.1",
  usb2: "USB 2.0",
  gmsl: "GMSL",
  uart: "UART",
  i2c: "I2C",
  i2s: "I2S",
  gpio: "GPIO",
  can: "CAN",
  spi: "SPI",
  rs232: "RS-232",
};

const LOCALIZED_UI = {
  en: {
    general: "General",
    connectivity: "Display, Ethernet, and USB",
    m2: "M.2 slots",
    cameras: "Cameras",
    lowSpeed: "Low-speed I/O",
    applications: "Target applications",
    cooling: "Cooling",
    temperatureGrade: "Temperature grade",
    m2KeyMx4: "Key M, PCIe x4 (NVMe)",
    m2KeyMx2: "Key M, PCIe x2",
    m2KeyE: "Key E (Wi-Fi and Bluetooth)",
    m2KeyB: "Key B (LTE)",
    csi4Lane: "MIPI CSI, 4-lane",
    csi2Lane: "MIPI CSI, 2-lane",
    reference: "Reference board, brought up by SiMa.ai",
    untested: "Not tested with the Modalix SoM",
    ordering: "Ordering",
    vendorPage: "Vendor product page",
    specification: "Specification",
    supported: "Supported",
    carrier: "Carrier-dependent",
    unsupported: "Not supported",
    unconfirmed: "Not confirmed",
    vendor: "Vendor",
    board: "Board",
    status: "Status",
    referenceShort: "Reference board",
    untestedShort: "Not tested",
    remove: "Remove from comparison",
    addBoard: "Add a board…",
    full: "The comparison holds four boards. Remove one to add another.",
    empty: "Select a board to view its specifications.",
  },
  ja: {
    general: "概要",
    connectivity: "ディスプレイ、Ethernet、USB",
    m2: "M.2 スロット",
    cameras: "カメラ",
    lowSpeed: "低速 I/O",
    applications: "対象用途",
    cooling: "冷却",
    temperatureGrade: "温度グレード",
    m2KeyMx4: "Key M、PCIe x4（NVMe）",
    m2KeyMx2: "Key M、PCIe x2",
    m2KeyE: "Key E（Wi-Fi および Bluetooth）",
    m2KeyB: "Key B（LTE）",
    csi4Lane: "MIPI CSI、4 レーン",
    csi2Lane: "MIPI CSI、2 レーン",
    reference: "リファレンスボード（SiMa.ai が立ち上げ済み）",
    untested: "Modalix SoM での動作は未確認",
    ordering: "注文情報",
    vendorPage: "ベンダーの製品ページ",
    specification: "仕様",
    supported: "対応",
    carrier: "キャリアボードに依存",
    unsupported: "非対応",
    unconfirmed: "未確認",
    vendor: "ベンダー",
    board: "ボード",
    status: "ステータス",
    referenceShort: "リファレンスボード",
    untestedShort: "未確認",
    remove: "比較から削除",
    addBoard: "ボードを追加…",
    full: "比較できるボードは 4 つまでです。追加するには 1 つ削除してください。",
    empty: "ボードを選択すると、その仕様が表示されます。",
  },
  ko: {
    general: "개요",
    connectivity: "디스플레이, Ethernet 및 USB",
    m2: "M.2 슬롯",
    cameras: "카메라",
    lowSpeed: "저속 I/O",
    applications: "대상 용도",
    cooling: "냉각",
    temperatureGrade: "온도 등급",
    m2KeyMx4: "Key M, PCIe x4(NVMe)",
    m2KeyMx2: "Key M, PCIe x2",
    m2KeyE: "Key E(Wi-Fi 및 Bluetooth)",
    m2KeyB: "Key B(LTE)",
    csi4Lane: "MIPI CSI, 4레인",
    csi2Lane: "MIPI CSI, 2레인",
    reference: "레퍼런스 보드(SiMa.ai 브링업 완료)",
    untested: "Modalix SoM으로 테스트되지 않음",
    ordering: "주문 정보",
    vendorPage: "벤더 제품 페이지",
    specification: "사양",
    supported: "지원",
    carrier: "캐리어 보드에 따라 다름",
    unsupported: "지원되지 않음",
    unconfirmed: "확인되지 않음",
    vendor: "벤더",
    board: "보드",
    status: "상태",
    referenceShort: "레퍼런스 보드",
    untestedShort: "테스트되지 않음",
    remove: "비교에서 제거",
    addBoard: "보드 추가…",
    full: "비교에는 보드를 4개까지 담을 수 있습니다. 추가하려면 하나를 제거하십시오.",
    empty: "보드를 선택하면 해당 사양을 볼 수 있습니다.",
  },
  "zh-Hant": {
    general: "概觀",
    connectivity: "顯示、Ethernet 與 USB",
    m2: "M.2 插槽",
    cameras: "相機",
    lowSpeed: "低速 I/O",
    applications: "目標應用",
    cooling: "散熱",
    temperatureGrade: "溫度等級",
    m2KeyMx4: "Key M，PCIe x4（NVMe）",
    m2KeyMx2: "Key M，PCIe x2",
    m2KeyE: "Key E（Wi-Fi 與 Bluetooth）",
    m2KeyB: "Key B（LTE）",
    csi4Lane: "MIPI CSI，4-lane",
    csi2Lane: "MIPI CSI，2-lane",
    reference: "參考載板，已由 SiMa.ai 完成硬體啟動",
    untested: "尚未搭配 Modalix SoM 測試",
    ordering: "訂購資訊",
    vendorPage: "廠商產品頁面",
    specification: "規格",
    supported: "支援",
    carrier: "視載板而定",
    unsupported: "不支援",
    unconfirmed: "尚未確認",
    vendor: "廠商",
    board: "載板",
    status: "狀態",
    referenceShort: "參考載板",
    untestedShort: "尚未測試",
    remove: "從比較中移除",
    addBoard: "新增載板…",
    full: "比較表最多可容納四款載板。請先移除一款再新增。",
    empty: "選擇一款載板即可檢視其規格。",
  },
  uk: {
    general: "Загальне",
    connectivity: "Дисплей, Ethernet і USB",
    m2: "Слоти M.2",
    cameras: "Камери",
    lowSpeed: "Низькошвидкісний ввід-вивід",
    applications: "Цільові застосування",
    cooling: "Охолодження",
    temperatureGrade: "Температурний клас",
    m2KeyMx4: "Key M, PCIe x4 (NVMe)",
    m2KeyMx2: "Key M, PCIe x2",
    m2KeyE: "Key E (Wi-Fi і Bluetooth)",
    m2KeyB: "Key B (LTE)",
    csi4Lane: "MIPI CSI, 4 лінії",
    csi2Lane: "MIPI CSI, 2 лінії",
    reference: "Еталонна плата, запущена SiMa.ai",
    untested: "Не тестувалася з Modalix SoM",
    ordering: "Замовлення",
    vendorPage: "Сторінка продукту у виробника",
    specification: "Характеристика",
    supported: "Підтримується",
    carrier: "Залежить від плати-носія",
    unsupported: "Не підтримується",
    unconfirmed: "Не підтверджено",
    vendor: "Виробник",
    board: "Плата",
    status: "Статус",
    referenceShort: "Еталонна плата",
    untestedShort: "Не тестувалася",
    remove: "Вилучити з порівняння",
    addBoard: "Додати плату…",
    full: "Порівняння вміщує чотири плати. Вилучіть одну, щоб додати іншу.",
    empty: "Виберіть плату, щоб переглянути її характеристики.",
  },
};

function useCopy() {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const copy = LOCALIZED_UI[locale] || LOCALIZED_UI.en;
  const label = (key) => NEUTRAL_LABELS[key] || copy[key];
  // A value is a number, a language-neutral string, or an object keyed by locale.
  const text = (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "object") return value[locale] || value.en;
    return String(value);
  };
  return {copy, label, text};
}

function specValue(board, key) {
  return board[key] !== undefined ? board[key] : board.interfaces?.[key];
}

function boardName(board) {
  return `${board.vendor} ${board.model}`;
}

function Ordering({board, copy}) {
  const {partNumber, url} = board.ordering || {};
  return (
    <>
      {partNumber && <code>{partNumber}</code>}{partNumber && url && " "}
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {copy.vendorPage}
        </a>
      )}
    </>
  );
}

function SomSupport({support, copy, text}) {
  if (!support) return null;
  return (
    <>
      <span className={styles[support.status]}>{copy[support.status]}</span>
      {support.note && <span className={styles.note}>{text(support.note)}</span>}
    </>
  );
}

export function CarrierBoardList() {
  const {copy} = useCopy();
  return (
    <table>
      <thead>
        <tr>
          <th>{copy.vendor}</th>
          <th>{copy.board}</th>
          <th>{copy.status}</th>
          <th>{copy.ordering}</th>
        </tr>
      </thead>
      <tbody>
        {BOARDS.map((board) => (
          <tr key={board.id}>
            <td>{board.vendor}</td>
            <td>
              <a href="#carrier-board-specs" onClick={() => showBoard(board.id)}>
                {board.model}
              </a>
            </td>
            <td>{board.reference ? copy.referenceShort : copy.untestedShort}</td>
            <td>
              <Ordering board={board} copy={copy} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CarrierBoardSpecs() {
  const {copy, label, text} = useCopy();
  const selected = useSelection();
  const boards = selected.map((id) => BOARDS.find((board) => board.id === id));
  const full = selected.length >= MAX_COMPARE;
  // Interface rows always show, so the Modalix SoM status is visible whatever
  // boards are picked. Other rows show when a picked board has a value.
  const groups = SPEC_GROUPS.map((group) => ({
    ...group,
    keys: group.keys.filter(
      (key) => SOM_SUPPORT[key] || boards.some((board) => specValue(board, key) !== undefined),
    ),
  })).filter((group) => group.keys.length);

  return (
    <div id="carrier-board-specs" className={styles.specs}>
      <div className={styles.toolbar}>
        <select
          aria-label={copy.addBoard}
          value=""
          disabled={full}
          onChange={(event) => event.target.value && showBoard(event.target.value)}>
          <option value="">{copy.addBoard}</option>
          {BOARDS.filter((board) => !selected.includes(board.id)).map((board) => (
            <option key={board.id} value={board.id}>
              {boardName(board)}
            </option>
          ))}
        </select>
        {full && <span className={styles.hint}>{copy.full}</span>}
      </div>
      {boards.length === 0 ? (
        <p className={styles.hint}>{copy.empty}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{copy.specification}</th>
              <th>Modalix SoM</th>
              {boards.map((board) => (
                <th key={board.id}>
                  {board.vendor}
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`${copy.remove}: ${boardName(board)}`}
                    title={copy.remove}
                    onClick={() => removeBoard(board.id)}>
                    ×
                  </button>
                  <br />
                  {board.model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{copy.status}</th>
              <td />
              {boards.map((board) => (
                <td key={board.id}>
                  <span className={board.reference ? styles.badgeReference : styles.badge}>
                    {board.reference ? copy.reference : copy.untested}
                  </span>
                </td>
              ))}
            </tr>
            {groups.map((group) => (
              <React.Fragment key={group.id}>
                <tr className={styles.groupRow}>
                  <th colSpan={boards.length + 2}>{copy[group.id]}</th>
                </tr>
                {group.keys.map((key) => (
                  <tr key={key}>
                    <th scope="row">{label(key)}</th>
                    <td>
                      <SomSupport support={SOM_SUPPORT[key]} copy={copy} text={text} />
                    </td>
                    {boards.map((board) => (
                      <td key={board.id}>{text(specValue(board, key)) ?? "—"}</td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className={styles.groupRow}>
              <th colSpan={boards.length + 2}>{copy.ordering}</th>
            </tr>
            <tr>
              <th scope="row">{copy.vendor}</th>
              <td />
              {boards.map((board) => (
                <td key={board.id}>
                  <Ordering board={board} copy={copy} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

import React, {useSyncExternalStore} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";
// What the Modalix SoM supports for each interface, whatever the carrier provides.
import SOM_SUPPORT from "@site/src/data/modalix-som-interface-support.json";

// One JSON file per board in src/data/carrier-boards. Adding a file adds the
// board to the list and to the specification table.
const context = require.context("@site/src/data/carrier-boards", false, /\.json$/);
const rank = (board) => (board.reference ? 0 : board.broughtUp ? 1 : 2);
const BOARDS = context
  .keys()
  .map((key) => context(key))
  // The reference board first, then the boards that SiMa.ai has brought up, then by vendor.
  .sort((a, b) => rank(a) - rank(b) || a.vendor.localeCompare(b.vendor));

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
  {id: "power", keys: ["powerInput", "powerSom"]},
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
    power: "Power",
    powerInput: "Input voltage",
    powerSom: "Voltage to SoM VDD_IN",
    passthrough: "Same as the input",
    notRecommended: "Not recommended: 5 V DC to the SoM",
    somRequirement: "5.0 to 20 V DC. 5.4 V DC or higher recommended; below 5.4 V DC the MLA is locked to 600 MHz",
    toSom: "To the SoM:",
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
    broughtUp: (release) => `Brought up by SiMa.ai on platform release ${release} or later`,
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
    broughtUpShort: "Brought up",
    untestedShort: "Not tested",
    remove: "Remove from comparison",
    addBoard: "Add a board…",
    full: "The comparison holds four boards. Remove one to add another.",
    empty: "Select a board to view its specifications.",
  },
  ja: {
    general: "概要",
    power: "電源",
    powerInput: "入力電圧",
    powerSom: "SoM の VDD_IN への電圧",
    passthrough: "入力と同じ",
    notRecommended: "非推奨：SoM への供給は 5 V DC",
    somRequirement: "5.0～20 V DC。5.4 V DC 以上を推奨。5.4 V DC 未満では MLA が 600 MHz に固定されます",
    toSom: "SoM へ：",
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
    broughtUp: (release) => `SiMa.ai が立ち上げ済み（プラットフォームリリース ${release} 以降）`,
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
    broughtUpShort: "立ち上げ済み",
    untestedShort: "未確認",
    remove: "比較から削除",
    addBoard: "ボードを追加…",
    full: "比較できるボードは 4 つまでです。追加するには 1 つ削除してください。",
    empty: "ボードを選択すると、その仕様が表示されます。",
  },
  ko: {
    general: "개요",
    power: "전원",
    powerInput: "입력 전압",
    powerSom: "SoM VDD_IN 공급 전압",
    passthrough: "입력과 동일",
    notRecommended: "권장하지 않음: SoM에 5 V DC 공급",
    somRequirement: "5.0~20 V DC. 5.4 V DC 이상 권장. 5.4 V DC 미만에서는 MLA가 600 MHz로 고정됩니다",
    toSom: "SoM 공급:",
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
    broughtUp: (release) => `SiMa.ai 브링업 완료(플랫폼 릴리스 ${release} 이상)`,
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
    broughtUpShort: "브링업 완료",
    untestedShort: "테스트되지 않음",
    remove: "비교에서 제거",
    addBoard: "보드 추가…",
    full: "비교에는 보드를 4개까지 담을 수 있습니다. 추가하려면 하나를 제거하십시오.",
    empty: "보드를 선택하면 해당 사양을 볼 수 있습니다.",
  },
  "zh-Hant": {
    general: "概觀",
    power: "電源",
    powerInput: "輸入電壓",
    powerSom: "供給 SoM VDD_IN 的電壓",
    passthrough: "與輸入相同",
    notRecommended: "不建議：僅供給 SoM 5 V DC",
    somRequirement: "5.0 至 20 V DC。建議 5.4 V DC 以上；低於 5.4 V DC 時 MLA 會鎖定在 600 MHz",
    toSom: "供給 SoM：",
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
    broughtUp: (release) => `已由 SiMa.ai 完成硬體啟動（平台版本 ${release} 起）`,
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
    broughtUpShort: "已完成硬體啟動",
    untestedShort: "尚未測試",
    remove: "從比較中移除",
    addBoard: "新增載板…",
    full: "比較表最多可容納四款載板。請先移除一款再新增。",
    empty: "選擇一款載板即可檢視其規格。",
  },
  uk: {
    general: "Загальне",
    power: "Живлення",
    powerInput: "Вхідна напруга",
    powerSom: "Напруга на VDD_IN SoM",
    passthrough: "Така сама, як на вході",
    notRecommended: "Не рекомендується: 5 V DC на SoM",
    somRequirement: "5,0–20 V DC. Рекомендовано 5,4 V DC або вище; нижче 5,4 V DC частота MLA обмежена 600 MHz",
    toSom: "На SoM:",
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
    broughtUp: (release) => `Запущена SiMa.ai на випуску платформи ${release} або новішому`,
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
    broughtUpShort: "Запущена",
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

// The power rows read board.power: "input" is the DC supply the board accepts, and
// "som" is what it delivers to the SoM VDD_IN rail, either "passthrough" (the same as the
// input) or a voltage. A board without "som" shows "Not confirmed".
function specValue(board, key, copy) {
  if (key === "powerInput") return board.power?.input;
  if (key === "powerSom") {
    if (!board.power) return undefined;
    if (board.power.som === "passthrough") return copy.passthrough;
    return board.power.som ?? copy.unconfirmed;
  }
  return board[key] !== undefined ? board[key] : board.interfaces?.[key];
}

// The SoM requirement for the power rows, shown in the Modalix SoM column.
const SOM_POWER = {powerSom: "somRequirement"};

function SomVoltage({board, copy, text}) {
  if (!board.power) return "—";
  const som = board.power.som;
  return (
    <>
      {text(board.power.input) ?? "—"}
      {som !== "passthrough" && (
        <span className={styles.note}>
          {copy.toSom} {som ? text(som) : copy.unconfirmed}
        </span>
      )}
      {board.power.notRecommended && <span className={styles.notRecommended}>{copy.notRecommended}</span>}
    </>
  );
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
  const {copy, text} = useCopy();
  return (
    <table>
      <thead>
        <tr>
          <th>{copy.vendor}</th>
          <th>{copy.board}</th>
          <th>{copy.status}</th>
          <th>{copy.powerInput}</th>
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
            <td>
              {board.reference ? copy.referenceShort : board.broughtUp ? copy.broughtUpShort : copy.untestedShort}
            </td>
            <td>
              <SomVoltage board={board} copy={copy} text={text} />
            </td>
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
      (key) => SOM_SUPPORT[key] || SOM_POWER[key] || boards.some((board) => specValue(board, key, copy) !== undefined),
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
                  <span className={board.reference || board.broughtUp ? styles.badgeReference : styles.badge}>
                    {board.reference
                      ? copy.reference
                      : board.broughtUp
                        ? copy.broughtUp(board.broughtUp.release)
                        : copy.untested}
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
                      {SOM_POWER[key] ? copy[SOM_POWER[key]] : <SomSupport support={SOM_SUPPORT[key]} copy={copy} text={text} />}
                    </td>
                    {boards.map((board) => (
                      <td key={board.id}>
                        {text(specValue(board, key, copy)) ?? "—"}
                        {key === "powerSom" && board.power?.notRecommended && (
                          <span className={styles.notRecommended}>{copy.notRecommended}</span>
                        )}
                      </td>
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

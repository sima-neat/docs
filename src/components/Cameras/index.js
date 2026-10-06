import React, {useSyncExternalStore} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

// One JSON file per camera in src/data/cameras. Adding a file adds the camera
// to the list, to the specification table, and to the ports table.
const context = require.context("@site/src/data/cameras", false, /\.json$/);
const CAMERAS = context
  .keys()
  .map((key) => context(key))
  .sort((a, b) => a.order - b.order);

const MAX_COMPARE = 4;

// The list and the specification table sit under separate headings on the
// page, so they share the selection through a small store instead of a parent.
let selection = [CAMERAS[0].id];
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
const removeCamera = (id) => setSelection(selection.filter((item) => item !== id));
// Showing a camera from the list always works: when the table is full, the
// camera takes the last column.
const showCamera = (id) => {
  if (selection.includes(id)) return;
  setSelection([...selection.slice(0, MAX_COMPARE - 1), id]);
};

// Carrier names as they appear in the overlay file names.
const CARRIERS = [
  {id: "connectech", name: "Connect Tech"},
  {id: "seeedstudio", name: "Seeed Studio"},
  {id: "waveshare", name: "Waveshare"},
];

const LOCALIZED_UI = {
  en: {
    vendor: "Vendor",
    sensor: "Sensor",
    camera: "Camera",
    overlayName: "Name in the overlay file",
    partNumber: "Part number",
    unconfirmed: "Not confirmed",
    vendorListed: "Listed by the vendor for SiMa.ai",
    bitDepth: "Bit depth",
    specification: "Specification",
    general: "General",
    dataLanes: "MIPI data lanes",
    modesGroup: "Sensor modes in release 2.1.3",
    largestMode: "Largest mode",
    fastestMode: "Fastest mode",
    allModes: "All modes",
    portsGroup: "Carrier board ports with an overlay",
    ordering: "Ordering",
    remove: "Remove from comparison",
    addCamera: "Add a camera…",
    full: "The comparison holds four cameras. Remove one to add another.",
    empty: "Select a camera to view its specifications.",
    fps: (value) => `${value} fps`,
    bits: (value) => `${value}-bit`,
  },
  ja: {
    vendor: "ベンダー",
    sensor: "センサー",
    camera: "カメラ",
    overlayName: "オーバーレイファイル内の名前",
    partNumber: "型番",
    unconfirmed: "未確認",
    vendorListed: "ベンダーが SiMa.ai 向けとして掲載",
    bitDepth: "ビット深度",
    specification: "仕様",
    general: "概要",
    dataLanes: "MIPI データレーン数",
    modesGroup: "リリース 2.1.3 のセンサーモード",
    largestMode: "最大のモード",
    fastestMode: "最速のモード",
    allModes: "すべてのモード",
    portsGroup: "オーバーレイがあるキャリアボードのポート",
    ordering: "注文情報",
    remove: "比較から削除",
    addCamera: "カメラを追加…",
    full: "比較できるカメラは 4 つまでです。追加するには 1 つ削除してください。",
    empty: "カメラを選択すると、その仕様が表示されます。",
    fps: (value) => `${value} fps`,
    bits: (value) => `${value} ビット`,
  },
  ko: {
    vendor: "벤더",
    sensor: "센서",
    camera: "카메라",
    overlayName: "오버레이 파일의 이름",
    partNumber: "부품 번호",
    unconfirmed: "확인되지 않음",
    vendorListed: "벤더가 SiMa.ai용으로 등재",
    bitDepth: "비트 심도",
    specification: "사양",
    general: "개요",
    dataLanes: "MIPI 데이터 레인 수",
    modesGroup: "릴리스 2.1.3의 센서 모드",
    largestMode: "가장 큰 모드",
    fastestMode: "가장 빠른 모드",
    allModes: "모든 모드",
    portsGroup: "오버레이가 있는 캐리어 보드 포트",
    ordering: "주문 정보",
    remove: "비교에서 제거",
    addCamera: "카메라 추가…",
    full: "비교에는 카메라를 4개까지 담을 수 있습니다. 추가하려면 하나를 제거하십시오.",
    empty: "카메라를 선택하면 해당 사양을 볼 수 있습니다.",
    fps: (value) => `${value} fps`,
    bits: (value) => `${value}비트`,
  },
  "zh-Hant": {
    vendor: "廠商",
    sensor: "感測器",
    camera: "相機",
    overlayName: "overlay 檔名中的名稱",
    partNumber: "料號",
    unconfirmed: "尚未確認",
    vendorListed: "廠商列為適用於 SiMa.ai",
    bitDepth: "位元深度",
    specification: "規格",
    general: "概觀",
    dataLanes: "MIPI 資料通道數",
    modesGroup: "版本 2.1.3 的感測器模式",
    largestMode: "最大的模式",
    fastestMode: "最快的模式",
    allModes: "所有模式",
    portsGroup: "具有 overlay 的載板連接埠",
    ordering: "訂購資訊",
    remove: "從比較中移除",
    addCamera: "新增相機…",
    full: "比較表最多可容納四款相機。請先移除一款再新增。",
    empty: "選擇一款相機即可檢視其規格。",
    fps: (value) => `${value} fps`,
    bits: (value) => `${value} 位元`,
  },
  uk: {
    vendor: "Виробник",
    sensor: "Сенсор",
    camera: "Камера",
    overlayName: "Назва у файлі оверлея",
    partNumber: "Номер за каталогом",
    unconfirmed: "Не підтверджено",
    vendorListed: "Виробник зазначає для SiMa.ai",
    bitDepth: "Розрядність",
    specification: "Характеристика",
    general: "Загальне",
    dataLanes: "Лінії даних MIPI",
    modesGroup: "Режими сенсора у випуску 2.1.3",
    largestMode: "Найбільший режим",
    fastestMode: "Найшвидший режим",
    allModes: "Усі режими",
    portsGroup: "Порти плат-носіїв, для яких є оверлей",
    ordering: "Замовлення",
    remove: "Вилучити з порівняння",
    addCamera: "Додати камеру…",
    full: "Порівняння вміщує чотири камери. Вилучіть одну, щоб додати іншу.",
    empty: "Виберіть камеру, щоб переглянути її характеристики.",
    fps: (value) => `${value} кадр/с`,
    bits: (value) => `${value} біт`,
  },
};

function useCopy() {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const copy = LOCALIZED_UI[locale] || LOCALIZED_UI.en;
  // A value is a language-neutral string or an object keyed by locale.
  const text = (value) => (value && typeof value === "object" ? value[locale] || value.en : value);
  return {copy, text};
}

// Several overlays share a sensor, so the variant tells them apart.
function cameraName(camera, text) {
  const variant = text(camera.variant);
  return variant ? `${camera.sensor}, ${variant}` : camera.sensor;
}

function Ordering({camera, copy}) {
  const {status, partNumber, url} = camera.ordering || {};
  if (status !== "vendor-listed" || !partNumber) return <span className={styles.unconfirmed}>{copy.unconfirmed}</span>;
  return (
    <>
      <code>{partNumber}</code>
      <span className={styles.note}>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {copy.vendorListed}
          </a>
        ) : (
          copy.vendorListed
        )}
      </span>
    </>
  );
}

export function CameraList() {
  const {copy, text} = useCopy();
  return (
    <table>
      <thead>
        <tr>
          <th>{copy.vendor}</th>
          <th>{copy.camera}</th>
          <th>{copy.overlayName}</th>
          <th>{copy.partNumber}</th>
        </tr>
      </thead>
      <tbody>
        {CAMERAS.map((camera) => (
          <tr key={camera.id}>
            <td>{camera.vendor}</td>
            <td>
              <a href="#camera-specs" onClick={() => showCamera(camera.id)}>
                {cameraName(camera, text)}
              </a>
            </td>
            <td>
              <code>{camera.overlay}</code>
            </td>
            <td>
              <Ordering camera={camera} copy={copy} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CameraOverlays() {
  const {copy} = useCopy();
  return (
    <table>
      <thead>
        <tr>
          <th>{copy.overlayName}</th>
          {CARRIERS.map((carrier) => (
            <th key={carrier.id}>
              {carrier.name}
              <span className={styles.note}>
                <code>{carrier.id}</code>
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CAMERAS.map((camera) => (
          <tr key={camera.id}>
            <td>
              <code>{camera.overlay}</code>
            </td>
            {CARRIERS.map((carrier) => {
              const ports = camera.overlays?.[carrier.id];
              return (
                <td key={carrier.id}>
                  {ports?.length
                    ? ports.map((port, index) => (
                        <React.Fragment key={port}>
                          {index > 0 && ", "}
                          <code>{port}</code>
                        </React.Fragment>
                      ))
                    : "—"}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const pixels = (mode) => mode.width * mode.height;
const largestMode = (camera) => camera.modes.reduce((a, b) => (pixels(b) > pixels(a) ? b : a));
// Among the modes with the highest frame rate, the largest one.
const fastestMode = (camera) =>
  camera.modes.reduce((a, b) => (b.fps > a.fps || (b.fps === a.fps && pixels(b) > pixels(a)) ? b : a));

function Mode({mode, copy}) {
  return (
    <span className={styles.nowrap}>
      {mode.width} × {mode.height}, {copy.fps(mode.fps)}
    </span>
  );
}

export function CameraSpecs() {
  const {copy, text} = useCopy();
  const selected = useSelection();
  const cameras = selected.map((id) => CAMERAS.find((camera) => camera.id === id));
  const full = selected.length >= MAX_COMPARE;
  const name = (camera) => `${camera.vendor} ${cameraName(camera, text)}`;
  // A row is a label and a function that renders the cell of one camera.
  const row = (label, cell) => (
    <tr>
      <th scope="row">{label}</th>
      {cameras.map((camera) => (
        <td key={camera.id}>{cell(camera) ?? "—"}</td>
      ))}
    </tr>
  );
  const group = (label) => (
    <tr className={styles.groupRow}>
      <th colSpan={cameras.length + 1}>{label}</th>
    </tr>
  );

  return (
    <div id="camera-specs" className={styles.specs}>
      <div className={styles.toolbar}>
        <select
          aria-label={copy.addCamera}
          value=""
          disabled={full}
          onChange={(event) => event.target.value && showCamera(event.target.value)}>
          <option value="">{copy.addCamera}</option>
          {CAMERAS.filter((camera) => !selected.includes(camera.id)).map((camera) => (
            <option key={camera.id} value={camera.id}>
              {name(camera)}
            </option>
          ))}
        </select>
        {full && <span className={styles.hint}>{copy.full}</span>}
      </div>
      {cameras.length === 0 ? (
        <p className={styles.hint}>{copy.empty}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{copy.specification}</th>
              {cameras.map((camera) => (
                <th key={camera.id}>
                  {camera.vendor}
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`${copy.remove}: ${name(camera)}`}
                    title={copy.remove}
                    onClick={() => removeCamera(camera.id)}>
                    ×
                  </button>
                  <br />
                  {camera.sensor}
                  {camera.variant && <span className={styles.note}>{text(camera.variant)}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group(copy.general)}
            {row(copy.overlayName, (camera) => (
              <code>{camera.overlay}</code>
            ))}
            {row(copy.dataLanes, (camera) => camera.lanes)}
            {group(copy.modesGroup)}
            {row(copy.largestMode, (camera) => (
              <Mode mode={largestMode(camera)} copy={copy} />
            ))}
            {row(copy.fastestMode, (camera) => (
              <Mode mode={fastestMode(camera)} copy={copy} />
            ))}
            {row(copy.bitDepth, (camera) =>
              Array.from(new Set(camera.modes.map((mode) => mode.bitDepth)), (value) => copy.bits(value)).join(", "),
            )}
            {row(copy.allModes, (camera) =>
              camera.modes.map((mode) => (
                <div key={`${mode.width}x${mode.height}`}>
                  <Mode mode={mode} copy={copy} />
                </div>
              )),
            )}
            {group(copy.portsGroup)}
            {CARRIERS.map((carrier) => (
              <React.Fragment key={carrier.id}>
                {row(carrier.name, (camera) => {
                  const ports = camera.overlays?.[carrier.id];
                  if (!ports?.length) return null;
                  return ports.map((port, index) => (
                    <React.Fragment key={port}>
                      {index > 0 && ", "}
                      <code>{port}</code>
                    </React.Fragment>
                  ));
                })}
              </React.Fragment>
            ))}
            {group(copy.ordering)}
            {row(copy.partNumber, (camera) => (
              <Ordering camera={camera} copy={copy} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

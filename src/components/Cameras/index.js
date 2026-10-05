import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

// One JSON file per camera in src/data/cameras. Adding a file adds the camera
// to every table on the Supported MIPI Cameras page.
const context = require.context("@site/src/data/cameras", false, /\.json$/);
const CAMERAS = context
  .keys()
  .map((key) => context(key))
  .sort((a, b) => a.order - b.order);

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
    resolution: "Resolution",
    frameRate: "Frame rate",
    bitDepth: "Bit depth",
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
    resolution: "解像度",
    frameRate: "フレームレート",
    bitDepth: "ビット深度",
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
    resolution: "해상도",
    frameRate: "프레임 레이트",
    bitDepth: "비트 심도",
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
    resolution: "解析度",
    frameRate: "影格率",
    bitDepth: "位元深度",
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
    resolution: "Роздільна здатність",
    frameRate: "Частота кадрів",
    bitDepth: "Розрядність",
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
            <td>{cameraName(camera, text)}</td>
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

export function CameraModes() {
  const {copy, text} = useCopy();
  return (
    <table>
      <thead>
        <tr>
          <th>{copy.camera}</th>
          <th>{copy.resolution}</th>
          <th>{copy.frameRate}</th>
          <th>{copy.bitDepth}</th>
        </tr>
      </thead>
      <tbody>
        {CAMERAS.map((camera) =>
          camera.modes.map((mode, index) => (
            <tr key={`${camera.id}-${mode.width}x${mode.height}`}>
              {index === 0 && (
                <td rowSpan={camera.modes.length}>
                  {camera.vendor} {cameraName(camera, text)}
                </td>
              )}
              <td className={styles.nowrap}>
                {mode.width} × {mode.height}
              </td>
              <td className={styles.nowrap}>{copy.fps(mode.fps)}</td>
              <td className={styles.nowrap}>{copy.bits(mode.bitDepth)}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
}

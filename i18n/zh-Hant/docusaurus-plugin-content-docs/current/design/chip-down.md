---
title: Chip-Down 設計
description: 設計直接搭載 Modalix SoC 的電路板，並取得 chip-down 設計指南與技術資料。
sidebar_position: 2
---

# Chip-Down 設計

在 chip-down 設計中，封裝後的 Modalix SoC 會直接放在您自己的電路板上。原本由 Modalix SoM 提供的一切，包括記憶體、電源與時脈，都需要由您自行設計。Chip-down 設計也稱為 chip-on-board 設計。

如果您希望以已包含 SoC、記憶體與電源的模組為基礎進行開發，請參閱[載板設計](./carrier-board.md)。

## 您要設計的內容

- SoC 的電源供應與電源時序
- 時脈與重置
- LPDDR5 記憶體，包括佈線與調校
- 開機儲存裝置，以及用於除錯與復原的序列埠存取
- PCIe、MIPI CSI-2 與 Ethernet 等高速介面及其電路佈局
- 散熱

## Chip-Down 設計指南

SiMa.ai 提供 Modalix chip-down 設計指南。如需取得，請聯絡您的 SiMa.ai 業務代表。

## 技術資料

以下檔案同樣可向您的 SiMa.ai 業務代表索取。各檔案的說明請參閱[參考檔案](../reference/extra-docs.md)。

| 檔案 | 用途 |
| --- | --- |
| Modalix 系統單晶片（SoC）資料手冊 | 腳位功能、電源軌、訊號時序與工作限制 |
| Modalix PCB 布線指南 | PCIe、MIPI CSI-2、Ethernet 及其他關鍵網路的佈局規則 |
| Modalix DDR 調整指南 | LPDDR5 佈線、終端處理與校準 |
| Modalix 搶先體驗版 DevKit 設計套件 | Chip-down 參考設計 |
| Modalix PCIe HHHL 設計套件 | PCIe 卡的 chip-down 參考設計 |
| Modalix 系統模組（SoM）散熱設計指南 | 散熱預算與散熱設計 |

## 設計步驟

1. 取得 chip-down 設計指南與上述技術資料。
2. 以設計套件作為參考設計，進行電路板設計。
3. 依照散熱設計指南規劃散熱。
4. 啟動電路板。Chip-down 的硬體啟動流程（包括記憶體初始化與首次開機）目前尚未公開說明。如需協助，請聯絡您的 SiMa.ai 業務代表。
5. 使用[建置與自訂 eLxr](../software/index.md) 調整並建置軟體。

## 後續步驟

- [低速 I/O](../interfaces/low-speed-io.mdx)：GPIO、UART、I2C 與 SPI 的腳位對應。
- [工廠組裝與測試](../deployment/factory-build-and-test.mdx)：在量產環境中燒錄與測試電路板。

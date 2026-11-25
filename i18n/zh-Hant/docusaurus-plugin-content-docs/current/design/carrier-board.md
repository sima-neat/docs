---
title: 載板設計
description: 為 Modalix SoM 設計載板，從技術資料到首次上電。
sidebar_position: 3
---

# 載板設計

Modalix SoM 將 Modalix SoC、LPDDR5 記憶體與電源整合在一個具備板對板連接器的模組上。SoM 會插入載板使用，載板上則配置產品所需的連接器、電源輸入與介面。您可以選購現成的載板，或自行設計。

如果您想改為將 SoC 直接放在自己的電路板上，請參閱[Chip-Down 設計](./chip-down.md)。


:::warning 輸入電壓會影響推論效能
Modalix SoM 的 VDD_IN 接受 5.0 至 20 V DC。請供給 5.4 V DC 以上，以避免 MLA 頻率降低：低於 5.4 V DC 時，MLA 會鎖定在 600 MHz，推論效能因此降低。不建議使用僅供給 SoM 5 V DC 的載板。如果您的載板在 VDD_IN 之前先降壓輸入，請將穩壓器設計為輸出 5.4 V DC 以上。請參閱 [Modalix SoM 資料手冊](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/Modalix_SOM_Board_v2_Data_Sheet_Rev2.3_10-12-2026.pdf#page=40)第 4 章。
:::

## SoM 提供的項目 {#som-provides}

下列元件位於 Modalix SoM 上，只要載板遵循 260 針連接器的腳位配置，即可運作：

- Modalix MLSoC
- LPDDR5 記憶體
- eMMC 與 SPI 快閃儲存裝置
- USB 控制器、Gigabit 乙太網路 PHY 與 HDMI 視訊處理器
- 即時時鐘

## 載板提供的項目 {#carrier-provides}

- SoM 與您的介面之間的連接器腳位對應
- 對 SoM 的電源供應：VDD_IN 為 5.4 V DC 以上
- 乙太網路、PCIe、USB、MIPI 相機與低速 I/O 等介面
- 用於除錯與復原的序列埠存取
- 散熱

## 選購或設計載板 {#choose-or-design}

您可以選購現成的載板，或自行設計：

- 若要選購，請在[第三方載板](./third-party-carriers.mdx)中比較各款載板。Modalix DevKit 採用 Waveshare 載板，也就是參考載板。
- 若要自行設計，請使用下方的技術資料與設計步驟。

## 技術資料

以下檔案收錄於[參考檔案](../reference/extra-docs.md)。

| 檔案 | 用途 |
| --- | --- |
| Modalix 系統模組載板硬體參考 | 連接器腳位、介面對應、電源供應與參考連接。請先閱讀此檔案。 |
| Modalix 系統模組（SoM）資料手冊 | SoM 的電氣、機械與散熱規格 |
| 系統模組（SoM）載板啟動指南 | 為新載板供電並進行驗證 |
| Modalix 系統模組（SoM）散熱設計指南 | 散熱預算與散熱設計，可向您的 SiMa.ai 聯絡人索取 |

## 設計步驟

1. 閱讀 **Modalix 系統模組載板硬體參考**與 **Modalix 系統模組（SoM）資料手冊**。
2. 規劃電源，使 VDD_IN 獲得 5.4 V DC 以上。
3. 使用[載板硬體啟動](./som-carrier.mdx)規劃連接器腳位對應與介面；該頁面涵蓋連接器介面、與參考載板的差異，以及相機 overlay。
4. 在[低速 I/O](../interfaces/low-speed-io.mdx) 中確認低速腳位配置。
5. 電路板製作完成後，請依照 **系統模組（SoM）載板啟動指南** 進行首次上電。
6. 使用[從原始碼建置 BSP](../software/build-from-source.mdx) 為您的載板調整 device tree。

## 後續步驟

- [載板硬體啟動](./som-carrier.mdx)：參考載板，以及需要進行軟體調整的項目。
- [第三方載板](./third-party-carriers.mdx)：依介面比較相同外形規格的現成載板。
- [工廠組裝與測試](../deployment/factory-build-and-test.mdx)：在量產環境中燒錄與測試電路板。

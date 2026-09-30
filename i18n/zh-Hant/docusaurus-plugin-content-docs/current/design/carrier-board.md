---
title: 載板設計
description: 為 Modalix SoM 設計載板，從技術資料到首次上電。
sidebar_position: 3
---

# 載板設計

Modalix SoM 將 Modalix SoC、LPDDR5 記憶體與電源整合在一個具備板對板連接器的模組上。您要設計的是供 SoM 插入的載板，並在其上配置產品所需的連接器、電源輸入與介面。

如果您想改為將 SoC 直接放在自己的電路板上，請參閱[Chip-Down 設計](./chip-down.md)。

## 您要設計的內容

- SoM 與您的介面之間的連接器腳位對應
- 對 SoM 的電源供應
- Ethernet、PCIe、USB、MIPI 相機與低速 I/O 等介面
- 用於除錯與復原的序列埠存取
- 散熱

## 技術資料

以下檔案收錄於[參考檔案](../reference/extra-docs.md)。

| 檔案 | 用途 |
| --- | --- |
| Modalix 系統模組載板硬體參考 | 連接器腳位、介面對應、電源供應與參考連接。請先閱讀此檔案。 |
| Modalix 系統模組（SoM）資料手冊 | SoM 的電氣、機械與散熱規格 |
| 系統模組（SoM）載板啟動指南 | 為新載板供電並進行驗證 |
| Modalix 系統模組（SoM）散熱設計指南 | 散熱預算與散熱設計，可向您的 SiMa.ai 業務代表索取 |

## 設計步驟

1. 閱讀 **Modalix 系統模組載板硬體參考**與 **Modalix 系統模組（SoM）資料手冊**。
2. 使用[載板硬體啟動](./som-carrier.mdx)規劃連接器腳位對應、電源與介面；該頁面涵蓋連接器介面、與參考載板的差異，以及相機 overlay。
3. 在[低速 I/O](../interfaces/low-speed-io.mdx) 中確認低速腳位配置。
4. 電路板製作完成後，請依照 **系統模組（SoM）載板啟動指南** 進行首次上電。
5. 使用[從原始碼建置 BSP](../software/build-from-source.mdx) 為您的載板調整 device tree。

## 後續步驟

- [載板硬體啟動](./som-carrier.mdx)：參考載板，以及需要進行軟體調整的項目。
- [工廠組裝與測試](../deployment/factory-build-and-test.mdx)：在量產環境中燒錄與測試電路板。

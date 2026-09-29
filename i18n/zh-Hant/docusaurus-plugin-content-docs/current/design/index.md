---
title: 設計您的硬體
description: 在 SoM 載板與 chip-down 設計之間做出選擇，並找到每種路徑所需的技術文件。
sidebar_position: 1
---

# 設計您的硬體

以 MLSoC Modalix 打造產品有兩種方式。請在開始之前先選定其中一種，因為兩者需要的技術文件與硬體啟動（bring-up）工作都不相同。

| | SoM 載板 | Chip-down |
| --- | --- | --- |
| 您要設計的內容 | Modalix SoM 的載板；SoM 本身已包含 SoC、LPDDR5 與電源 | 搭載封裝後 Modalix SoC 的電路板，包括記憶體、電源與時脈 |
| 主要設計工作 | 連接器腳位對應、電源供應、介面、散熱 | 上述所有項目，再加上 DDR 佈線與調校，以及高速電路佈局 |
| 技術文件 | 公開的資料表與硬體啟動指南 | SoC 資料表與設計套件，可向 SiMa.ai 申請取得 |
| 軟體起點 | Modalix BSP，並針對您的載板修改 device tree | Modalix BSP，並進行板級調整 |

Chip-down 設計也稱為 chip-on-board 設計。

## SoM 載板 {#som-carrier-board}

1. 閱讀[參考文件](../reference/extra-docs.md)中的 **Modalix SoM Carrier Board Hardware Reference** 與 **Modalix SoM
   Datasheet**。
2. 使用[載板硬體啟動](./som-carrier.mdx)規劃連接器腳位對應、電源與介面；該頁面涵蓋連接器介面、與參考載板的差異，以及相機 overlay。
3. 在[低速 I/O](../interfaces/low-speed-io.mdx) 中確認低速腳位配置。
4. 電路板製作完成後，請依照 **Carrier Board SoM Bring-Up Guide** 進行首次上電，然後依照[從原始碼建置 BSP](../software/build-from-source.mdx) 調整 device tree。

## Chip-Down {#chip-down}

1. 向您的 SiMa.ai 業務代表索取 **Modalix SoC Datasheet**、**PCB Routing Guidelines**、**DDR Tuning
   Guide** 以及參考設計套件。各文件涵蓋的內容請參閱[參考文件](../reference/extra-docs.md)。
2. 使用 **Modalix SoM Thermal Design Guide** 規劃散熱。
3. 使用[建置與自訂 eLxr](../software/index.md) 建置並調整軟體。

Chip-down 的硬體啟動流程（包括記憶體初始化與首次開機）目前尚未公開說明。如需相關資訊，請聯絡您的 SiMa.ai 業務代表。

## 後續步驟

- [介面與周邊裝置](../interfaces/low-speed-io.mdx)：腳位對應與周邊裝置設定。
- [部署您的建置](../software/build-from-source.mdx#deploy-your-build)：將您自己的建置結果安裝到電路板上。
- [工廠組裝與測試](../deployment/factory-build-and-test.mdx)：在量產環境中燒錄與測試電路板。

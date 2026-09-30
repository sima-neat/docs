---
title: 設計您的硬體
description: Chip-down 設計與載板設計是打造 Modalix 系統的兩條不同路徑。請在開始之前先選定其中一條。
sidebar_position: 1
---

# 設計您的硬體

以 MLSoC Modalix 為核心打造您自己的系統，有兩條不同的路徑。兩者所需的設計工作、技術資料與硬體啟動（bring-up）流程都不相同，因此請在開始之前先選定其中一條。

<div className="card-grid">
  <a className="card" href="/hardware/design/chip-down">
    <h4>Chip-Down 設計</h4>
    <p>將 Modalix SoC 直接放在您自己的電路板上，並自行設計其記憶體、電源與時脈。</p>
  </a>
  <a className="card" href="/hardware/design/carrier-board">
    <h4>載板設計</h4>
    <p>為 Modalix SoM 設計載板；SoM 本身已包含 SoC、記憶體與電源。</p>
  </a>
</div>

## 比較兩條路徑

| | Chip-down 設計 | 載板設計 |
| --- | --- | --- |
| 您要設計的內容 | 搭載封裝後 Modalix SoC 的電路板，包括記憶體、電源與時脈 | Modalix SoM 的載板；SoM 本身已包含 SoC、LPDDR5 與電源 |
| 主要設計工作 | 電源時序、時脈與重置、LPDDR5 佈線與調校、高速電路佈局、介面、散熱 | 連接器腳位對應、電源供應、介面、散熱 |
| 技術資料 | Chip-down 設計指南、SoC 資料手冊與設計套件，可向 SiMa.ai 申請取得 | 公開的資料手冊與硬體啟動指南 |
| 軟體起點 | Modalix BSP，並進行板級調整 | Modalix BSP，並針對您的載板修改 device tree |

電路板能夠開機之後，兩條路徑都使用相同的軟體與量產步驟：

- [建置與自訂 eLxr](../software/index.md)：為您的電路板建置核心、U-Boot 與 device tree。
- [介面與周邊裝置](../interfaces/low-speed-io.mdx)：腳位對應與周邊裝置設定。
- [工廠組裝與測試](../deployment/factory-build-and-test.mdx)：在量產環境中燒錄與測試電路板。

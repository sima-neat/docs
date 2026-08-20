---
title: "板級支援套件"
description: "從啟動到可供使用的 Linux 使用者空間，這是一組低階軟體，可讓 SiMa.ai 晶片板正常運作。"
sidebar_position: 1
---

# 板級支援套件

板級支援套件 (BSP) 是一組低階軟體，用於啟動 SiMa.ai 板，從開機到可使用的 Linux 使用者空間。它是所有高階工作負載（例如感知管線、ROS 2 節點、自訂 C/C++ 應用程式）的基礎。

SiMa.ai BSP 包含：

- **啟動載入器** (U-Boot) — 初始化 DRAM，讀取啟動媒體，並載入核心。
- **核心** — 包含用於 SoC 上 MLA、CVU、ISP、PCIe、網路和儲存 IP 的 SiMa.ai 驅動程式的 Linux 核心。
- **裝置樹** — 描述特定板卡的周邊裝置（例如：MIPI 相機、GMSL2 反序列化器、GPIO 接頭、M.2 插槽），以便核心在啟動時可以偵測這些裝置。
- **根檔案系統** — 使用者空間工具、系統服務，以及與晶片上的加速器進行通訊的 SiMa.ai 執行階段函式庫。
- **韌體二進位檔** — 用於安全處理器 (tRoot) 和其他協同處理器。

## Modalix 基帶處理器

Modalix BSP 的目標是 Modalix DevKit、Modalix 早期版本套件，以及 Modalix PCIe 卡。它基於 [eLxr](https://elxr.org/)，這是一個源自 Debian 的發行版本。使用者空間透過 `apt` 進行管理，因此自訂 Modalix 映像檔更接近於封裝 Debian 軟體，而不是編寫 Yocto 腳本。對於將現有的 Yocto DevKit 轉換為 eLxr 的使用者，請參閱 [轉換為 eLxr](./tech-notes/elxr-conversion)。

來源層：[swsoc-simaai-elxr-doc](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

## 您可以如何使用 BSP 原始碼？

上述的程式碼儲存庫在您需要以下情況時會很有用：

- **新增自訂周邊裝置** — 為新的 MIPI 相機、GMSL2 感測器或 HAT 板撰寫裝置樹覆蓋層。
- **啟用核心功能** — 開啟核心選項（例如，檔案系統、網路協定或 USB 裝置驅動程式），這些選項並未包含在預設映像檔中。
- **替換或擴充根檔案系統** — 將您自己的應用程式、函式庫或系統服務整合進去。
- **在本地重新建立發布版本** — 重新建立與 DevKit 上所使用的完全相同的映像檔，以便進行審核或修改。

一旦自訂映像建立完成，就將其燒錄到一個 DevKit 使用下列方法之一 [韌體更新](/hardware/getting-started/firmware-update/).

## 儲存庫

- [Modalix (eLxr)](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

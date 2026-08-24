---
title: "術語表"
description: "本文檔中常用的縮寫和術語，適用於所有 SiMa.ai 硬體檔案。"
sidebar_position: 3
---

# 術語表

本檔案中常用的縮寫和術語。條目按主題分組；每個組別內的條目則按字母順序排列。

## 矽晶與運算

**CVU**
：**電腦視覺單元 (Computer Vision Unit)。** 這是晶片上的加速器，專門用於處理傳統的視覺工作負載（濾鏡、轉換、影像處理核心）。MLSoC Modalix 整合了一個 Synopsys EV74 CVU，運算效能為 750 16 位元 GOPS。

**ISP**
：**影像訊號處理器 (Image Signal Processor)。** 這是晶片上的模組，用於將原始相機感測器輸出（拜耳陣列、單色等）轉換為可用的影像。MLSoC Modalix 使用一個 ARM C-71 ISP，其運作頻率為 1.2 GHz。

**MLA**
：**機器學習加速器 (Machine Learning Accelerator)。** 這是晶片上的模組，用於執行神經網路推論。MLA 是 MLSoC Modalix 的主要差異化因素，也是 NEAT 應用程式的目標。

**MLSoC**
：**機器學習系統晶片 (Machine Learning System-on-Chip)。** 這是 SiMa.ai 的邊緣 AI 處理器產品系列。本檔案涵蓋了 **MLSoC Modalix**，這是第二代產品。

**Modalix**
：這是 SiMa.ai 第二代 MLSoC 的產品名稱，也是本檔案中所有套件的核心矽晶。

**NoC**
：**晶片網路 (Network on Chip)。** 這是晶片上的互連，用於連接 MLA、CVU、ISP、應用程式核心、記憶體控制器和 I/O 模組。Modalix NoC 包含效能監控、防火牆和 QoS 控制。

**tRoot**
：這是 MLSoC 上的硬體信任根子系統，用於處理安全啟動、金鑰儲存和韌體驗證。

## 系統軟體

**BSP**
：**板級支援套件 (Board Support Package)。** 這是低階軟體的集合，包含啟動載入程式、核心、裝置樹、驅動程式和根檔案系統，可讓 SiMa.ai 板從開機到可使用的 Linux 使用者空間。請參閱 [板級支援套件](./bsp)。

**eLxr**
：一種 [Debian 衍生 Linux 發行版](https://elxr.org/)，用於作為 2025 年 12 月中旬之後出貨的 Modalix DevKit 上的預設執行階段。使用者空間透過 `apt` 進行管理。

**sima-cli**
：用於透過網路或 PCIe 刷寫韌體、安裝驅動程式以及管理 SiMa.ai 裝置的主機端命令列工具。

**U-Boot**
：用於 SiMa.ai DevKit 的啟動載入程式。負責 DRAM 初始化、讀取啟動媒體以及載入 Linux 核心。

**Yocto**
：一種嵌入式 Linux 建構系統（基於 poky），用於舊版 MLSoC BSP。Modalix DevKit 最初配備 Yocto 映像檔，並且可以轉換為 eLxr；請參閱 [轉換為 eLxr](./tech-notes/elxr-conversion)。

## 應用程式與框架

**NEAT**
：SiMa.ai 的應用框架，適用於 MLSoC Modalix。NEAT 取代了舊版的 Palette/MPK 工具鏈。完整的說明檔案可在 [軟體檔案](https://developer.sima.ai/software) 中找到。

**NEAT 應用**
：由 NEAT 工具鏈產生的封裝式裝置端推論管線（模型 + 前置/後置處理圖 + 執行階段中繼資料），並載入到 MLSoC Modalix 上以供執行。

## 硬體與外觀規格

**DevKit**
：一個預組裝的 SiMa.ai 開發套件，例如 Modalix DevKit 或 Modalix 早期版本 DevKit，用於評估矽晶片並在設計客製化載板之前開發應用程式。

**eMMC**
：**嵌入式多媒體卡 (Embedded MultiMediaCard)。** 焊接在 DevKit 上的板載快閃記憶體。用於儲存啟動映像和根檔案系統。

**HHHL**
：**半高、半長 (Half-Height, Half-Length)。** 一種 PCIe 卡片規格，與大多數伺服器和工作站機殼相容。Modalix PCIe 卡是一種 HHHL 卡。

**LPDDR5**
：**低功耗雙倍資料速率 5 (Low-Power Double Data Rate 5) 記憶體。** Modalix 產品中使用的系統 RAM。MLSoC Modalix 支援跨 8 個通道的 32 位和 64 位 LPDDR5 設定。

**SoC**
：**系統晶片 (System on Chip)。** 一個單一晶片，整合了 CPU、加速器、記憶體控制器和 I/O，與多晶片模組相反。

**SoM**
：**系統模組 (System on Module)。** 一個模組，透過連接器將 SoC 以及其支援的 RAM、儲存裝置和電源電路暴露出來，以便整合到客製化載板中。Modalix DevKit 建立在 Modalix SoM 的基礎上。

## 介面

**GMSL2**
：**千兆多媒體序列鏈路，版本 2。** 一種用於透過同軸電纜（FAKRA）傳輸相機和感測器資料的汽車級序列協定。支援於 Modalix PCIe 卡上。

**MIPI CSI**
：**行動產業處理器介面 — 相機序列介面。** 將影像感測器連接到 SoC 的標準高速序列介面。

## 部署

**PCIe 模式**
：一種部署架構，其中 Modalix PCIe 卡插入主機。主機處理 I/O 和協調；卡處理推論。請參閱 [PCIe 模式](/hardware/getting-started/pcie-mode)。

**獨立模式**
：一種部署架構，其中 Modalix DevKit 或 Modalix 基於 SoM 的系統作為一個獨立的設備運行，本地處理感測器資料並通過網絡發送結果。請參閱 [獨立模式](/hardware/getting-started/standalone-mode)。

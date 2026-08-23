---
title: "參考檔案"
description: "產品簡介、技術規格表、硬體參考手冊，以及用於 SiMa.ai Modalix 產品的設計和調校指南，按您想要製作的內容進行分類。"
sidebar_position: 4
---

# 參考檔案

本頁列出關於 SiMa.ai Modalix 產品的簡要說明、資料表、硬體參考手冊，以及設計和調整指南，內容依您想要達成的目標而有所區分——從評估平台到設計、調整和整合您自己的 Modalix 產品。標記為 *請聯絡您的 SiMa.ai 聯絡人* 的檔案將根據要求提供。

## 快速入門指南

剛開始使用 DevKit 嗎？請從這裡開始——這份互動式指南會引導您完成首次啟動，然後再深入研究其餘的檔案。

| 檔案 | 描述 | 下載 |
| --- | --- | --- |
| **Modalix 系統模組 DevKit 3.0 快速入門指南** | 這是一份互動式的逐步操作指南，內容涵蓋了 DevKit 的開箱和首次啟動流程，包括電源、序列埠存取以及初始網路設定。這是最快速上手硬體的方式。 | [啟動互動式指南](pathname:///tools/qsg/index.html) |

## 評估 Modalix，然後選擇一款產品

在深入研究硬體層面的細節之前，請先了解該平台，並確認產品是否符合您的應用需求。

| 檔案 | 描述 | 下載 |
| --- | --- | --- |
| **Modalix 系統晶片（SoC）產品簡介** | 以下是對 MLSoC Modalix 矽晶片的概觀，其中包含機器學習加速器 (MLA)、影像訊號處理器 (ISP)、電腦視覺單元 (CVU)、視訊編解碼器和 I/O 等元件，並提供其主要效能和功耗資料。首先快速瀏覽，以評估 Modalix 是否適合您的工作負載。 | [下載 PDF](https://sima.ai/wp-content/uploads/2025/12/Modalix-SoC-Product-Brief_05.3.pdf) |
| **Modalix 系統晶片（SoM）產品簡介** | 以下是關於 Modalix 系統模組的簡要介紹——這是一種將 SoC 與 LPDDR5、電源以及板對板連接器整合在一起的模組，用於產品整合。當您打算設計一個基於系統模組 (SoM) 的客製化設計，而不是使用完整的 DevKit 時，請從這裡開始。 | [下載 PDF](https://sima.ai/wp-content/uploads/2025/12/Modalix-SoM-Product-Brief_05.3.pdf) |
| **Modalix 系統模組 (SoM) DevKit 3.0 產品簡介** | 以下是關於 DevKit 的功能、介面和外觀尺寸的摘要。請使用此資訊確認該套件是否符合您在訂購前對評估和原型設計的需求。 | [下載 PDF](https://sima.ai/wp-content/uploads/2025/12/Modalix-DevKit-Product-Brief_04.2.pdf) |
| **Modalix PCIe HHHL 硬體參考資料** | 針對半高/半長（HHHL）Modalix PCIe卡的硬體參考資料——包括連接器和電源細節、機械尺寸，以及主機整合需求。請查閱此資料，以評估該卡是否適用於主機連接的推理系統。 | [下載 PDF](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/SiMa_Modalix_PHHHL_Manual_Rev1.00_2-21-2026.pdf) |

## 設計一個客製化的載板

將 Modalix 系統模組 (SoM) 整合到您自己的電路板時，以下是核心參考資料：引腳設定、電源、高速訊號路由，以及首次啟動。

| 檔案 | 描述 | 下載 |
| --- | --- | --- |
| **Modalix 系統模組載板硬體參考** | 設計基於 Modalix 系統模組 (SoM) 的載板時，以下是主要設計指南：連接器引腳設定、介面對應、電源供應和參考連接。在開始自訂板設計時，請先閱讀此指南。 | [下載 PDF](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/SiMa_SOM_Carrier_Board_Data_Sheet_Rev1.2_1-24-2026.pdf) |
| **Modalix 系統晶片（SoM）資料手冊** | SoM 的詳細電氣、機械和熱特性規格，包括：連接器引腳設定、電源排序、電流消耗和工作限制。這是制定板級設計決策的權威參考資料。 | [下載 PDF](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/Modalix_SOM_Board_Data_Sheet_Rev2.1_5-15-2026.pdf) |
| **Modalix 系統單晶片（SoC）資料手冊** | 關於 MLSoC Modalix 晶片的詳細電氣、機械和熱規格——包括引腳功能、電源軌、訊號時序和工作限制。當您在矽晶層級進行設計，而不是以預先整合的系統模組 (SoM) 為基礎時，這些資訊是必要的。 | *請聯絡您的SiMa.ai聯絡人* |
| **載板模組（SoM）啟動指南** | 一份逐步操作的手冊，說明如何為新組裝的載板供電並進行驗證，從啟動電源供應開始，到啟動系統單晶片（SoM），並包含檢查點和常見的啟動問題，以便您留意。 | [下載 PDF](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/Modalix_SOM_Carrier_Board_Bring-Up_Guide_Rev1.3.2_6-15-2026.pdf) |

## 晶片植入板設計

直接將 MLSoC Modalix 晶片設計到您的 PCB（晶片直接焊接到板上），而不是使用預先整合的系統模組（SoM）？這包括高速訊號路由、記憶體調整，以及一個經過驗證的參考設計，這是裸晶片佈局需要正確處理的。

| 檔案 | 描述 | 下載 |
| --- | --- | --- |
| **Modalix PCB 布線指南** | 針對 PCIe、MIPI CSI-2、乙太網路和其他關鍵網路，提供高速佈線規則——包括阻抗、長度匹配和參考平面指引——以確保訊號完整性，並在客製化電路板上實現最佳效能。 | *請聯絡您的SiMa.ai聯絡人* |
| **Modalix DDR 調整指南** | LPDDR5 的布線和調整指南，包含長度匹配、終端處理和校準，以確保您的設計能夠實現可靠且全速的記憶體運作。 | *請聯絡您的SiMa.ai聯絡人* |
| **Modalix 搶先體驗版 DevKit 設計套件** | 早期版本 DevKit 的原理圖和設計素材——這是一個經過驗證的晶片植入式參考設計，可用於您根據裸露的 SoC 設計自己的電路板。 | *請聯絡您的SiMa.ai聯絡人* |
| **Modalix PCIe HHHL 設計套件** | 用於 PCIe HHHL 卡的原理圖和設計資料，可用作晶片整合於板上的參考，以便調整或擴展設計。 | *請聯絡您的SiMa.ai聯絡人* |

## 調整相機和影像處理器 (ISP)

本資源旨在協助您連接相機感測器，並透過片上影像訊號處理器 (ISP) 產生經過良好調整的影像。

| 檔案 | 描述 | 下載 |
| --- | --- | --- |
| **Modalix 相機與影像訊號處理器（ISP）調校指南** | 調整 Modalix 影像訊號處理器，使其與特定相機感測器配合的程序——包括校準、曝光、白平衡，以及影像品質管線。在感測器已連接並完成列舉後，使用這些程序來調整影像品質。 | *請聯絡您的SiMa.ai聯絡人* |

> 若要先在 DevKit 上實體連接並啟用 MIPI CSI-2 攝影機，請參閱 [ MIPI 攝影機介面 ](/zh-Hant/hardware/getting-started/standalone-mode/mipi-camera-interfaces)。

## 規劃電力和散熱設計

SiMa.ai 提供一份專門的系統模組（SoM）散熱設計指南，用於設計 Modalix SoM 散熱解決方案。在確定電源供應大小、選擇散熱片以及驗證散熱效果時，請將其與本頁其他位置列出的資料表中和硬體參考檔案中所記載的電氣、熱力和機械限制相配合。

| 檔案 | 描述 | 下載 |
| --- | --- | --- |
| **Modalix 系統晶片（SoM）散熱設計指南** | 這是一份專門用於設計 Modalix 系統模組 (SoM) 散熱解決方案的參考資料，內容包括：功率耗散和散熱預算、建議的散熱片和氣流設定、結溫管理，以及測量和驗證程序。當設計客製化板或外殼的散熱系統時，這將是主要的參考指南。 | *請聯絡您的SiMa.ai聯絡人* |

---
title: 板級支援套件
description: 讓 SiMa.ai 電路板從上電到可用 Linux 使用者空間的底層軟體堆疊。
sidebar_position: 1
---

# 板級支援套件

板級支援套件（BSP）是讓 SiMa.ai 電路板從上電到可用 Linux 使用者空間的底層軟體。較高層級的工作負載，包括感知管線、ROS 2 節點以及自訂 C/C++ 應用程式，都在其上執行。

SiMa.ai BSP 包含：

- **開機載入程式**（U-Boot）：初始化 DRAM、讀取開機媒體並載入核心。
- **核心**：包含 SiMa.ai 驅動程式的 Linux 核心，支援 SoC 上的 MLA、CVU、ISP、PCIe、網路與儲存 IP。
- **Device tree**：描述各電路板專屬的周邊裝置（MIPI 相機、GMSL2 解串列器、GPIO 排針、M.2 插槽），讓核心能在開機時偵測這些裝置。
- **根檔案系統**：使用者空間工具、系統服務，以及與晶片上加速器溝通的 SiMa.ai 執行階段函式庫。
- **韌體二進位檔**：供安全處理器（tRoot）及其他協同處理器使用。

## Modalix BSP

Modalix BSP 適用於 Modalix DevKit、Modalix Early Access 套件以及 Modalix PCIe 卡。它建構於 Debian 衍生發行版 [eLxr](https://elxr.org/) 之上。使用者空間透過 `apt` 管理，因此自訂 Modalix 映像檔比較接近封裝 Debian 軟體，而不是撰寫 Yocto recipe。若要將現有的 Yocto DevKit 轉換為 eLxr，請參閱[轉換為 eLxr](../reference/tech-notes/elxr-conversion.mdx)。

原始碼：[simaai-linux](https://github.com/SiMa-ai/simaai-linux)（核心與 device tree）、[sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot)（U-Boot）以及 [meta-simaai](https://github.com/SiMa-ai/meta-simaai)（Yocto layer）。

## eLxr 或 Yocto {#elxr-or-yocto}

電路板硬體啟動建議採用 eLxr。您也可以使用 meta-simaai layer 及其[映像檔建置手冊](https://github.com/SiMa-ai/meta-simaai/blob/master/documentation/build-manual.rst)，以 Yocto 進行硬體啟動。兩者皆以相同的核心設定，從相同的核心與 U-Boot 原始碼建置，因此驅動程式與 device tree 的工作成果可以直接沿用。

| 工作 | eLxr（建議） | Yocto |
| --- | --- | --- |
| 建置核心、U-Boot、device tree、overlay 與核心模組 | [從原始碼建置 BSP](./build-from-source.mdx) | [映像檔建置手冊](https://github.com/SiMa-ai/meta-simaai/blob/master/documentation/build-manual.rst) |
| 新增使用者空間軟體 | 使用 `apt` 安裝套件 | 撰寫 recipe |
| 從原始碼建置完整映像檔 | 尚未提供文件 | [使用 Yocto 建置完整映像檔](./yocto-image.mdx) |
| 建置更新套件 | 尚未提供文件 | [建置與套用更新套件](../deployment/update-package.mdx) |
| 安全開機與佈建 | 尚未提供文件 | 尚未提供文件 |

如果您現在就需要從原始碼建置完整映像檔，請選擇 Yocto；否則請使用 eLxr。

## BSP 原始碼的用途

在以下情況中，這些原始碼特別有用：

- **新增自訂周邊裝置**：為新的 MIPI 相機、GMSL2 感測器或 HAT 擴充板撰寫 device tree overlay。
- **啟用核心功能**：開啟標準映像檔中未包含的核心選項（例如檔案系統、網路通訊協定或 USB gadget 驅動程式）。
- **取代或擴充 rootfs**：將您自己的應用程式、函式庫或系統服務內建到映像檔中。
- **在本機重現某個版本**：重新建置 DevKit 出貨時所搭載的完全相同映像檔，以便稽核或修改。

若要將自訂建置安裝到您的電路板上，請參閱[部署您的建置](./build-from-source.mdx#deploy-your-build)。[韌體更新](/hardware/getting-started/firmware-update)安裝的是 SiMa.ai 的標準映像檔，而不是您自己的建置。

## 原始碼與手冊

以下所有內容皆為公開資源。建置映像檔、燒錄電路板以及新增您自己的驅動程式，都不需要簽署 NDA 或洽詢業務。

| 內容 | 位置 |
| --- | --- |
| 建置步驟：建置環境、核心與 U-Boot 建置、device tree、核心模組 | [從原始碼建置 BSP](./build-from-source.mdx) |
| 各平台版本對應的原始碼 commit | [版本相容性](./release-compatibility.mdx) |
| Modalix 建置容器 | [Dockerfile.modalix](./build-from-source.mdx#set-up-the-build-container) |
| Linux 核心原始碼 | [simaai-linux](https://github.com/SiMa-ai/simaai-linux) |
| U-Boot 原始碼 | [sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot) |
| Yocto layer，包含各電路板專用的 overlay 原始檔 | [meta-simaai](https://github.com/SiMa-ai/meta-simaai) |

## 本節內容

- [從原始碼建置 BSP](./build-from-source.mdx)：建置環境、核心、U-Boot、device tree，以及安裝建置成品。
- [Device Tree 與 Overlay](./device-tree.mdx)：選擇或撰寫 overlay，並確認驅動程式已繫結。
- [版本相容性](./release-compatibility.mdx)：每個平台版本所對應的核心與 U-Boot commit。
- [使用 Yocto 建置完整映像檔](./yocto-image.mdx)：使用公開的 Yocto layer 從原始碼建置整個映像檔。
- [將映像檔燒錄到 eMMC](../deployment/flash-image.mdx)：將您自行建置的映像檔寫入電路板的 eMMC。
- [建置與套用更新套件](../deployment/update-package.mdx)：為 Yocto 映像檔封裝更新，以及電路板的回復方式。
- [工廠組裝與測試](../deployment/factory-build-and-test.mdx)：在量產環境中燒錄與測試電路板。

與 BSP 工作相關的硬體主題，請參閱[載板硬體啟動](../design/som-carrier.mdx)與[低速 I/O](../interfaces/low-speed-io.mdx)。

請從[從原始碼建置 BSP](./build-from-source.mdx) 開始：該頁面涵蓋 Docker 建置環境、取得與設定核心和 U-Boot、建置兩者、將結果安裝到電路板上，以及使用 device tree、overlay 與樹外（out-of-tree）核心模組。

---
title: "開始使用"
description: "從這裡開始啟動 Modalix DevKit，選擇獨立模式或 PCIe 模式，並更新韌體。"
sidebar_position: 1
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# 開始使用

當您首次啟動 Modalix DevKit 或準備現有的 DevKit 進行開發時，請從這裡開始。

<div class="overview-link-columns">
  <section class="overview-link-panel overview-link-panel-start">
    <h2>首次設定</h2>
    <p>從包裝盒中取出 DevKit，連接所需的電纜，並確保在啟動和恢復過程中可以存取序列埠。</p>
    <ul class="overview-link-list">
      <li><a class="overview-link-card" href={useBaseUrl('/tools/qsg/index.html')}><strong>DevKit 3.0 快速入門指南</strong><span>按照互動式的首次啟動硬體逐步說明進行操作。</span></a></li>
      <li><a class="overview-link-card" href="/zh-Hant/hardware/getting-started/setup-serial"><strong>設定序列埠連線</strong><span>從 Windows、macOS、Linux 或瀏覽器連接到 DevKit 主控台。</span></a></li>
    </ul>
  </section>

  <section class="overview-link-panel overview-link-panel-mode">
    <h2>選擇您的模式</h2>
    <p>選擇與您在開發期間使用硬體方式相符的設定路徑。</p>
    <ul class="overview-link-list">
      <li><a class="overview-link-card" href="/zh-Hant/hardware/getting-started/standalone-mode"><strong>獨立模式</strong><span>將 DevKit 作為一個獨立的邊緣裝置運行。</span></a></li>
      <li><a class="overview-link-card" href="/zh-Hant/hardware/getting-started/pcie-mode"><strong>PCIe 模式</strong><span>將 Modalix PCIe 卡安裝到主機中，以進行卸載推理。</span></a></li>
    </ul>
  </section>

  <section class="overview-link-panel overview-link-panel-recovery">
    <h2>韌體和恢復</h2>
    <p>更新正在運行的裝置、恢復無法啟動的系統，或重新刷寫特定版本的韌體。</p>
    <ul class="overview-link-list">
      <li><a class="overview-link-card" href="/zh-Hant/hardware/getting-started/firmware-update"><strong>韌體更新</strong><span>選擇 sima-cli 更新、啟動映像恢復和網路啟動工作流程。</span></a></li>
    </ul>
  </section>
</div>

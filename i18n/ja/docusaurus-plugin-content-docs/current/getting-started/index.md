---
title: "はじめに"
description: "Modalix DevKit のセットアップはここから開始します。スタンドアロンモードまたは PCIe モードを選択し、ファームウェアを更新してください。"
sidebar_position: 1
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# はじめに

Modalix DevKitを初めてセットアップする場合、または既存のDevKitを開発用に準備する場合は、ここから開始してください。

<div class="overview-link-columns">
  <section class="overview-link-panel overview-link-panel-start">
    <h2>初回セットアップ</h2>
    <p>DevKitの箱から取り出し、必要なケーブルを接続し、起動およびリカバリのためにシリアルアクセスを有効にしておきます。</p>
    <ul class="overview-link-list">
      <li><a class="overview-link-card" href={useBaseUrl('/tools/qsg/index.html')}><strong>DevKit 3.0クイックスタートガイド</strong><span>インタラクティブな初回起動時のハードウェアウォークスルーに従ってください。</span></a></li>
      <li><a class="overview-link-card" href="/ja/hardware/getting-started/setup-serial"><strong>シリアル接続の設定</strong><span>DevKitコンソールに、Windows、macOS、Linux、またはブラウザから接続します。</span></a></li>
    </ul>
  </section>

  <section class="overview-link-panel overview-link-panel-mode">
    <h2>モードの選択</h2>
    <p>開発中にハードウェアを使用する方法に応じて、適切なセットアップパスを選択します。</p>
    <ul class="overview-link-list">
      <li><a class="overview-link-card" href="/ja/hardware/getting-started/standalone-mode"><strong>スタンドアロンモード</strong><span>DevKitを、独立したエッジデバイスとして実行します。</span></a></li>
      <li><a class="overview-link-card" href="/ja/hardware/getting-started/pcie-mode"><strong>PCIeモード</strong><span>Modalix PCIeカードをホストマシンにインストールし、オフロード推論を実行します。</span></a></li>
    </ul>
  </section>

  <section class="overview-link-panel overview-link-panel-recovery">
    <h2>ファームウェアとリカバリ</h2>
    <p>動作中のデバイスの更新、起動しないシステムのリカバリ、または特定のリリースへのファームウェアの再書き込みを行います。</p>
    <ul class="overview-link-list">
      <li><a class="overview-link-card" href="/ja/hardware/getting-started/firmware-update"><strong>ファームウェアの更新</strong><span>sima-cliによる更新、ブートイメージのリカバリ、およびネットブートワークフローから選択します。</span></a></li>
    </ul>
  </section>
</div>

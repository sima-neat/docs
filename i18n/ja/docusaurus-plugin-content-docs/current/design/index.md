---
title: ハードウェアを設計する
description: SoM キャリアボードとチップダウン設計のどちらかを選び、それぞれに必要な資料を確認します。
sidebar_position: 1
---

# ハードウェアを設計する

MLSoC Modalix を中心に製品を構築する方法は 2 つあります。必要な資料と立ち上げ作業が異なるため、
着手する前にどちらかを選択してください。

| | SoM キャリアボード | チップダウン |
| --- | --- | --- |
| 設計対象 | Modalix SoM 用のキャリアボード。SoM には SoC、LPDDR5、電源がすでに搭載されています | パッケージ化された Modalix SoC を搭載するボード。メモリ、電源、クロックも含みます |
| 主な設計作業 | コネクターのマッピング、電源供給、インターフェース、熱設計 | 左記のすべてに加え、DDR の配線とチューニング、高速信号のレイアウト |
| 資料 | 公開されているデータシートと立ち上げガイド | SoC データシートと設計パッケージ（SiMa.ai にご依頼いただければ提供します） |
| ソフトウェアの出発点 | Modalix BSP と、キャリアボードに合わせたデバイスツリーの変更 | Modalix BSP と、ボードレベルの適合作業 |

チップダウン設計は、チップ・オン・ボード設計とも呼ばれます。

## SoM キャリアボード {#som-carrier-board}

1. [参考文献](../reference/extra-docs.md)にある **Modalix SoM Carrier Board Hardware Reference** と **Modalix SoM
   Datasheet** を読みます。
2. [キャリアボードの立ち上げ](./som-carrier.mdx)を参考に、コネクターのマッピング、電源、インターフェースを計画します。
   このページでは、コネクターのインターフェース、リファレンスキャリアボードからの変更点、カメラのオーバーレイについて説明しています。
3. [低速 I/O](../interfaces/low-speed-io.mdx) で低速ピンの割り当てを確認します。
4. ボードが完成したら、**Carrier Board SoM Bring-Up Guide** に従って最初の電源投入を行い、
   [BSP をソースからビルドする](../software/build-from-source.mdx)を参考にデバイスツリーを適合させます。

## チップダウン {#chip-down}

1. **Modalix SoC Datasheet**、**PCB Routing Guidelines**、**DDR Tuning
   Guide**、およびリファレンス設計パッケージを SiMa.ai の担当者に依頼します。各資料の内容については、
   [参考文献](../reference/extra-docs.md)を参照してください。
2. **Modalix SoM Thermal Design Guide** を使用して冷却を計画します。
3. [eLxr のビルドとカスタマイズ](../software/index.md)を参考に、ソフトウェアをビルドして適合させます。

メモリの初期化や最初のブートを含むチップダウンの立ち上げ手順は、まだ一般公開されていません。
SiMa.ai の担当者にお問い合わせください。

## 次のステップ

- [インターフェースと周辺機器](../interfaces/low-speed-io.mdx)：ピンマッピングと
  周辺機器のセットアップ。
- [ビルドをデプロイする](../software/build-from-source.mdx#deploy-your-build)：独自の
  ビルドをボードに導入する方法。
- [工場でのビルドとテスト](../deployment/factory-build-and-test.mdx)：量産時の
  ボードへの書き込みとテスト。

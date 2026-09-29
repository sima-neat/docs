---
title: ボードサポートパッケージ
description: SiMa.ai ボードを電源投入から利用可能な Linux ユーザー空間まで立ち上げる低レベルのソフトウェアスタック。
sidebar_position: 1
---

# ボードサポートパッケージ

ボードサポートパッケージ（BSP）は、SiMa.ai ボードを電源投入から利用可能な Linux ユーザー空間まで立ち上げる低レベルのソフトウェアです。認識パイプライン、ROS 2 ノード、カスタム C/C++ アプリケーションなどの上位レベルのワークロードは、その上で動作します。

SiMa.ai の BSP には次のものが含まれます。

- **ブートローダー**（U-Boot）：DRAM を初期化し、ブートメディアを読み取り、カーネルを読み込みます。
- **カーネル**：SoC 上の MLA、CVU、ISP、PCIe、ネットワーク、ストレージの各 IP に対応する SiMa.ai ドライバーを含む Linux カーネル。
- **デバイスツリー**：ボード固有の周辺機器（MIPI カメラ、GMSL2 デシリアライザー、GPIO ヘッダー、M.2 スロット）を記述し、カーネルが起動時にそれらをプローブできるようにします。
- **ルートファイルシステム**：ユーザー空間のツール、システムサービス、およびオンチップアクセラレーターと通信する SiMa.ai ランタイムライブラリ。
- **ファームウェアバイナリ**：セキュリティプロセッサー（tRoot）やその他のコプロセッサー用。

## Modalix BSP

Modalix BSP は、Modalix DevKit、Modalix Early Access キット、および Modalix PCIe カードを対象としています。Debian 派生のディストリビューションである [eLxr](https://elxr.org/) をベースに構築されています。ユーザー空間は `apt` で管理されるため、Modalix イメージのカスタマイズは、Yocto レシピの作成よりも Debian ソフトウェアのパッケージングに近い作業になります。既存の Yocto DevKit を eLxr に変換するには、[eLxr への変換](../reference/tech-notes/elxr-conversion.mdx)を参照してください。

ソース：[simaai-linux](https://github.com/SiMa-ai/simaai-linux)（カーネルとデバイスツリー）および [sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot)（U-Boot）。

## BSP ソースでできること

ソースは、次のような場合に役立ちます。

- **カスタム周辺機器を追加する**：新しい MIPI カメラ、GMSL2 センサー、または HAT ボード用のデバイスツリーオーバーレイを作成します。
- **カーネル機能を有効にする**：標準イメージに含まれていないカーネルオプション（ファイルシステム、ネットワークプロトコル、USB ガジェットドライバーなど）を有効にします。
- **rootfs を置き換える、または拡張する**：独自のアプリケーション、ライブラリ、またはシステムサービスを組み込みます。
- **リリースをローカルで再現する**：監査や改変のために、DevKit に搭載されているものとまったく同じイメージを再ビルドします。

カスタムビルドをボードに導入するには、[ビルドをデプロイする](./build-from-source.mdx#deploy-your-build)を参照してください。[ファームウェアアップデート](/hardware/getting-started/firmware-update)でインストールされるのは SiMa.ai の標準イメージであり、独自のビルドではありません。

## ソースとマニュアル

以下はすべて公開されています。イメージのビルド、ボードへの書き込み、独自ドライバーの追加に、
NDA や営業窓口への問い合わせは必要ありません。

| 内容 | 場所 |
| --- | --- |
| ビルド手順：ビルド環境、カーネルと U-Boot のビルド、デバイスツリー、カーネルモジュール | [BSP をソースからビルドする](./build-from-source.mdx) |
| 各プラットフォームリリースに対応するソースコミット | [リリースの互換性](./release-compatibility.mdx) |
| Modalix ビルドコンテナー | [Dockerfile.modalix](./build-from-source.mdx#set-up-the-build-container) |
| Linux カーネルソース | [simaai-linux](https://github.com/SiMa-ai/simaai-linux) |
| U-Boot ソース | [sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot) |

## このセクションの内容

- [BSP をソースからビルドする](./build-from-source.mdx)：ビルド環境、
  カーネル、U-Boot、デバイスツリー、および成果物のインストール。
- [リリースの互換性](./release-compatibility.mdx)：各プラットフォームリリースの基になっている
  カーネルと U-Boot のコミット。
- [キャリアボードの立ち上げ](../design/som-carrier.mdx)：サードパーティ製キャリアボード上での
  Modalix SoM の動作と、ソフトウェアの適合が必要な箇所。
- [低速 I/O](../interfaces/low-speed-io.mdx)：SIO ブロック上の GPIO、UART、I2C、SPI と、
  64 ピンすべてのマッピング。

まずは [BSP をソースからビルドする](./build-from-source.mdx)から始めてください。Docker ビルド環境、
カーネルと U-Boot の取得と構成、両者のビルド、ボードへのインストール、そしてデバイスツリー、
オーバーレイ、ツリー外カーネルモジュールの扱い方を説明しています。

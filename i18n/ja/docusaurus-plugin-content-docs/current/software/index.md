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

Modalix BSP は、Modalix DevKit、Modalix Early Access キット、および Modalix PCIe カードを対象としています。Debian 派生のディストリビューションである [eLxr](https://elxr.org/) をベースに構築されています。ユーザー空間は `apt` で管理されるため、Modalix イメージのカスタマイズは、Yocto レシピの作成よりも Debian ソフトウェアのパッケージングに近い作業になります。既存の Yocto DevKit を eLxr に変換するには、[eLxr に変換](../reference/tech-notes/elxr-conversion.mdx)を参照してください。

ソース：[simaai-linux](https://github.com/SiMa-ai/simaai-linux)（カーネルとデバイスツリー）、[sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot)（U-Boot）、および [meta-simaai](https://github.com/SiMa-ai/meta-simaai)（Yocto レイヤー）。

## eLxr と Yocto {#elxr-or-yocto}

ボードの立ち上げには eLxr を推奨します。meta-simaai レイヤーとその[イメージビルドマニュアル](https://github.com/SiMa-ai/meta-simaai/blob/master/documentation/build-manual.rst)を使用して、Yocto でボードを立ち上げることもできます。どちらも同じカーネルと U-Boot のソースを同じカーネル構成でビルドするため、ドライバーやデバイスツリーの作業はそのまま引き継げます。

| 作業 | eLxr（推奨） | Yocto |
| --- | --- | --- |
| カーネル、U-Boot、デバイスツリー、オーバーレイ、カーネルモジュールのビルド | [BSP をソースからビルドする](./build-from-source.mdx) | [イメージビルドマニュアル](https://github.com/SiMa-ai/meta-simaai/blob/master/documentation/build-manual.rst) |
| ユーザー空間ソフトウェアの追加 | [eLxr にパッケージとサービスを追加する](./elxr-packages.mdx) | レシピを作成 |
| ソースから完全なイメージをビルド | まだ文書化されていません | [Yocto で完全なイメージをビルドする](./yocto-image.mdx) |
| アップデートパッケージのビルド | まだ文書化されていません | [アップデートパッケージのビルドと適用](../deployment/update-package.mdx) |
| セキュアブートとプロビジョニング | まだ文書化されていません | まだ文書化されていません |

SiMa.ai は Yocto リリースを積極的にはテストしていないため、新しいビルドには Yocto のリリース済みサポートがありません。eLxr を使用してください。Yocto は、現時点でソースから完全なイメージをビルドする必要がある場合にのみ選択し、そのイメージを自分のボードでテストしてください。

## BSP ソースでできること

ソースは、次のような場合に役立ちます。

- **カスタム周辺機器を追加する**：新しい MIPI カメラ、GMSL2 センサー、または HAT ボード用のデバイスツリーオーバーレイを作成します。
- **カーネル機能を有効にする**：標準イメージに含まれていないカーネルオプション（ファイルシステム、ネットワークプロトコル、USB ガジェットドライバーなど）を有効にします。
- **rootfs を置き換える、または拡張する**：独自のアプリケーション、ライブラリ、またはシステムサービスを組み込みます。
- **リリースをローカルで再現する**：監査や改変のために、DevKit に搭載されているものとまったく同じイメージを再ビルドします。

カスタムビルドをボードに導入するには、[ビルドをデプロイする](./build-from-source.mdx#deploy-your-build)を参照してください。[ファームウェアのアップデート](/hardware/getting-started/firmware-update)でインストールされるのは SiMa.ai の標準イメージであり、独自のビルドではありません。

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
| Yocto レイヤー（ボード固有のオーバーレイソースを含む） | [meta-simaai](https://github.com/SiMa-ai/meta-simaai) |

## このセクションの内容

- [BSP をソースからビルドする](./build-from-source.mdx)：ビルド環境、
  カーネル、U-Boot、デバイスツリー、およびアーティファクトのインストール。
- [デバイスツリーとオーバーレイ](./device-tree.mdx)：オーバーレイの選択または作成と、
  ドライバーのバインドの確認。
- [リリースの互換性](./release-compatibility.mdx)：各プラットフォームリリースの基になっている
  カーネルと U-Boot のコミット。
- [eLxr にパッケージとサービスを追加する](./elxr-packages.mdx)：パッケージのインストール、独自のサービスの
  パッケージ化、アップデートが変更に与える影響。
- [Yocto で完全なイメージをビルドする](./yocto-image.mdx)：公開されている Yocto レイヤーによる、
  ソースからのイメージ全体のビルド。
- [イメージを eMMC に書き込む](../deployment/flash-image.mdx)：独自ビルドの
  ボード eMMC への書き込み。
- [アップデートパッケージのビルドと適用](../deployment/update-package.mdx)：Yocto イメージ用の
  アップデートのパッケージ化と、ボードのフォールバックの仕組み。
- [工場でのビルドとテスト](../deployment/factory-build-and-test.mdx)：量産時の
  ボードへの書き込みとテスト。

BSP の作業に関係するハードウェアのトピックについては、
[キャリアボードの立ち上げ](../design/som-carrier.mdx)と
[低速 I/O](../interfaces/low-speed-io.mdx) を参照してください。

まずは [BSP をソースからビルドする](./build-from-source.mdx)から始めてください。Docker ビルド環境、
カーネルと U-Boot の取得と構成、両者のビルド、ボードへのインストール、そしてデバイスツリー、
オーバーレイ、ツリー外カーネルモジュールの扱い方を説明しています。

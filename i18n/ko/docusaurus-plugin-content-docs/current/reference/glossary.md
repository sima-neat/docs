---
title: "용어 해설"
description: "SiMa.ai 하드웨어 설명서 전체에서 사용되는 일반적인 약어 및 용어입니다."
sidebar_position: 3
---

# 용어 해설

이 문서 전체에서 사용되는 일반적인 약어 및 용어입니다. 항목은 주제별로 그룹화되어 있으며, 각 그룹 내에서는 알파벳순으로 정렬되어 있습니다.

## 실리콘 및 컴퓨팅

**CVU**
: **컴퓨터 비전 유닛.** 클래식 비전 워크로드(필터, 변환, 이미지 처리 커널)에 전용된 칩 내 가속기입니다. MLSoC Modalix는 750 16비트 GOPS로 작동하는 Synopsys EV74 CVU를 통합합니다.

**ISP**
: **이미지 신호 프로세서.** 카메라 센서의 원시 출력을 사용 가능한 이미지(바이어 패턴, 모노 등)로 변환하는 칩 내 블록입니다. MLSoC Modalix는 1.2GHz로 작동하는 ARM C-71 ISP를 사용합니다.

**MLA**
: **머신 러닝 가속기.** 신경망 추론을 실행하는 칩 내 블록입니다. MLA는 MLSoC Modalix의 주요 차별점이며, NEAT 애플리케이션의 대상입니다.

**MLSoC**
: **머신 러닝 시스템 온 칩.** SiMa.ai의 엣지 AI 프로세서 제품군입니다. 이 설명서는 2세대인 **MLSoC Modalix**를 다룹니다.

**Modalix**
: SiMa.ai의 2세대 MLSoC 제품명이며, 여기에 설명된 모든 키트의 핵심 실리콘입니다.

**NoC**
: **칩 내 네트워크.** MLA, CVU, ISP, 애플리케이션 코어, 메모리 컨트롤러 및 I/O 블록을 연결하는 칩 내 인터커넥트입니다. Modalix NoC에는 성능 모니터링, 방화벽 및 QoS 제어가 포함됩니다.

**tRoot**
: MLSoC의 보안 부팅, 키 저장 및 펌웨어 인증을 처리하는 하드웨어 루트-오브-트러스트 서브시스템입니다.

## 시스템 소프트웨어

**BSP**
: **보드 지원 패키지.** 부트로더, 커널, 디바이스 트리, 드라이버 및 루트 파일 시스템과 같은 저수준 소프트웨어의 모음으로, SiMa.ai 보드를 전원 켜기부터 사용 가능한 Linux 사용자 공간으로 부팅합니다. [보드 지원 패키지](./bsp)를 참조하십시오.

**eLxr**
: [Debian 기반의 Linux 배포판](https://elxr.org/)으로, 2025년 12월 중순 이후에 출시되는 Modalix DevKit의 기본 런타임으로 사용됩니다. 사용자 공간은 `apt`를 사용하여 관리됩니다.

**sima-cli**
: 펌웨어를 플래싱하고, 드라이버를 설치하고, 네트워크 또는 PCIe를 통해 SiMa.ai 장치를 관리하는 데 사용되는 호스트 측 명령줄 도구입니다.

**U-Boot**
: SiMa.ai DevKit에 사용되는 부트로더입니다. DRAM 초기화, 부팅 미디어 읽기 및 Linux 커널 로딩을 담당합니다.

**Yocto**
: 레거시 MLSoC BSP에 사용되는 임베디드 Linux 빌드 시스템(poky 기반)입니다. Modalix DevKit는 원래 Yocto 이미지와 함께 제공되었으며, eLxr로 변환할 수 있습니다. [eLxr로 변환](./tech-notes/elxr-conversion)를 참조하십시오.

## 애플리케이션 및 프레임워크

**NEAT**
: SiMa.ai의 MLSoC Modalix용 애플리케이션 프레임워크입니다. NEAT는 이전 버전의 Palette/MPK 도구 세트를 대체합니다. 전체 설명서는 [ 소프트웨어 문서](https://developer.sima.ai/software)에서 확인할 수 있습니다.

**NEAT 애플리케이션**
: NEAT 도구 세트를 통해 생성된 패키지 형태의 온디바이스 추론 파이프라인(모델 + 사전/사후 처리 그래프 + 런타임 메타데이터)으로, MLSoC Modalix에 로드되어 실행됩니다.

## 하드웨어 및 폼 팩터

**DevKit**
: 미리 조립된 SiMa.ai 개발 키트로, Modalix DevKit 또는 Modalix 얼리 액세스 DevKit와 같은 제품이 있으며, 이는 맞춤형 캐리어 보드를 설계하기 전에 실리콘을 평가하고 애플리케이션을 개발하는 데 사용됩니다.

**eMMC**
: **Embedded MultiMediaCard.** DevKit에 납땜된 온보드 플래시 스토리지입니다. 부트 이미지와 루트 파일 시스템을 저장하는 데 사용됩니다.

**HHHL**
: **Half-Height, Half-Length.** 대부분의 서버 및 워크스테이션 섀시와 호환되는 PCIe 카드 폼 팩터입니다. Modalix PCIe 카드는 HHHL 카드입니다.

**LPDDR5**
: **Low-Power Double Data Rate 5** 메모리입니다. Modalix 제품에 사용되는 시스템 RAM입니다. MLSoC Modalix는 8개 채널에서 32비트 및 64비트 LPDDR5 구성을 지원합니다.

**SoC**
: **System on Chip.** 멀티칩 모듈과 달리 CPU, 가속기, 메모리 컨트롤러 및 I/O를 통합한 단일 다이입니다.

**SoM**
: **System on Module.** SoC와 해당 RAM, 스토리지 및 전원 회로를 커넥터에 연결하여 맞춤형 캐리어 보드에 통합할 수 있도록 하는 모듈입니다. Modalix DevKit는 Modalix SoM을 기반으로 제작되었습니다.

## 인터페이스

**GMSL2**
: **기가비트 멀티미디어 직렬 링크, 버전 2.** 카메라 및 센서 데이터를 동축 케이블(FAKRA)을 통해 전송하기 위한 자동차 등급의 직렬 프로토콜입니다. Modalix PCIe 카드에서 지원됩니다.

**MIPI CSI**
: **모바일 산업 프로세서 인터페이스 — 카메라 직렬 인터페이스.** 이미지 센서를 SoC에 연결하기 위한 표준 고속 직렬 인터페이스입니다.

## 배포

**PCIe 모드**
: Modalix PCIe 카드를 호스트 장치에 연결하여 배포하는 아키텍처입니다. 호스트 장치는 I/O 및 오케스트레이션을 처리하고, 카드는 추론을 처리합니다. [PCIe 모드](/hardware/getting-started/pcie-mode)를 참조하십시오.

**독립 실행 모드**
: Modalix DevKit 또는 Modalix SoM 기반 시스템이 독립적인 장치로 실행되어 센서 데이터를 로컬에서 처리하고 결과를 네트워크를 통해 전송하는 배포 아키텍처입니다. [독립 실행 모드](/hardware/getting-started/standalone-mode)를 참조하십시오.

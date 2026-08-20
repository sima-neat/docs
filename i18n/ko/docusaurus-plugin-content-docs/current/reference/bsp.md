---
title: "보드 지원 패키지"
description: "SiMa.ai 보드를 부팅하여 사용 가능한 Linux 사용자 환경으로 만드는 하위 레벨 소프트웨어 스택입니다."
sidebar_position: 1
---

# 보드 지원 패키지

보드 지원 패키지(BSP)는 전원 켜기부터 사용 가능한 Linux 사용자 공간까지 SiMa.ai 보드를 작동시키는 데 필요한 저수준 소프트웨어 모음입니다. 이는 모든 상위 수준 작업(인지 파이프라인, ROS 2 노드, 사용자 지정 C/C++ 애플리케이션 등)이 실행되는 기반입니다.

SiMa.ai BSP에는 다음이 포함됩니다.

- **부트 로더** (U-Boot) — DRAM을 초기화하고, 부팅 미디어를 읽고, 커널을 로드합니다.
- **커널** — SoC의 MLA, CVU, ISP, PCIe, 네트워킹 및 스토리지 IP를 위한 SiMa.ai 드라이버가 포함된 Linux 커널입니다.
- **디바이스 트리** — 보드별 주변 장치를 설명합니다.MIPI 카메라, GMSL2 디세리얼라이저, GPIO 헤더, M.2 슬롯 등을 부팅 시 커널에서 감지할 수 있도록 합니다.
- **루트 파일 시스템** — 사용자 공간 도구, 시스템 서비스, 그리고 온칩 가속기와 통신하는 SiMa.ai 런타임 라이브러리.
- **펌웨어 블롭** — 보안 프로세서(tRoot) 및 기타 보조 프로세서용.

## Modalix BSP

Modalix BSP는 Modalix DevKit, Modalix 얼리 액세스 키트, 그리고 Modalix PCIe 카드를 대상으로 합니다. 이 BSP는 Debian 기반 배포판인 [eLxr](https://elxr.org/)를 기반으로 구축되었습니다. 사용자 공간은 `apt`를 사용하여 관리되므로, Modalix 이미지를 사용자 정의하는 것은 Yocto 레시피를 작성하는 것보다 Debian 소프트웨어를 패키징하는 것에 더 가깝습니다. 기존 Yocto DevKit를 eLxr로 변환하려는 사용자는 [eLxr로 변환합니다.](./tech-notes/elxr-conversion)를 참조하십시오.

소스 레이어: [swsoc-simaai-elxr-doc](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

## BSP 소스 코드를 활용하여 할 수 있는 작업은 무엇인가요?

위에 제시된 저장소는 다음과 같은 경우에 유용합니다.

- **사용자 지정 주변 장치 추가** — 새로운 MIPI 카메라, GMSL2 센서 또는 HAT 보드를 위한 장치 트리 오버레이를 작성합니다.
- **커널 기능 활성화** — 기본 이미지에 포함되지 않은 커널 옵션(예: 파일 시스템, 네트워크 프로토콜 또는 USB 장치 드라이버)을 활성화합니다.
- **루트 파일 시스템을 교체하거나 확장**하세요. 자체 애플리케이션, 라이브러리 또는 시스템 서비스를 통합할 수 있습니다.
- **로컬에서 릴리스 버전을 재현** — 감사 또는 수정 목적으로 DevKit에 포함된 것과 동일한 이미지를 다시 빌드합니다.

사용자 지정 이미지를 생성한 후에는 [펌웨어 업데이트](/hardware/getting-started/firmware-update/)에 설명된 방법 중 하나를 사용하여 DevKit에 해당 이미지를 업로드합니다.

## 저장소

- [Modalix (eLxr)](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

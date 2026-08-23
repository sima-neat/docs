---
title: "보드 지원 패키지"
description: "SiMa.ai 보드가 전원을 켜는 시점부터 사용 가능한 Linux 사용자 공간에 도달할 때까지 작동하는 하위 수준의 소프트웨어 스택입니다."
sidebar_position: 1
---

# 보드 지원 패키지

보드 지원 패키지(BSP)는 SiMa.ai 보드가 전원이 켜진 상태에서 사용 가능한 Linux 사용자 공간으로 작동하도록 하는 하위 수준 소프트웨어입니다. 인식 파이프라인, ROS 2 노드, 사용자 지정 C/C++ 애플리케이션을 포함한 상위 수준의 작업 부하가 이 위에 실행됩니다.

SiMa.ai BSP에는 다음이 포함됩니다.

- **부트 로더**(U-Boot) — DRAM을 초기화하고, 부팅 미디어를 읽고, 커널을 로드합니다.
- **커널** — SoC에 있는 MLA, CVU, ISP, PCIe, 네트워킹 및 스토리지 IP를 위한 SiMa.ai 드라이버가 포함된 Linux 커널입니다.
- **디바이스 트리**는 보드별 주변 장치(예: MIPI 카메라, GMSL2 디세리얼라이저, GPIO 헤더, M.2 슬롯)를 설명하여 커널이 부팅 시 해당 장치를 감지할 수 있도록 합니다.
- **루트 파일 시스템** — 사용자 공간 도구, 시스템 서비스, 그리고 온칩 가속기와 통신하는 SiMa.ai 런타임 라이브러리.
- **펌웨어 블롭** — 보안 프로세서(tRoot) 및 기타 보조 프로세서용.

## Modalix BSP

Modalix BSP는 Modalix DevKit, Modalix Early Access 키트 및 Modalix PCIe 카드를 대상으로 합니다. 이 BSP는 Debian 기반 배포판인 [eLxr](https://elxr.org/)를 기반으로 빌드됩니다. 사용자 공간은 `apt`로 관리되므로 Modalix 이미지를 사용자 지정하는 작업은 Yocto 레시피를 작성하는 것보다 Debian 소프트웨어를 패키징하는 방식에 더 가깝습니다. 기존 Yocto DevKit을 eLxr로 변환하려면 [eLxr로 변환](./tech-notes/elxr-conversion)을 참조하세요.

소스 레이어: [swsoc-simaai-elxr-doc](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

## BSP 소스 코드를 활용하여 할 수 있는 작업은 무엇인가요?

위에 제시된 저장소는 다음과 같은 경우에 유용합니다.

- **사용자 지정 주변 장치 추가** — 새로운 MIPI 카메라, GMSL2 센서 또는 HAT 보드를 위한 장치 트리 오버레이를 작성합니다.
- **커널 기능 활성화** — 기본 이미지에 포함되지 않은 커널 옵션(예: 파일 시스템, 네트워크 프로토콜 또는 USB 장치 드라이버)을 활성화합니다.
- **루트 파일 시스템을 교체하거나 확장하세요.** — 사용자 지정 애플리케이션, 라이브러리 또는 시스템 서비스를 추가하여 사용하세요.
- **로컬에서 릴리스 버전을 재현** — 감사 또는 수정 목적으로 DevKit에 포함된 것과 동일한 이미지를 다시 빌드합니다.

사용자 지정 이미지를 생성한 후에는 [ 펌웨어 업데이트 ](/ko/hardware/getting-started/firmware-update)에 설명된 방법 중 하나를 사용하여 DevKit에 이미지를 업로드합니다.

## 저장소

- [Modalix (eLxr)](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

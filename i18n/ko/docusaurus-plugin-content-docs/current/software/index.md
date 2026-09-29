---
title: 보드 지원 패키지
description: SiMa.ai 보드를 전원 투입부터 사용 가능한 Linux 사용자 공간까지 구동하는 저수준 소프트웨어 스택입니다.
sidebar_position: 1
---

# 보드 지원 패키지

보드 지원 패키지(BSP)는 SiMa.ai 보드를 전원 투입부터 사용 가능한 Linux 사용자 공간까지 구동하는 저수준 소프트웨어입니다. 인식 파이프라인, ROS 2 노드, 사용자 지정 C/C++ 애플리케이션 등 상위 수준 워크로드는 모두 BSP 위에서 실행됩니다.

SiMa.ai BSP는 다음으로 구성됩니다.

- **부트로더**(U-Boot) — DRAM을 초기화하고, 부트 미디어를 읽고, 커널을 로드합니다.
- **커널** — SoC의 MLA, CVU, ISP, PCIe, 네트워킹 및 스토리지 IP용 SiMa.ai 드라이버를 포함한 Linux 커널입니다.
- **디바이스 트리** — 커널이 부팅 시 탐지할 수 있도록 보드별 주변 장치(MIPI 카메라, GMSL2 디시리얼라이저, GPIO 헤더, M.2 슬롯)를 기술합니다.
- **루트 파일 시스템** — 사용자 공간 도구, 시스템 서비스, 그리고 온칩 가속기와 통신하는 SiMa.ai 런타임 라이브러리입니다.
- **펌웨어 바이너리** — 보안 프로세서(tRoot) 및 기타 코프로세서용 펌웨어입니다.

## Modalix BSP

Modalix BSP는 Modalix DevKit, Modalix Early Access 키트 및 Modalix PCIe 카드를 대상으로 합니다. 이 BSP는 Debian에서 파생된 배포판인 [eLxr](https://elxr.org/)을 기반으로 합니다. 사용자 공간은 `apt`로 관리되므로, Modalix 이미지를 사용자 지정하는 작업은 Yocto 레시피 작성보다는 Debian 소프트웨어 패키징에 가깝습니다. 기존 Yocto DevKit을 eLxr로 변환하려면 [eLxr로 변환](../reference/tech-notes/elxr-conversion.mdx)을 참조하십시오.

소스: [simaai-linux](https://github.com/SiMa-ai/simaai-linux)(커널 및 디바이스 트리), [sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot)(U-Boot).

## BSP 소스로 할 수 있는 작업

BSP 소스는 다음과 같은 경우에 유용합니다.

- **사용자 지정 주변 장치 추가** — 새 MIPI 카메라, GMSL2 센서 또는 HAT 보드용 디바이스 트리 오버레이를 작성합니다.
- **커널 기능 활성화** — 기본 이미지에 포함되지 않은 커널 옵션(예: 파일 시스템, 네트워크 프로토콜, USB 가젯 드라이버)을 켭니다.
- **rootfs 교체 또는 확장** — 자체 애플리케이션, 라이브러리 또는 시스템 서비스를 이미지에 포함합니다.
- **릴리스를 로컬에서 재현** — 감사나 수정을 위해 DevKit에 탑재되어 출하되는 이미지를 그대로 다시 빌드합니다.

사용자 지정 빌드를 보드에 올리려면 [빌드 배포](./build-from-source.mdx#deploy-your-build)를 참조하십시오. [펌웨어 업데이트](/hardware/getting-started/firmware-update)는 사용자가 만든 빌드가 아니라 SiMa.ai 기본 이미지를 설치합니다.

## 소스 및 설명서

아래 항목은 모두 공개되어 있습니다. 이미지를 빌드하고, 보드를 플래싱하고, 자체
드라이버를 추가하는 데 NDA나 영업 문의가 필요하지 않습니다.

| 항목 | 위치 |
| --- | --- |
| 빌드 절차 — 빌드 환경, 커널 및 U-Boot 빌드, 디바이스 트리, 커널 모듈 | [소스에서 BSP 빌드](./build-from-source.mdx) |
| 각 플랫폼 릴리스에 해당하는 소스 커밋 | [릴리스 호환성](./release-compatibility.mdx) |
| Modalix 빌드 컨테이너 | [Dockerfile.modalix](./build-from-source.mdx#set-up-the-build-container) |
| Linux 커널 소스 | [simaai-linux](https://github.com/SiMa-ai/simaai-linux) |
| U-Boot 소스 | [sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot) |

## 이 섹션의 내용

- [소스에서 BSP 빌드](./build-from-source.mdx) — 빌드 환경, 커널, U-Boot,
  디바이스 트리 및 아티팩트 설치.
- [릴리스 호환성](./release-compatibility.mdx) — 각 플랫폼 릴리스의 기반이 되는
  커널 및 U-Boot 커밋.
- [캐리어 보드 브링업](../design/som-carrier.mdx) — 타사 캐리어 보드에서 Modalix SoM을
  실행하는 방법과 소프트웨어 적응이 필요한 부분.
- [저속 I/O](../interfaces/low-speed-io.mdx) — SIO 블록의 GPIO, UART, I2C 및 SPI와
  전체 64핀 매핑.

[소스에서 BSP 빌드](./build-from-source.mdx)부터 시작하십시오. 이 문서는 Docker 빌드
환경, 커널 및 U-Boot 소스 가져오기와 구성, 두 구성 요소의 빌드, 결과물의 보드 설치,
그리고 디바이스 트리, 오버레이 및 트리 외부(out-of-tree) 커널 모듈 작업을 다룹니다.

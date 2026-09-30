---
title: 칩다운 설계
description: Modalix SoC를 직접 실장한 보드를 설계하고, 칩다운 설계 가이드와 관련 자료를 확보합니다.
sidebar_position: 2
---

# 칩다운 설계

칩다운 설계에서는 패키지된 Modalix SoC를 자체 보드에 직접 실장합니다. 메모리, 전원,
클록을 포함하여 Modalix SoM이 제공하던 모든 부분을 직접 설계해야 합니다. 칩다운
설계는 칩온보드(chip-on-board) 설계라고도 합니다.

SoC, 메모리 및 전원부가 이미 탑재된 모듈을 기반으로 개발하려면
[캐리어 보드 설계](./carrier-board.md)를 참조하십시오.

## 설계 대상

- SoC의 전원 공급 및 전원 시퀀싱
- 클록 및 리셋
- 라우팅 및 튜닝을 포함한 LPDDR5 메모리
- 부트 스토리지, 그리고 디버깅 및 복구를 위한 시리얼 접근
- PCIe, MIPI CSI-2, Ethernet 등의 고속 인터페이스와 해당 레이아웃
- 냉각

## 칩다운 설계 가이드

SiMa.ai는 Modalix 칩다운 설계 가이드를 제공합니다. 이 가이드를 받으려면 SiMa.ai
담당자에게 문의하십시오.

## 관련 자료

다음 문서도 SiMa.ai 담당자를 통해 받을 수 있습니다. 각 문서에 대한 설명은
[참고 자료](../reference/extra-docs.md)를 참조하십시오.

| 문서 | 용도 |
| --- | --- |
| Modalix SoC 데이터시트 | 핀 기능, 전원 레일, 신호 타이밍 및 동작 한계 |
| Modalix PCB 배선 지침 | PCIe, MIPI CSI-2, Ethernet 및 기타 주요 신호선의 레이아웃 규칙 |
| Modalix DDR 튜닝 가이드 | LPDDR5 라우팅, 종단 및 캘리브레이션 |
| Modalix 얼리 액세스 DevKit 디자인 패키지 | 칩다운 레퍼런스 설계 |
| Modalix PCIe HHHL 디자인 패키지 | PCIe 카드용 칩다운 레퍼런스 설계 |
| Modalix SoM 열 설계 가이드 | 열 예산 및 냉각 설계 |

## 설계 단계

1. 칩다운 설계 가이드와 위의 관련 자료를 확보하십시오.
2. 설계 패키지를 레퍼런스 설계로 활용하여 보드를 설계하십시오.
3. 열 설계 가이드를 참고하여 냉각을 계획하십시오.
4. 보드를 브링업하십시오. 메모리 초기화와 최초 부팅을 포함한 칩다운 브링업 절차는
   아직 공개 문서로 제공되지 않습니다. 지원이 필요하면 SiMa.ai 담당자에게 문의하십시오.
5. [eLxr 빌드 및 사용자 지정](../software/index.md)을 참고하여 소프트웨어를 적응시키고 빌드하십시오.

## 다음 단계

- [저속 I/O](../interfaces/low-speed-io.mdx): GPIO, UART, I2C 및 SPI 핀
  매핑.
- [공장 빌드 및 테스트](../deployment/factory-build-and-test.mdx): 양산 환경에서의
  보드 프로그래밍 및 테스트.

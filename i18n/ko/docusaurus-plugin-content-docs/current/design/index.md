---
title: 하드웨어 설계
description: SoM 캐리어 보드 설계와 칩다운 설계 중 하나를 선택하고, 각 방식에 필요한 자료를 확인합니다.
sidebar_position: 1
---

# 하드웨어 설계

MLSoC Modalix를 기반으로 제품을 만드는 방법은 두 가지입니다. 방식에 따라 필요한
자료와 브링업 작업이 다르므로 시작하기 전에 하나를 선택하십시오.

| | SoM 캐리어 보드 | 칩다운 |
| --- | --- | --- |
| 설계 대상 | SoC, LPDDR5 및 전원부가 이미 탑재된 Modalix SoM용 캐리어 보드 | 메모리, 전원 및 클록을 포함하여 패키지된 Modalix SoC를 실장한 보드 |
| 주요 설계 작업 | 커넥터 매핑, 전원 공급, 인터페이스, 열 설계 | 위의 모든 작업과 더불어 DDR 라우팅 및 튜닝, 고속 레이아웃 |
| 자료 | 공개 데이터시트 및 브링업 가이드 | SoC 데이터시트 및 설계 패키지(요청 시 SiMa.ai에서 제공) |
| 소프트웨어 출발점 | 캐리어 보드에 맞게 디바이스 트리를 변경한 Modalix BSP | 보드 수준 적응을 적용한 Modalix BSP |

칩다운 설계는 칩온보드(chip-on-board) 설계라고도 합니다.

## SoM 캐리어 보드 {#som-carrier-board}

1. [참조 문서](../reference/extra-docs.md)에서
   **Modalix SoM Carrier Board Hardware Reference**와 **Modalix SoM Datasheet**를 읽으십시오.
2. [캐리어 보드 브링업](./som-carrier.mdx)을 참고하여 커넥터 매핑, 전원 및
   인터페이스를 계획하십시오. 이 문서는 커넥터 인터페이스, 레퍼런스 캐리어 보드와
   달라지는 점, 카메라 오버레이를 다룹니다.
3. [저속 I/O](../interfaces/low-speed-io.mdx)에서 저속 핀 할당을 확인하십시오.
4. 보드 제작이 끝나면 **Carrier Board SoM Bring-Up Guide**에 따라 최초 전원 투입을
   진행한 다음, [소스에서 BSP 빌드](../software/build-from-source.mdx)를 참고하여
   디바이스 트리를 적응시키십시오.

## 칩다운 {#chip-down}

1. SiMa.ai 담당자에게 **Modalix SoC Datasheet**, **PCB Routing Guidelines**, **DDR Tuning
   Guide** 및 레퍼런스 설계 패키지를 요청하십시오. 각 문서가 다루는 내용은
   [참조 문서](../reference/extra-docs.md)를 참조하십시오.
2. **Modalix SoM Thermal Design Guide**를 참고하여 냉각을 계획하십시오.
3. [eLxr 빌드 및 사용자 지정](../software/index.md)을 참고하여 소프트웨어를 빌드하고 적응시키십시오.

메모리 초기화와 최초 부팅을 포함한 칩다운 브링업 절차는 아직 공개 문서로 제공되지
않습니다. 이 절차는 SiMa.ai 담당자에게 문의하십시오.

## 다음 단계

- [인터페이스 및 주변 장치](../interfaces/low-speed-io.mdx): 핀 매핑 및
  주변 장치 설정.
- [빌드 배포](../software/build-from-source.mdx#deploy-your-build): 직접 만든
  빌드를 보드에 올리는 방법.
- [공장 빌드 및 테스트](../deployment/factory-build-and-test.mdx): 양산 환경에서의
  보드 프로그래밍 및 테스트.

---
title: 하드웨어 설계
description: 칩다운 설계와 캐리어 보드 설계는 Modalix 기반 시스템을 구축하는 서로 다른 두 가지 방식입니다. 시작하기 전에 하나를 선택하십시오.
sidebar_position: 1
---

# 하드웨어 설계

MLSoC Modalix를 기반으로 자체 시스템을 구축하는 방식은 서로 다른 두 가지가 있습니다.
방식에 따라 설계 작업, 필요한 자료, 브링업 절차가 모두 다르므로 시작하기 전에
하나를 선택하십시오.

<div className="card-grid">
  <a className="card" href="/hardware/design/chip-down">
    <h4>칩다운 설계</h4>
    <p>Modalix SoC를 자체 보드에 직접 실장하고, 메모리, 전원 및 클록을 직접 설계합니다.</p>
  </a>
  <a className="card" href="/hardware/design/carrier-board">
    <h4>캐리어 보드 설계</h4>
    <p>SoC, 메모리 및 전원부가 이미 탑재된 Modalix SoM용 캐리어 보드를 설계합니다.</p>
  </a>
</div>

## 두 방식 비교

| | 칩다운 설계 | 캐리어 보드 설계 |
| --- | --- | --- |
| 설계 대상 | 메모리, 전원 및 클록을 포함하여 패키지된 Modalix SoC를 실장한 보드 | SoC, LPDDR5 및 전원부가 이미 탑재된 Modalix SoM용 캐리어 보드 |
| 주요 설계 작업 | 전원 시퀀싱, 클록 및 리셋, LPDDR5 라우팅 및 튜닝, 고속 레이아웃, 인터페이스, 열 설계 | 커넥터 매핑, 전원 공급, 인터페이스, 열 설계 |
| 자료 | 칩다운 설계 가이드, SoC 데이터시트 및 설계 패키지(요청 시 SiMa.ai에서 제공) | 공개 데이터시트 및 브링업 가이드 |
| 소프트웨어 출발점 | 보드 수준 적응을 적용한 Modalix BSP | 캐리어 보드에 맞게 디바이스 트리를 변경한 Modalix BSP |

보드가 부팅된 이후에는 두 방식 모두 동일한 소프트웨어 및 양산 절차를 따릅니다.

- [eLxr 빌드 및 사용자 지정](../software/index.md): 보드에 맞는 커널, U-Boot 및
  디바이스 트리를 빌드합니다.
- [인터페이스 및 주변 장치](../interfaces/low-speed-io.mdx): 핀 매핑 및
  주변 장치 설정.
- [공장 빌드 및 테스트](../deployment/factory-build-and-test.mdx): 양산 환경에서의
  보드 프로그래밍 및 테스트.

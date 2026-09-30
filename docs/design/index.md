---
title: Design Your Hardware
description: Chip-down design and carrier board design are two separate paths to a Modalix-based system. Choose one before you start.
sidebar_position: 1
---

# Design Your Hardware

There are two separate paths to building your own system around MLSoC Modalix.
They need different design work, different collateral, and different bring-up,
so choose one before you start.

<div className="card-grid">
  <a className="card" href="/hardware/design/chip-down">
    <h4>Chip-Down Design</h4>
    <p>Put the Modalix SoC directly on your own board, and design its memory, power, and clocks yourself.</p>
  </a>
  <a className="card" href="/hardware/design/carrier-board">
    <h4>Carrier Board Design</h4>
    <p>Design a carrier board for the Modalix SoM, which already carries the SoC, memory, and power.</p>
  </a>
</div>

## Compare the Two Paths

| | Chip-down design | Carrier board design |
| --- | --- | --- |
| What you design | A board with the packaged Modalix SoC on it, including memory, power, and clocks | A carrier board for the Modalix SoM, which already carries the SoC, LPDDR5, and power |
| Main design work | Power sequencing, clocks and reset, LPDDR5 routing and tuning, high-speed layout, interfaces, thermals | Connector mapping, power delivery, interfaces, thermals |
| Collateral | Chip-down design guide, SoC datasheet, and design packages, available from SiMa.ai on request | Public datasheets and bring-up guide |
| Software starting point | The Modalix BSP, with board-level adaptation | The Modalix BSP, with device-tree changes for your carrier |

Both paths use the same software and production steps once the board boots:

- [Build & Customize eLxr](../software/index.md): build the kernel, U-Boot, and
  device trees for your board.
- [Interfaces & Peripherals](../interfaces/low-speed-io.mdx): pin mapping and
  peripheral setup.
- [Factory Build and Test](../deployment/factory-build-and-test.mdx): programming
  and testing boards in production.

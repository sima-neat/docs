---
title: Design Your Hardware
description: Choose between a SoM carrier board and a chip-down design, and find the collateral each path needs.
sidebar_position: 1
---

# Design Your Hardware

There are two ways to build a product around MLSoC Modalix. Choose one before you
start, because they need different collateral and different bring-up work.

| | SoM carrier board | Chip-down |
| --- | --- | --- |
| What you design | A carrier board for the Modalix SoM, which already carries the SoC, LPDDR5, and power | A board with the packaged Modalix SoC on it, including memory, power, and clocks |
| Main design work | Connector mapping, power delivery, interfaces, thermals | Everything above, plus DDR routing and tuning and high-speed layout |
| Collateral | Public datasheets and bring-up guide | SoC datasheet and design packages, available from SiMa.ai on request |
| Software starting point | The Modalix BSP, with device-tree changes for your carrier | The Modalix BSP, with board-level adaptation |

Chip-down design is also called chip-on-board design.

## SoM Carrier Board

1. Read the **Modalix SoM Carrier Board Hardware Reference** and the **Modalix SoM
   Datasheet** in [Reference Documents](../reference/extra-docs.md#design-a-custom-carrier-board).
2. Plan connector mapping, power, and interfaces using
   [Carrier Board Bring-up](./som-carrier.mdx), which covers the connector
   interfaces, what changes from the reference carrier board, and camera overlays.
3. Check low-speed pin assignments in [Low-Speed I/O](../interfaces/low-speed-io.mdx).
4. After the board is built, follow the **Carrier Board SoM Bring-Up Guide** for
   first power-on, then adapt the device tree with
   [Build the BSP from Source](../software/build-from-source.mdx).

## Chip-Down

1. Request the **Modalix SoC Datasheet**, **PCB Routing Guidelines**, **DDR Tuning
   Guide**, and a reference design package from your SiMa.ai representative. See
   [Reference Documents](../reference/extra-docs.md#chip-on-board-design) for what each one covers.
2. Plan cooling with the **Modalix SoM Thermal Design Guide**.
3. Build and adapt the software with [Build & Customize eLxr](../software/index.md).

Chip-down bring-up, including memory initialization and first boot, is not yet
documented publicly. Contact your SiMa.ai representative for this.

## Next Steps

- [Interfaces & Peripherals](../interfaces/low-speed-io.mdx): pin mapping and
  peripheral setup.
- [Deploy Your Build](../software/build-from-source.mdx#deploy-your-build): getting
  your own build onto your boards.

---
title: Chip-Down Design
description: Design a board with the Modalix SoC placed directly on it, and get the chip-down design guide and collateral.
sidebar_position: 2
---

# Chip-Down Design

In a chip-down design, the packaged Modalix SoC goes directly on your own board.
You design everything the Modalix SoM would otherwise provide, including the
memory, power, and clocks. Chip-down design is also called chip-on-board design.

If you would rather build on a module that already carries the SoC, memory, and
power, see [Carrier Board Design](./carrier-board.md).

## What You Design

- Power delivery and power sequencing for the SoC
- Clocks and reset
- LPDDR5 memory, including routing and tuning
- Boot storage, and serial access for debugging and recovery
- High-speed interfaces such as PCIe, MIPI CSI-2, and Ethernet, and their layout
- Cooling

## Chip-Down Design Guide

SiMa.ai has a Modalix chip-down design guide. To get it, contact your SiMa.ai
representative.

## Collateral

These documents are also available from your SiMa.ai representative. See
[Reference Documents](../reference/extra-docs.md) for a description of each one.

| Document | Use it for |
| --- | --- |
| Modalix SoC Datasheet | Pin functions, power rails, signal timing, and operating limits |
| Modalix PCB Routing Guidelines | Layout rules for PCIe, MIPI CSI-2, Ethernet, and other critical nets |
| Modalix DDR Tuning Guide | LPDDR5 routing, termination, and calibration |
| Modalix Early Access DevKit Design Package | A chip-down reference design |
| Modalix PCIe HHHL Design Package | A chip-down reference design for a PCIe card |
| Modalix SoM Thermal Design Guide | Thermal budgets and cooling design |

## Design Steps

1. Get the chip-down design guide and the collateral above.
2. Design the board, using the design packages as reference designs.
3. Plan cooling with the thermal design guide.
4. Bring up the board. Chip-down bring-up, including memory initialization and
   first boot, is not yet documented publicly. Contact your SiMa.ai representative
   for help.
5. Adapt and build the software with [Build & Customize eLxr](../software/index.md).

## Next Steps

- [Low-Speed I/O](../interfaces/low-speed-io.mdx): GPIO, UART, I2C, and SPI pin
  mapping.
- [Factory Build and Test](../deployment/factory-build-and-test.mdx): programming
  and testing boards in production.

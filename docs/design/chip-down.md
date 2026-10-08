---
title: Chip-Down Design
sidebar_label: "Build with the SoC"
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

## Get the Design Package {#design-package}

SiMa.ai provides the chip-down design guide and the collateral below as a design
package. The design package requires a non-disclosure agreement (NDA) with
SiMa.ai. To request it, contact your SiMa.ai representative. If you do not have
one, use the [SiMa.ai contact page](https://sima.ai/contact/).

## Collateral

Request these documents with the design package. See
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

1. Request the design package. It requires an NDA.
2. Design the board, using the design packages as reference designs.
3. Plan cooling with the thermal design guide.
4. Bring up the board. Chip-down bring-up, including memory initialization and
   first boot, is not yet documented publicly. Contact your SiMa.ai representative
   for help.
5. Adapt and build the software with
   [Build System Software](../software/index.md).

## Milestones {#milestones}

A chip-down project usually passes these milestones. This is an outline. The
procedures for each milestone come with the design package or from your SiMa.ai
representative.

1. **Design.** Schematics and layout, from the design package.
2. **Review.** Review the design with SiMa.ai before you build boards. Request
   the review through your SiMa.ai representative.
3. **Fabrication.** Build and assemble the first boards.
4. **First power-on and boot.** Bring up power, memory, and the first boot.
5. **Validation.** Check each interface, and the software on the board.

## Next Steps

- [Low-Speed I/O](../interfaces/low-speed-io.mdx): GPIO, UART, I2C, and SPI pin
  mapping.
- [Factory Build and Test](../deployment/factory-build-and-test.mdx): programming
  and testing boards in production.

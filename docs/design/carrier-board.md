---
title: Carrier Board Design
description: Design a carrier board for the Modalix SoM, from collateral to first power-on.
sidebar_position: 3
---

# Carrier Board Design

The Modalix SoM carries the Modalix SoC, LPDDR5 memory, and power on a module
with board-to-board connectors. The SoM plugs into a carrier board, which has
the connectors, power input, and interfaces your product needs. You can buy a
carrier board or design your own.

If you want to place the SoC directly on your own board instead, see
[Chip-Down Design](./chip-down.md).

## What the SoM Provides {#som-provides}

These parts are on the Modalix SoM and work on any carrier board that follows the
260-pin connector assignment:

- MLSoC Modalix
- LPDDR5 memory
- eMMC and SPI flash storage
- USB controller, Gigabit Ethernet PHY, and HDMI video processor
- Real-time clock

## What the Carrier Board Provides {#carrier-provides}

- Connector mapping between the SoM and your interfaces
- Power delivery to the SoM
- Interfaces such as Ethernet, PCIe, USB, MIPI cameras, and low-speed I/O
- Serial access for debugging and recovery
- Cooling

## Choose or Design a Carrier Board {#choose-or-design}

You can buy a carrier board or design your own:

- To buy one, compare boards in [Third-Party Carrier Boards](./third-party-carriers.mdx).
  The Modalix DevKit uses the Waveshare carrier board, which is the reference
  carrier board.
- To design your own, use the collateral and the design steps below.

## Collateral

These documents are in [Reference Documents](../reference/extra-docs.md).

| Document | Use it for |
| --- | --- |
| Modalix SoM Carrier Board Hardware Reference | Connector pinouts, interface mapping, power delivery, and reference connections. Read this first. |
| Modalix SoM Datasheet | Electrical, mechanical, and thermal specifications of the SoM |
| Carrier Board SoM Bring-Up Guide | Powering and validating a new carrier board |
| Modalix SoM Thermal Design Guide | Thermal budgets and cooling design, available from your SiMa.ai representative |

## Design Steps

1. Read the **Modalix SoM Carrier Board Hardware Reference** and the **Modalix
   SoM Datasheet**.
2. Plan connector mapping, power, and interfaces using
   [Carrier Board Bring-up](./som-carrier.mdx), which covers the connector
   interfaces, what changes from the reference carrier board, and camera overlays.
3. Check low-speed pin assignments in [Low-Speed I/O](../interfaces/low-speed-io.mdx).
4. After the board is built, follow the **Carrier Board SoM Bring-Up Guide** for
   first power-on.
5. Adapt the device tree for your carrier with
   [Build the BSP from Source](../software/build-from-source.mdx).

## Next Steps

- [Carrier Board Bring-up](./som-carrier.mdx): the reference carrier board, and
  what needs software adaptation.
- [Third-Party Carrier Boards](./third-party-carriers.mdx): off-the-shelf boards
  with the same form factor, compared by interface.
- [Factory Build and Test](../deployment/factory-build-and-test.mdx): programming
  and testing boards in production.

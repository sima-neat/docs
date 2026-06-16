---
title: Reference Documents
description: Product briefs, datasheets, hardware reference manuals, and design and tuning guides for SiMa.ai Modalix products, organized by what you want to build.
sidebar_position: 4
---

# Reference Documents

This page catalogs the briefs, datasheets, hardware reference manuals, and design and tuning guides for SiMa.ai Modalix products, organized by what you're trying to do — from evaluating the platform to designing, tuning, and integrating your own Modalix-based product. Documents marked *Contact your SiMa.ai representative* are distributed on request.

## Evaluate Modalix and choose a product

Start here to understand the platform and confirm a product fits your application before diving into board-level detail.

| Document | Description | Download |
| --- | --- | --- |
| **Modalix SoC Product Brief** | A high-level overview of the MLSoC Modalix silicon — the Machine Learning Accelerator (MLA), Image Signal Processor (ISP), Computer Vision Unit (CVU), video codecs, and I/O — with headline performance and power figures. A first read to assess whether Modalix suits your workload. | [Download PDF](https://sima.ai/wp-content/uploads/2025/12/Modalix-SoC-Product-Brief_05.3.pdf) |
| **Modalix SoM Product Brief** | An overview of the Modalix System-on-Module — the SoC packaged with LPDDR5, power, and board-to-board connectors for product integration. Start here when scoping a custom design built around the SoM rather than a full DevKit. | [Download PDF](https://sima.ai/wp-content/uploads/2025/12/Modalix-SoM-Product-Brief_05.3.pdf) |
| **Modalix SoM DevKit 3.0 Product Brief** | A summary of the DevKit's features, interfaces, and form factor. Use it to confirm the kit matches your evaluation and prototyping needs before ordering. | [Download PDF](https://sima.ai/wp-content/uploads/2025/12/Modalix-DevKit-Product-Brief_04.2.pdf) |
| **Modalix SoM DevKit 3.0 Quick Start Guide** | An interactive, step-by-step walkthrough for unboxing and first boot of the DevKit, covering power, serial access, and initial network bring-up. The fastest way to get hands-on with the hardware. | [Launch Interactive Guide](pathname:///tools/qsg/index.html) |

## Design a custom carrier board

The core references for integrating the Modalix SoM into your own board — pinouts, power, high-speed routing, and first bring-up.

| Document | Description | Download |
| --- | --- | --- |
| **Modalix SoM Carrier Board Hardware Reference** | The primary guide for designing a carrier board around the Modalix SoM: connector pinouts, interface mapping, power delivery, and reference connections. Read this first when starting a custom board design. | [Download PDF](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/SiMa_SOM_Carrier_Board_Data_Sheet_Rev1.2_1-24-2026.pdf) |
| **Modalix SoM Datasheet** | Detailed electrical, mechanical, and thermal specifications for the SoM — connector pinouts, power sequencing, current draw, and operating limits. The authoritative source for board-level design decisions. | [Download PDF](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/Modalix_SOM_Board_Data_Sheet_Rev2.1_5-15-2026.pdf) |
| **Modalix SoC Datasheet** | Detailed electrical, mechanical, and thermal specifications for the MLSoC Modalix die — pin functions, power rails, signal timing, and operating limits. Needed when designing at the silicon level rather than around the pre-integrated SoM. | *Contact your SiMa.ai representative* |
| **Modalix PCB Routing Guidelines** | High-speed layout rules for PCIe, MIPI CSI-2, Ethernet, and other critical nets — impedance, length matching, and reference-plane guidance — so signal integrity holds up on a custom board. | *Contact your SiMa.ai representative* |
| **Modalix DDR Tuning Guide** | LPDDR5 routing and tuning guidance, including length matching, termination, and calibration, to ensure reliable, full-speed memory operation on your design. | *Contact your SiMa.ai representative* |
| **Carrier Board SoM Bring-Up Guide** | A step-by-step procedure for powering and validating a freshly built carrier board, from first power rails through a booting SoM, with checkpoints and common bring-up issues to watch for. | [Download PDF](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/Modalix_SOM_Carrier_Board_Bring-Up_Guide_Rev1.2_4-16-2026.pdf) |
| **Modalix Early Access DevKit Design Package** | Schematics and design collateral for the Early Access DevKit, useful as a worked reference design when laying out your own carrier board. | *Contact your SiMa.ai representative* |

## Tune cameras and the ISP

Resources for getting a camera sensor connected and producing well-tuned images through the on-chip ISP.

| Document | Description | Download |
| --- | --- | --- |
| **Modalix Camera & ISP Tuning Guide** | Procedures for tuning the Modalix Image Signal Processor to a specific camera sensor — calibration, exposure, white balance, and the image-quality pipeline. Use it after the sensor is wired and enumerating to dial in image quality. | *Contact your SiMa.ai representative* |

> To physically connect and enable MIPI CSI-2 cameras on a DevKit first, see [MIPI Camera Interfaces](/hardware/getting-started/standalone-mode/mipi-camera-interfaces).

## Plan power and thermal design

SiMa.ai provides a dedicated Thermal Design Guide for designing a Modalix thermal solution. Pair it with the electrical, thermal, and mechanical limits in the datasheets and hardware references listed elsewhere on this page when sizing power delivery, selecting heatsinks, and validating cooling.

| Document | Description | Download |
| --- | --- | --- |
| **Modalix Thermal Design Guide** | The dedicated reference for designing a Modalix thermal solution — power-dissipation and thermal budgets, recommended heatsink and airflow configurations, junction-temperature management, and measurement and validation procedures. The primary guide when designing cooling for a custom board or enclosure. | *Contact your SiMa.ai representative* |

## Build a host-attached PCIe product

References specific to the half-height/half-length (HHHL) Modalix PCIe card.

| Document | Description | Download |
| --- | --- | --- |
| **Modalix PCIe HHHL Hardware Reference** | Hardware reference for the HHHL PCIe card — connector and power details, mechanical envelope, and host-integration requirements for building or integrating the card into a system. | [Download PDF](https://docs.sima.ai/pkg_downloads/datasheets_product_briefs/SiMa_Modalix_PHHHL_Manual_Rev1.00_2-21-2026.pdf) |
| **Modalix PCIe HHHL Design Package** | Schematics and design collateral for the PCIe HHHL card, useful as a reference when adapting or extending the design. | *Contact your SiMa.ai representative* |

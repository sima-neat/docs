---
title: Glossary
description: Common acronyms and terms used throughout the SiMa.ai hardware documentation.
sidebar_position: 3
---

# Glossary

Common acronyms and terms used throughout this documentation. Entries are grouped by topic; within each group they are alphabetical.

## Silicon & Compute

**CVU**
: **Computer Vision Unit.** The on-chip accelerator dedicated to classical vision workloads (filters, transforms, image-processing kernels). The MLSoC Modalix integrates a Synopsys EV74 CVU running at 750 16-bit GOPS.

**ISP**
: **Image Signal Processor.** The on-chip block that converts raw camera sensor output (Bayer pattern, mono, etc.) into a usable image. The MLSoC Modalix uses an ARM C-71 ISP running at 1.2 GHz.

**MLA**
: **Machine Learning Accelerator.** The on-chip block that runs neural-network inference. The MLA is the primary differentiator of the MLSoC Modalix and is what NEAT applications target.

**MLSoC**
: **Machine Learning System-on-Chip.** SiMa.ai's product family of edge AI processors. This documentation covers the **MLSoC Modalix**, the second generation.

**Modalix**
: The product name of SiMa.ai's second-generation MLSoC and the silicon at the core of every kit documented here.

**NoC**
: **Network on Chip.** The on-die interconnect that wires the MLA, CVU, ISP, application cores, memory controllers, and I/O blocks together. The Modalix NoC includes performance monitoring, firewalling, and QoS controls.

**tRoot**
: The hardware root-of-trust subsystem on the MLSoC that handles secure boot, key storage, and firmware authentication.

## System Software

**BSP**
: **Board Support Package.** The collection of low-level software — bootloader, kernel, device trees, drivers, and root filesystem — that brings a SiMa.ai board up from power-on to a usable Linux userspace. See [Board Support Package](./bsp).

**eLxr**
: A [Debian-derived Linux distribution](https://elxr.org/) used as the default runtime on Modalix DevKits shipped after mid-December 2025. Userspace is managed with `apt`.

**sima-cli**
: The host-side command-line tool used to flash firmware, install drivers, and manage SiMa.ai devices over the network or PCIe.

**U-Boot**
: The bootloader used on SiMa.ai DevKits. Responsible for DRAM initialization, reading boot media, and loading the Linux kernel.

**Yocto**
: An embedded Linux build system (poky-based) used for the legacy MLSoC BSP. Modalix DevKits originally shipped with a Yocto image and can be converted to eLxr; see [Convert to eLxr](./tech-notes/elxr-conversion).

## Applications & Frameworks

**NEAT**
: SiMa.ai's application framework for the MLSoC Modalix. NEAT replaces the older Palette/MPK toolchain. Full documentation at [docs.sima-neat.com](https://docs.sima-neat.com).

**NEAT application**
: A packaged on-device inference pipeline (model + pre/post-processing graph + runtime metadata) produced by the NEAT toolchain and loaded onto the MLSoC Modalix for execution.

## Hardware & Form Factors

**DevKit**
: A pre-assembled SiMa.ai development board (Modalix DevKit, Modalix Early Access Kit, Modalix Early Access PCIe Card) intended for evaluating the silicon and developing applications before designing a custom carrier.

**eMMC**
: **Embedded MultiMediaCard.** Onboard flash storage soldered to the DevKit. Used to store the boot image and root filesystem.

**HHHL**
: **Half-Height, Half-Length.** A PCIe card form factor compatible with most server and workstation chassis. The Modalix Early Access PCIe Card is an HHHL card.

**LPDDR5**
: **Low-Power Double Data Rate 5** memory. The system RAM used on Modalix products. The MLSoC Modalix supports 32- and 64-bit LPDDR5 configurations across 8 channels.

**SoC**
: **System on Chip.** A single die that integrates CPUs, accelerators, memory controllers, and I/O — as opposed to a multi-chip module.

**SoM**
: **System on Module.** A board that exposes a SoC plus its supporting RAM, storage, and power circuitry on a connector for integration into a custom carrier board. The Modalix DevKit is built around the Modalix SoM.

## Interfaces

**GMSL2**
: **Gigabit Multimedia Serial Link, version 2.** An automotive-grade serial protocol for transporting camera and sensor data over coax (FAKRA) cabling. Supported on the Modalix Early Access PCIe Card.

**MIPI CSI**
: **Mobile Industry Processor Interface — Camera Serial Interface.** The standard high-speed serial interface for connecting image sensors to a SoC.

## Deployment

**PCIe mode**
: A deployment architecture in which the MLSoC Modalix lives on a PCIe card plugged into a host system. The host handles I/O and orchestration; the card handles inference. See [PCIe Mode](/hardware/getting-started/pcie-mode).

**Standalone mode**
: A deployment architecture in which the MLSoC Modalix runs as a self-contained device, with no host system, processing sensor data locally and emitting results over the network. See [Standalone Mode](/hardware/getting-started/standalone-mode/).

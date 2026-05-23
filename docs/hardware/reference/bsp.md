---
title: Board Support Package
description: The low-level software stack that brings a SiMa.ai board from power-on to a usable Linux userspace.
sidebar_position: 1
---

# Board Support Package

The Board Support Package (BSP) is the collection of low-level software that brings a SiMa.ai board up from power-on to a usable Linux userspace. It is the foundation every higher-level workload — perception pipelines, ROS 2 nodes, custom C/C++ applications — runs on top of.

A SiMa.ai BSP contains:

- **Bootloader** (U-Boot) — initializes DRAM, reads boot media, loads the kernel.
- **Kernel** — Linux kernel with SiMa.ai drivers for the MLA, CVU, ISP, PCIe, networking, and storage IP on the SoC.
- **Device trees** — describe board-specific peripherals (MIPI cameras, GMSL2 deserializers, GPIO headers, M.2 slots) so the kernel can probe them at boot.
- **Root filesystem** — userspace tools, system services, and the SiMa.ai runtime libraries that talk to the on-chip accelerators.
- **Firmware blobs** — for the security processor (tRoot) and other co-processors.

## Modalix BSP

The Modalix BSP targets the Modalix DevKit, Modalix Early Access kits, and the Modalix PCIe card. It is built on [eLxr](https://elxr.org/), a Debian-derived distribution. Userspace is managed with `apt`, so customizing Modalix images is closer to packaging Debian software than to writing Yocto recipes. For users converting an existing Yocto DevKit to eLxr, see [Convert to eLxr](./tech-notes/elxr-conversion).

Source layer: [swsoc-simaai-elxr-doc](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

## What you can do with the BSP sources

The repository above is useful when you need to:

- **Add a custom peripheral** — write a device-tree overlay for a new MIPI camera, GMSL2 sensor, or HAT board.
- **Enable kernel features** — turn on a kernel option (e.g., a filesystem, network protocol, or USB gadget driver) that isn't in the stock image.
- **Replace or extend the rootfs** — bake in your own application, library, or system service.
- **Reproduce a release locally** — rebuild the exact image that ships on a DevKit for auditing or modification.

Once a custom image is built, flash it onto a DevKit using one of the methods in [Firmware Update](/docs/hardware/getting-started/firmware-update/).

## Repository

- [Modalix (eLxr)](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

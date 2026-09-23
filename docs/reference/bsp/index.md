---
title: Board Support Package
description: The low-level software stack that brings a SiMa.ai board from power-on to a usable Linux userspace.
sidebar_position: 1
---

# Board Support Package

The Board Support Package (BSP) is the low-level software that brings a SiMa.ai board from power-on to a usable Linux userspace. Higher-level workloads, including perception pipelines, ROS 2 nodes, and custom C/C++ applications, run on top of it.

A SiMa.ai BSP contains:

- **Bootloader** (U-Boot) — initializes DRAM, reads boot media, loads the kernel.
- **Kernel** — Linux kernel with SiMa.ai drivers for the MLA, CVU, ISP, PCIe, networking, and storage IP on the SoC.
- **Device trees** — describe board-specific peripherals (MIPI cameras, GMSL2 deserializers, GPIO headers, M.2 slots) so the kernel can probe them at boot.
- **Root filesystem** — userspace tools, system services, and the SiMa.ai runtime libraries that talk to the on-chip accelerators.
- **Firmware blobs** — for the security processor (tRoot) and other co-processors.

## Modalix BSP

The Modalix BSP targets the Modalix DevKit, Modalix Early Access kits, and the Modalix PCIe card. It is built on [eLxr](https://elxr.org/), a Debian-derived distribution. Userspace is managed with `apt`, so customizing Modalix images is closer to packaging Debian software than to writing Yocto recipes. To convert an existing Yocto DevKit to eLxr, see [Convert to eLxr](../tech-notes/elxr-conversion.mdx).

Source layer: [swsoc-simaai-elxr-doc](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc)

## What You Can Do with the BSP Sources

The repository above is useful when you need to:

- **Add a custom peripheral** — write a device-tree overlay for a new MIPI camera, GMSL2 sensor, or HAT board.
- **Enable kernel features** — turn on a kernel option (e.g., a filesystem, network protocol, or USB gadget driver) that isn't in the stock image.
- **Replace or extend the rootfs** — bake in your own application, library, or system service.
- **Reproduce a release locally** — rebuild the exact image that ships on a DevKit for auditing or modification.

After you build a custom image, flash it onto a DevKit using one of the methods in [Firmware Update](/hardware/getting-started/firmware-update).

## Sources and Manuals

Everything below is public. Building an image, flashing a board, and adding your
own drivers do not require an NDA or a sales enquiry.

| What | Where |
| --- | --- |
| eLxr SDK manual — build environment, kernel and U-Boot build, device trees, kernel modules | [sdk-manual.rst](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc/blob/master/sdk-manual.rst) |
| Modalix build container | [Dockerfile.modalix](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc/blob/master/Dockerfile.modalix) |
| Linux kernel source | [simaai-linux](https://github.com/SiMa-ai/simaai-linux) |
| U-Boot source | [sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot) |
| eLxr layer and documentation | [swsoc-simaai-elxr-doc](https://github.com/SiMa-ai/swsoc-simaai-elxr-doc) |

## In This Section

- [Build the BSP from Source](./build-from-source.mdx) — build environment,
  kernel, U-Boot, device trees, and installing the artifacts.
- [Carrier Board Bring-up](./carrier-board.mdx) — running a Modalix SoM on a
  third-party carrier board, and what needs software adaptation.
- [Low-Speed I/O](./low-speed-io.mdx) — GPIO, UART, I2C and SPI on the SIO
  blocks, with the full 64-pin mapping.

The SDK manual is the starting point: it covers the Docker build environment,
fetching and configuring the kernel and U-Boot, building both, installing the
resulting artifacts on a board, and working with device trees, overlays and
out-of-tree kernel modules.

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

The Modalix BSP targets the Modalix DevKit, Modalix Early Access kits, and the Modalix PCIe card. It is built on [eLxr](https://elxr.org/), a Debian-derived distribution. Userspace is managed with `apt`, so customizing Modalix images is closer to packaging Debian software than to writing Yocto recipes. To convert an existing Yocto DevKit to eLxr, see [Convert to eLxr](../reference/tech-notes/elxr-conversion.mdx).

Sources: [simaai-linux](https://github.com/SiMa-ai/simaai-linux) (kernel and device trees), [sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot) (U-Boot), and [meta-simaai](https://github.com/SiMa-ai/meta-simaai) (Yocto layer).

## eLxr or Yocto {#elxr-or-yocto}

eLxr is the preferred path for board bring-up. You can also bring up a board with Yocto, using the meta-simaai layer and its [image build manual](https://github.com/SiMa-ai/meta-simaai/blob/master/documentation/build-manual.rst). Both build from the same kernel and U-Boot sources with the same kernel configuration, so driver and device-tree work carries over.

| Task | eLxr (preferred) | Yocto |
| --- | --- | --- |
| Build the kernel, U-Boot, device trees, overlays, and kernel modules | [Build the BSP from Source](./build-from-source.mdx) | [Image build manual](https://github.com/SiMa-ai/meta-simaai/blob/master/documentation/build-manual.rst) |
| Add userspace software | Install packages with `apt` | Write recipes |
| Build a complete image from source | Not yet documented | [Build a Complete Image with Yocto](./yocto-image.mdx) |
| Build an update package | Not yet documented | [Build and Apply an Update Package](../deployment/update-package.mdx) |
| Secure boot and provisioning | Not yet documented | Not yet documented |

Choose Yocto if you need to build a complete image from source today. Otherwise, use eLxr.

## What You Can Do with the BSP Sources

The sources are useful when you need to:

- **Add a custom peripheral** — write a device-tree overlay for a new MIPI camera, GMSL2 sensor, or HAT board.
- **Enable kernel features** — turn on a kernel option (e.g., a filesystem, network protocol, or USB gadget driver) that isn't in the stock image.
- **Replace or extend the rootfs** — bake in your own application, library, or system service.
- **Reproduce a release locally** — rebuild the exact image that ships on a DevKit for auditing or modification.

To get a custom build onto your boards, see [Deploy Your Build](./build-from-source.mdx#deploy-your-build). [Firmware Update](/hardware/getting-started/firmware-update) installs the stock SiMa.ai image, not your own build.

## Sources and Manuals

Everything below is public. Building an image, flashing a board, and adding your
own drivers do not require an NDA or a sales enquiry.

| What | Where |
| --- | --- |
| Build steps — build environment, kernel and U-Boot build, device trees, kernel modules | [Build the BSP from Source](./build-from-source.mdx) |
| Which source commit matches each platform release | [Release Compatibility](./release-compatibility.mdx) |
| Modalix build container | [Dockerfile.modalix](./build-from-source.mdx#set-up-the-build-container) |
| Linux kernel source | [simaai-linux](https://github.com/SiMa-ai/simaai-linux) |
| U-Boot source | [sima-ai-uboot](https://github.com/SiMa-ai/sima-ai-uboot) |
| Yocto layer, with board-specific overlay sources | [meta-simaai](https://github.com/SiMa-ai/meta-simaai) |

## In This Section

- [Build the BSP from Source](./build-from-source.mdx) — build environment,
  kernel, U-Boot, device trees, and installing the artifacts.
- [Device Trees and Overlays](./device-tree.mdx) — select an overlay or write your own,
  and check that the driver binds.
- [Release Compatibility](./release-compatibility.mdx) — the kernel and U-Boot
  commit behind each platform release.
- [Build a Complete Image with Yocto](./yocto-image.mdx) — build a whole image from source
  with the public Yocto layer.
- [Flash an Image to eMMC](../deployment/flash-image.mdx) — write your own build to the
  eMMC of a board.
- [Build and Apply an Update Package](../deployment/update-package.mdx) — package an update for a
  Yocto image, and how the board falls back.
- [Factory Build and Test](../deployment/factory-build-and-test.mdx) — program and test
  boards in production.

For the hardware topics that BSP work depends on, see
[Carrier Board Bring-up](../design/som-carrier.mdx) and
[Low-Speed I/O](../interfaces/low-speed-io.mdx).

Start with [Build the BSP from Source](./build-from-source.mdx): it covers the
Docker build environment, fetching and configuring the kernel and U-Boot, building
both, installing the results on a board, and working with device trees, overlays
and out-of-tree kernel modules.

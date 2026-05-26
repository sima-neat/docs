---
title: SiMa.ai Hardware
description: Overview of SiMa.ai hardware platforms and DevKit bring-up entry points.
sidebar_position: 1
slug: /
---

# SiMa.ai Hardware

SiMa.ai hardware platforms are designed for edge AI systems that need local model execution, camera and video interfaces, wired networking, and board-level control close to the sensor or application workload.

The hardware documentation starts with the Modalix DevKit because it is the primary development platform for current SiMa.ai software and firmware validation.

## Platform Overview

The Modalix DevKit combines application processors, dedicated acceleration, onboard storage, peripheral I/O, display output, and network connectivity in a development enclosure. It is used for early evaluation, application bring-up, firmware validation, and system integration before moving to a product-specific board.

Common development tasks include:

- Connecting to the board through the serial console
- Verifying the installed operating system image
- Bringing up Ethernet or direct host networking
- Installing or validating software packages
- Testing camera, display, USB, and storage paths
- Recovering access when network configuration is not available

## Hardware Interfaces

| Interface | Purpose |
| --- | --- |
| Serial console | Board bring-up, shell access, recovery, and low-level debug |
| Ethernet | Remote login, package installation, artifact download, and network services |
| USB | Peripheral input, storage, cameras, and development accessories |
| MIPI camera | Vision input for camera and pipeline validation |
| HDMI | Local display output |
| eMMC and NVMe | Operating system storage and high-capacity local data storage |

## Development Flow

Start with serial access, then establish network connectivity, verify the board image, and install the software stack needed for your project. Serial access should remain available during development because it is the most reliable path for recovering a board with unknown network state.

For first-time board setup, continue with [Set up your DevKit](/hardware/setup-devkit).

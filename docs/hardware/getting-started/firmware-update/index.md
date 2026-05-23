---
title: Firmware Update
description: Methods for keeping the Modalix DevKit firmware up to date.
sidebar_position: 1
slug: /hardware/getting-started/firmware-update/
---

# Firmware Update

Firmware is the foundational software that runs on the DevKit. Keeping firmware up to date is essential for ensuring stability, security, and access to new features and performance improvements.

:::note
Please install or upgrade `sima-cli` before continuing. This guide is intended for use with the latest `sima-cli` version.
:::

:::warning
Upgrading a Modalix DevKit from SDK 1.7 to 2.0 requires additional steps. Refer to the [Convert to eLxr](/docs/hardware/reference/tech-notes/elxr-conversion) guide for the conversion procedure.
:::

There are three supported methods for updating the DevKit firmware:

- [Using sima-cli](./sima-cli.mdx) — Transfer the firmware image over the network and automatically trigger the update on the DevKit. This method is ideal for field updates.
- [Flash boot device](./bootimage.mdx) — Create or recover bootable media for the DevKit. Useful for restoring faulty devices or provisioning multiple boot devices.
- [Boot over network then flash](./netboot.mdx) — Start a local TFTP server and boot the DevKit directly over the network without flashing media. Ideal for recovery, factory bring-up, or rapid kernel/rootfs development.

See also: [Operating Systems](./os.md).

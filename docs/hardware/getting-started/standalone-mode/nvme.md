---
title: Configure NVMe Storage
description: Format and mount the M.2 NVMe drive on the Modalix DevKit.
sidebar_position: 3
---

# Configure NVMe Storage

The **Modalix DevKit** includes a 500 GB NVMe (Non-Volatile Memory Express) drive.
Developers who require additional capacity can replace the pre-installed drive with a compatible M.2 NVMe module installed directly on the carrier board.

:::note
Please install or upgrade `sima-cli` before continuing. This guide is intended for use with the latest `sima-cli` version.
:::

:::note
This command must be run directly on the Modalix DevKit.
:::

Once `sima-cli` is installed, you can format the NVMe drive using the following command:

```console
modalix:~$ sima-cli nvme format
```

After formatting, the NVMe drive will be automatically mounted at `/media/nvme`.

To verify the mount and view storage usage, run:

```console
modalix:~$ df -h
```

This command displays the available disk space on all mounted file systems, including the NVMe drive.

In case the NVMe drive needs to be remounted, run:

```console
modalix:~$ sima-cli nvme remount
```

Both `format` and `remount` commands automatically add an entry into the `/etc/fstab` file, so the NVMe drive is always auto mounted.

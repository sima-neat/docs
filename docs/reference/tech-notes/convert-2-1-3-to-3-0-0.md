---
title: Convert from 2.1.3 to 3.0.0
description: Update Modalix SoM DevKits and PCIe cards to firmware 2.1.3, then use netboot to install 3.0.0.
sidebar_position: 4
---

# Convert from 2.1.3 to 3.0.0

This procedure applies to **Modalix SoM DevKits** and **Modalix PCIe cards**. Most new boards have **2.1.x** firmware installed at the factory.

Release **2.1.x** uses a system image compatible with **Debian 12**. Release **3.0.0** moves to **Debian 13**. It also includes system changes to **OverlayFS**, **A/B images**, and **SWUpdate**.

These changes make the 3.0.0 system image incompatible with the 2.1 system image. The conversion requires a special update procedure. First, update the board to the latest **2.1.3** firmware. Then, use **netboot** to start the board through the network and write the 3.0.0 image to its storage.

This note uses these terms:

- **Board**: the SoM DevKit or PCIe card.
- **Host**: the Ubuntu or macOS computer that supplies the boot image through a TFTP server.
- **Flash**: write a system image to the board's storage.

## Before You Start

- Make a backup of the files and configuration that you need from the board.
- Make sure the board has Internet access for the 2.1.3 update.
- Make sure the host has Internet access for CLI updates and image downloads.
- Use **sima-cli 2.1.19 or later** on the host. With Internet access, `sima-cli` updates itself to the latest version.
- Prepare an Ethernet connection between the board and the host.
- If possible, prepare a serial connection to monitor the board.

To install the latest `sima-cli` on the **host**, run:

```bash
curl -fsSL https://artifacts.neat.sima.ai/sima-cli/linux-mac.sh | bash
```

## 1. Update the Board to 2.1.3

Run the commands in this section **on the board**.

1. Connect to the board through SSH or serial.
2. Check the firmware version:

   ```bash
   cat /etc/buildinfo
   ```

   If the board has the latest **2.1.3** release, go to Section 2.

3. Install the latest `sima-cli`:

   ```bash
   curl -fsSL https://artifacts.neat.sima.ai/sima-cli/linux-mac.sh | bash
   ```

4. Start the firmware update:

   ```bash
   sima-cli update
   ```

5. Follow the instructions on the screen to install the latest **2.1.3** release.
6. Reboot the board when instructed.
7. Check `/etc/buildinfo` again to make sure the board runs **2.1.3**.

## 2. Connect the Board to the Host

A direct Ethernet connection with Internet sharing is recommended.

1. Connect the board's Ethernet port to the host.
2. Enable Internet sharing on the host:
   - **Ubuntu**: follow the shared-connection procedure in [Network Setup](/hardware/getting-started/standalone-mode/network).
   - **macOS**: enable Internet Sharing for the Ethernet interface connected to the board.

Alternatively, connect both systems to the same network. The host must be able to reach the board. The board must be able to reach the host's TFTP server.

### Find the Board's IP Address

With Internet sharing enabled, the host assigns an IP address to the board. Use the serial console to find this address.

1. Connect the board's serial port to the host. See [Serial Connection](/hardware/getting-started/setup-serial).
2. Open a terminal **on the host** and run:

   ```bash
   sima-cli serial
   ```

3. Log in to the board.
4. Run this command **on the board**:

   ```bash
   /sbin/ifconfig
   ```

5. Find the Ethernet interface connected to the host.
6. Record its IPv4 address, shown after `inet`. Do not use the loopback address `127.0.0.1`.
7. In a separate terminal **on the host**, check the connection:

   ```bash
   ping {ip}
   ```

Replace `{ip}` with the recorded address in all commands. Keep the serial console open to monitor the conversion.

### PCIe Cards Without Serial Access

The serial port on a PCIe card can be difficult to reach. If you cannot connect a serial cable, use the static IP method below.

A PCIe card with **2.1.3** uses **192.168.1.10** if it does not receive an IP address.

1. Connect the card's Ethernet port directly to the host.
2. Set the host's connected Ethernet interface to **192.168.1.20**, on the same subnet as the card.
3. Check the connection from the host:

   ```bash
   ping 192.168.1.10
   ```

4. Use **192.168.1.10** for `{ip}` in Section 3.

These addresses apply to the card's Ethernet port. The [Ethernet-over-PCIe interface](/hardware/getting-started/pcie-mode/virtual-network) uses a separate configuration.

## 3. Flash the 3.0.0 Image

Run the commands in this section **on the host**.

1. Make sure the CLI version is **2.1.19 or later**.
2. If you connected a serial cable, keep the serial console open.
3. In a separate host terminal, start the conversion:

   ```bash
   sima-cli bootimg -v 3.0.0 --netboot --devkit {ip} --autoflash
   ```

The command starts a TFTP server on the host. It instructs the board to boot from that server. The `--autoflash` option then writes the image to the board automatically.

Keep the host terminal open until the procedure is complete. Keep the network connected and the board powered on.

## 4. Reboot the Board

1. Wait for `sima-cli` to tell you to reboot the board.
2. Reboot the board.
3. Wait for the board to start.
4. Connect to the board through serial or SSH.
5. Check the firmware version **on the board**:

   ```bash
   cat /etc/buildinfo
   ```

6. Make sure the version is **3.0.0** before you continue with system setup.

For PCIe host systems, follow [PCIe Driver Installation](/hardware/getting-started/pcie-mode/driver-installation) to set up the host driver.

---
title: Set up your DevKit
description: Bring up a SiMa.ai Modalix DevKit from first serial access through network validation.
sidebar_position: 2
---

# Set Up Your DevKit

Use this checklist to bring up a Modalix DevKit from a clean or freshly flashed state.

## Prerequisites

Before powering on the board, prepare:

- DevKit power supply
- Ethernet cable or direct host network connection
- USB serial connection for console access
- Development host with a serial terminal
- Access to the software or firmware artifacts required for your environment

## Connect Serial First

Connect the board serial interface before relying on SSH or web-based tools. Serial access gives you a recovery path if the board has no DHCP lease, an unexpected static IP address, or a partially configured network.

Use the serial settings:

| Setting | Value |
| --- | --- |
| Baud rate | 115200 |
| Data bits | 8 |
| Parity | None |
| Stop bits | 1 |
| Flow control | Disabled |

When the login prompt appears, use the development credentials provided with your DevKit image.

## Power On And Verify Boot

After applying power, watch the serial console for boot progress. Confirm that the board reaches a login prompt and that the expected operating system image is running.

Useful checks from the console:

```bash
cat /etc/buildinfo
uname -a
ip addr
df -h
```

## Configure Networking

Most DevKit workflows use Ethernet. The board may receive an address through DHCP when connected to a lab network, or it may require host internet sharing or a static network profile when connected directly to a development machine.

After networking is available, verify basic connectivity:

```bash
ip route
ping -c 3 8.8.8.8
ping -c 3 github.com
```

## Validate Remote Access

Once you know the board IP address, connect over SSH from your development host:

```bash
ssh sima@<devkit-ip-address>
```

Keep the serial console open during early setup. It is useful for observing service startup, firmware activation, and package installation logs.

## Next Steps

After the board is reachable over the network, install the software stack required for your project and run the validation or tutorial workflow for that release.


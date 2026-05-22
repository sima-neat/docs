---
title: Web Serial Console
description: Use a browser-based serial console for DevKit bring-up and recovery.
sidebar_position: 1
---

# Web Serial Console

The Web Serial Console provides browser-based access to a DevKit serial port. It is useful when you want a lightweight console without installing a full terminal application.

## Browser Support

Use a browser that supports the Web Serial API, such as Chrome or Edge. Some browsers do not expose serial devices to web pages.

## Connect

1. Attach the DevKit serial cable to your development host.
2. Open the Web Serial Console tool.
3. Select the DevKit serial device from the browser permission dialog.
4. Use `115200 8N1` with flow control disabled.
5. Press Enter if the console is blank.

## When To Use It

Use the serial console for:

- First boot and login
- Network discovery
- Firmware update logs
- Service startup validation
- Recovery when SSH is unavailable

## Troubleshooting

If the serial device is not visible, check that the cable is connected to the serial console port, the host operating system has permission to access the device, and no other terminal application already has the port open.


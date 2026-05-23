---
title: Configure MIPI Interfaces
description: Enable MIPI cameras on the Modalix DevKit using device-tree overlays.
sidebar_position: 4
---

# Configure MIPI Interfaces

:::note
Please install or upgrade `sima-cli` before continuing. This guide is intended for use with the latest `sima-cli` version.
:::

:::note
This procedure requires a host machine with the latest sima-cli version installed. It also requires the firmware version of the **Modalix Devkit** to be `1.7.0_master_B1965` or above. This is because this build has the necessary `.dtbo` files to support MIPI.
:::

The **Modalix DevKit** includes two MIPI Interfaces for connecting MIPI cameras as inputs to the device. The MIPI ports are located directly on the carrier board, and developers would need to follow the procedure below to enable them.

Before starting, make sure to attach a MIPI camera to one of the MIPI ports while the **Modalix Devkit** is off.

Once connected, connect a serial cable from a host machine to the **Modalix Devkit**. Afterwards, turn the **Modalix Devkit** on.

Then, establish a serial terminal with `sima-cli` and immediately enter `uboot` by pressing the any key during the 3 second countdown:

```console
sima-cli serial -b 115200
...
Hit any key to stop autoboot:  0
sima$
```

Once in uboot, set the `dtbos` variable to the appropriate **Device Tree Blob Overlay** (`.dtbo`) file. The correct file depends on the **carrier board**, **camera manufacturer**, **sensor type**, and **camera port**. Afterwards, save the environment and boot into the operating system.

The filename follows this pattern:

```text
modalix-som-<carrier_board>-<camera_manufacturer>-<sensor_type>-<port>CAM.dtbo
```

Select each component based on your hardware:

| Component | Values | Description |
| --- | --- | --- |
| Carrier Board | `connectech`, `seeedstudio`, `waveshare` | The carrier board model |
| Camera Manufacturer | `ARDU`, `ECON`, `LI` | Arducam, e-con Systems, or Leopard Imaging |
| Sensor Type | `IMX477`, `IMX568`, `IMX678`, `AR0234`, `OG05C10` | The camera sensor model |
| Port | `0CAM`, `1CAM`, `2CAM`, `3CAM`, `DUAL` | The MIPI port number the camera is connected to |

For example, a Connectech carrier board with a Leopard Imaging IMX477 sensor connected to port 0:

```console
sima$ setenv dtbos modalix-som-connectech-LI-IMX477-0CAM.dtbo ; saveenv ; boot
```

The full list of available `.dtbo` files is:

```text
modalix-som-connectech-ARDU-IMX477-0CAM.dtbo
modalix-som-connectech-ARDU-IMX477-1CAM.dtbo
modalix-som-connectech-ARDU-IMX477-2CAM.dtbo
modalix-som-connectech-ARDU-IMX477-3CAM.dtbo
modalix-som-connectech-ECON-IMX568-0CAM.dtbo
modalix-som-connectech-ECON-IMX568-1CAM.dtbo
modalix-som-connectech-ECON-IMX568-2CAM.dtbo
modalix-som-connectech-ECON-IMX568-3CAM.dtbo
modalix-som-connectech-ECON-IMX678-0CAM.dtbo
modalix-som-connectech-ECON-IMX678-1CAM.dtbo
modalix-som-connectech-ECON-IMX678-2CAM.dtbo
modalix-som-connectech-ECON-IMX678-3CAM.dtbo
modalix-som-connectech-LI-AR0234-0CAM.dtbo
modalix-som-connectech-LI-AR0234-1CAM.dtbo
modalix-som-connectech-LI-AR0234-2CAM.dtbo
modalix-som-connectech-LI-AR0234-3CAM.dtbo
modalix-som-connectech-LI-OG05C10-0CAM.dtbo
modalix-som-connectech-LI-OG05C10-1CAM.dtbo
modalix-som-connectech-LI-OG05C10-2CAM.dtbo
modalix-som-connectech-LI-OG05C10-3CAM.dtbo
modalix-som-seeedstudio-ARDU-IMX477-0CAM.dtbo
modalix-som-seeedstudio-ARDU-IMX477-1CAM.dtbo
modalix-som-seeedstudio-ARDU-IMX477-2CAM.dtbo
modalix-som-seeedstudio-ECON-IMX568-0CAM.dtbo
modalix-som-seeedstudio-ECON-IMX568-1CAM.dtbo
modalix-som-seeedstudio-ECON-IMX568-2CAM.dtbo
modalix-som-seeedstudio-ECON-IMX678-0CAM.dtbo
modalix-som-seeedstudio-ECON-IMX678-1CAM.dtbo
modalix-som-seeedstudio-ECON-IMX678-2CAM.dtbo
modalix-som-seeedstudio-LI-AR0234-0CAM.dtbo
modalix-som-seeedstudio-LI-AR0234-1CAM.dtbo
modalix-som-seeedstudio-LI-AR0234-2CAM.dtbo
modalix-som-seeedstudio-LI-OG05C10-0CAM.dtbo
modalix-som-seeedstudio-LI-OG05C10-1CAM.dtbo
modalix-som-seeedstudio-LI-OG05C10-2CAM.dtbo
modalix-som-waveshare-ARDU-IMX477-1CAM.dtbo
modalix-som-waveshare-ARDU-IMX477-2CAM.dtbo
modalix-som-waveshare-ARDU-IMX477-DUAL.dtbo
modalix-som-waveshare-ECON-IMX568-1CAM.dtbo
modalix-som-waveshare-ECON-IMX568-2CAM.dtbo
modalix-som-waveshare-ECON-IMX678-1CAM.dtbo
modalix-som-waveshare-ECON-IMX678-2CAM.dtbo
modalix-som-waveshare-ECON-IMX678-DUAL.dtbo
modalix-som-waveshare-LI-AR0234-1CAM.dtbo
modalix-som-waveshare-LI-AR0234-2CAM.dtbo
modalix-som-waveshare-LI-AR0234-DUAL.dtbo
modalix-som-waveshare-LI-OG05C10-1CAM.dtbo
modalix-som-waveshare-LI-OG05C10-2CAM.dtbo
modalix-som-waveshare-LI-OG05C10-DUAL.dtbo
```

To validate the interfaces, connect the Modalix SOM to a display and login. Then, use libcamera to verify the connectivity with the camera with the Modalix.

1. List available cameras:

   ```console
   sima@modalix:~$ cam -l
   ```

2. Show different camera formats for camera 1:

   ```console
   sima@modalix:~$ cam -c 1 -I
   ```

3. Capture an image from camera 1:

   ```console
   sima@modalix:~$ rm -rf frame* && cam -c 1 --capture=1 -F -s pixelformat=NV12
   ```

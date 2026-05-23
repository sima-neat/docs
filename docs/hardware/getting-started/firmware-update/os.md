---
title: Operating Systems
description: Preloaded eLxr Linux on Modalix DevKits, with notes on Yocto conversion.
sidebar_position: 5
---

# Operating Systems

SiMa.ai Modalix DevKits run **eLxr Linux**, a Debian-derived distribution. Units shipped **after mid-December 2025** come with eLxr preloaded. Earlier Modalix units (shipped before mid-December 2025) are preloaded with Yocto and can be converted to eLxr following the [Convert to eLxr](/docs/hardware/reference/tech-notes/elxr-conversion) article.

## eLxr Linux

eLxr is a Debian-based OS engineered for a more flexible developer experience on the Modalix platform. It offers:

- Full Debian package management (`apt`)
- A richer user-space environment for development and debugging
- The ability to build and install tools directly on the device

## Benefits of eLxr on Modalix

Modalix users gain a more developer-friendly environment, including:

- Access to standard Debian packages
- Faster iteration without cross-compilation
- Simplified toolchain management
- A broader ecosystem of libraries and frameworks

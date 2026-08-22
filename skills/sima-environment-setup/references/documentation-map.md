# SiMa.ai Developer Center map

Route "where do I read about X?" with this map. Everything hangs off
https://developer.sima.ai in five pillars. The agent onboarding page (this
skill's source of truth) sits at the site root — rendered at `/agents`, raw
at `/agents.md` — because it spans the hardware and software pillars.

## Hardware — https://developer.sima.ai/hardware

DevKit bring-up and low-level interfaces (this docs repo).

| Topic | URL path |
| --- | --- |
| Getting started hub | `/hardware/getting-started/` |
| Serial console | `/hardware/getting-started/setup-serial` |
| Standalone mode (network, NVMe, MIPI) | `/hardware/getting-started/standalone-mode/` |
| PCIe mode (drivers, virtual network) | `/hardware/getting-started/pcie-mode/` |
| Firmware update / recovery | `/hardware/getting-started/firmware-update/` |
| Board specs (DevKit, PCIe card, EA kit) | `/hardware/devkit/modalix-devkit` |
| Glossary | `/hardware/reference/glossary` |

## Software — https://developer.sima.ai/software

The core (Neat framework) documentation.

| Section | Topic | URL path |
| --- | --- | --- |
| Getting Started | Neat SDK (dev environment) | `/software/getting-started/dev-environment/` |
| Getting Started | Neat Library / PyNeat | `/software/getting-started/neat-library/` |
| Getting Started | Version compatibility | `/software/getting-started/compatibility` |
| Model Preparation | Compile a Model | `/software/compile-a-model/` |
| Model Preparation | GenAI with LLiMa | `/software/genai-llima/` |
| Development | Develop Apps (Model/Graph/Run) | `/software/develop-apps/` |
| Development | Hello Neat! (minimal app) | `/software/develop-apps/hello-neat/minimal/` |
| Development | Tutorials | `/software/tutorials/` |
| Tools & Reference | Tools (sima-cli et al.) | `/software/tools/` |
| Tools & Reference | Model Zoo | `/software/tools/model-zoo/` |
| Tools & Reference | C++ API | `/software/reference/cppapi/` |
| Tools & Reference | Python API | `/software/reference/pythonapi/` |
| Tools & Reference | Troubleshooting | `/software/reference/troubleshooting/` |
| Release Notes | Per-release changes | `/software/release-notes/` |

Inside the Neat SDK container, `/neat-resources/core-src` and the installed
public headers are the authoritative API ground truth (see the
`neat-application-builder` skill).

## Examples — https://developer.sima.ai/examples

Neat Apps Portal; source at https://github.com/sima-neat/apps (detection,
segmentation, tracking, classification, depth, benchmarking, GenAI).

## Models

- Pre-compiled vision models: `sima-cli modelzoo -v <platform-version> get <model>`
- GenAI models: https://huggingface.co/simaai (pull with `llima pull`)

## Community — https://community.sima.ai

Developer Portal account (used by `sima-cli login`), forums, support.

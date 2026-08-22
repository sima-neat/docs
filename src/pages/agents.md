---
title: For AI Agents
description: One-page, copy-pasteable onboarding for coding agents — install sima-cli, authenticate, install the Palette Neat SDK and Model Compiler, connect a Modalix DevKit, compile a model, and build and run NEAT apps including GenAI.
---

<!--
  AGENT-FACING PAGE — plain CommonMark only. No MDX imports, JSX, or <Tabs>.
  Rendered at /agents (site root — it spans the hardware AND software pillars,
  so it does not live under /hardware); also served raw at /agents.md (and
  inlined into /llms.txt) by scripts/build-agent-raw.cjs, so it must stay
  valid standalone Markdown. Version strings use %key% tokens from
  src/versions.json.
-->

# For AI Agents

This page is the complete, self-contained onboarding path for the SiMa.ai development platform. An agent that reads this one page can install `sima-cli`, authenticate, install the Palette Neat software (SDK, Model Compiler, Neat Library), connect a Modalix DevKit, compile a model, and build and run applications — including GenAI.

Raw version of this page (no HTML): `https://developer.sima.ai/agents.md` · `https://developer.sima.ai/llms.txt`

## Agent contract

Execute the phases in order (or the subset from the decision matrix in Phase 0). Every phase ends with a **Verify** step — run it and confirm the expected result before moving on. If a Verify fails, consult Phase 9 (Troubleshooting) before retrying. Do not invent commands or versions not on this page; if something here fails, prefer `sima-cli <command> --help` over guessing.

**Collect these inputs from your human before starting:**

| Input | Needed for | Notes |
| --- | --- | --- |
| SiMa Developer Portal account | Phase 2 (`sima-cli login`) | Free account at [community.sima.ai](https://community.sima.ai) |
| Modalix DevKit IP address | Phases 3, 5, 7, 8 | DevKit must be powered, on the network, and on platform software %platform_version% (see Phase 0 preconditions) |
| Hugging Face token | Phase 8 only | Only for downloading open-source GenAI models from [huggingface.co/simaai](https://huggingface.co/simaai) |
| Target silicon | Phases 4, 6 | `modalix` (gen2, default) or legacy `mlsoc`/`davinci` (gen1) |

**Terminology.** *Palette Neat* is the SiMa.ai software development toolkit for building AI applications on Modalix: the **Neat SDK** (containerized dev environment), the **Neat Library** (C++/Python runtime, a.k.a. `neat`/`pyneat`), the **Model Compiler** (ONNX → MLA), and **LLiMa** (GenAI runtime). NEAT replaces the older Palette/MPK toolchain. Everything installs through one tool: `sima-cli`.

**Success definition:** `sima-cli` authenticated, Neat SDK shell reachable, and — depending on your goal — a model compiled to an MPK `.tar.gz` and/or one example application running on the DevKit.

## Phase 0 — Prerequisites and decision matrix

### Host requirements

| Host | Arch | Container runtime | Notes |
| --- | --- | --- | --- |
| Ubuntu 22.04 / 24.04 | x86_64 or aarch64 | Docker Engine | Primary path; this page assumes it |
| Windows 11 | x86_64 (WSL2) | Docker Engine in WSL | Run all Linux commands inside WSL |
| macOS 15.5+ | Apple Silicon | Colima | Model Compiler must be installed inside the Neat SDK |

Minimums: 4 CPU cores, 16 GB RAM, 100 GB free disk, Python ≥ 3.8, `sudo` access. GenAI **model compilation** needs far more: 128 GB RAM recommended, 512 GB disk preferred (running pre-compiled GenAI models on the DevKit does not).

### Decision matrix

| Goal | Run these phases |
| --- | --- |
| Full setup: compile a model and run an app on a DevKit | 0 → 7 |
| Compile a model only (no DevKit) | 0, 1, 2, 3, 4, 6 |
| Run a prebuilt example app on a DevKit | 0, 1, 2, 3, 5, 7 (use the Model Zoo fast path in Phase 6) |
| GenAI / LLiMa on a DevKit | 0, 1, 2, 5, 8 |
| Python-only development directly on the DevKit (PyNeat) | 0, 1, 2, 5 |

### DevKit preconditions (hardware bring-up)

The DevKit itself must already be set up — this page does not duplicate hardware bring-up. If any of these are missing, do them first:

- Serial console access: [Configure Serial Connection](/hardware/getting-started/setup-serial) (`sima-cli serial`, login `sima` / `edgeai`)
- DevKit on the network with a known IP: [Network Setup](/hardware/getting-started/standalone-mode/network) (`sima-cli network`)
- PCIe card instead of standalone DevKit: [Driver Installation](/hardware/getting-started/pcie-mode/driver-installation)
- DevKit platform software at %platform_version%: [Update with sima-cli](/hardware/getting-started/firmware-update/sima-cli) (`sima-cli update`)

**Verify:**

```bash
docker --version        # any recent Docker Engine
python3 --version       # >= 3.8
nproc                   # >= 4
free -g                 # >= 16 GB total
df -h .                 # >= 100 GB free
ping -c1 <DEVKIT_IP>    # DevKit reachable (skip if no DevKit)
```

## Phase 1 — Install sima-cli

`sima-cli` is the host-side CLI that installs and manages everything else (firmware, SDK, models, apps). Linux, macOS, or the DevKit itself:

```bash
curl -fsSL https://artifacts.neat.sima.ai/sima-cli/linux-mac.sh | bash
```

Windows (PowerShell):

```powershell
Invoke-WebRequest https://artifacts.neat.sima.ai/sima-cli/windows.bat -OutFile windows.bat
.\windows.bat
```

Alternatives: `pip install sima-cli` (PyPI, current release %sima_cli_version%), or the pin-capable installer `curl -fsSL https://artifacts.neat.sima.ai/sima-cli/install.py -o sima-cli-install.py && python3 sima-cli-install.py <tag-or-branch>`.

The installer creates a virtual environment at `~/.sima-cli/.venv` with the binary at `~/.sima-cli/.venv/bin/sima-cli`. Open a new shell after installing. Later, update with `sima-cli selfupdate`.

**Verify:**

```bash
sima-cli --version
# Expected: %sima_cli_version% or newer. If "command not found":
# export PATH="$HOME/.sima-cli/.venv/bin:$PATH"
```

## Phase 2 — Authenticate

Downloads of SDK images, models, and firmware require a SiMa Developer Portal account ([community.sima.ai](https://community.sima.ai)). Login is interactive — hand control to your human or relay the prompts:

```bash
sima-cli login
```

If you will pull open-source GenAI models (Phase 8), also authenticate Hugging Face — `huggingface-cli` is installed alongside `sima-cli`:

```bash
hf auth login   # paste the Hugging Face user access token
```

**Verify:** `sima-cli login` exits 0 (re-running it reports you are already logged in). Reset with `sima-cli logout`.

## Phase 3 — Install the Palette Neat SDK (development environment)

The Neat SDK is a containerized development environment (compilers, cross-toolchain, Neat Library headers, Insight visualization). One command installs it, and it prompts to pair your DevKit and to add the Model Compiler:

```bash
sima-cli neat install sdk@%sdk_channel%
```

This installs Neat SDK %sdk_version% (compatible with DevKit platform software %platform_version%). Answer the interactive prompts: DevKit IP for pairing (recommended — it also provisions the Neat Library and PyNeat on the DevKit) and Model Compiler installation (say yes if you plan to compile models; otherwise Phase 4 adds it later).

Enter the SDK shell, then start the `neat` helper to get your Insight URL:

```console
$ sima-cli sdk neat        # enter the Neat SDK container shell
$ neat                     # inside the SDK: prints the Insight URL, typically https://localhost:9900
```

Useful management commands: `sima-cli sdk ls` (list environments), `sima-cli sdk stop` / `start`, `sima-cli sdk remove` (uninstall), `neat update` (upgrade the Neat Library inside the container). VS Code users can attach with Dev Containers.

Legacy two-step flow (only for the older SDK 2.0.0 line): `sima-cli install ghcr:sima-neat/sdk:v2.0.0` then `sima-cli sdk setup [--devkit <DEVKIT_IP>]`.

Go deeper: [Neat SDK documentation](https://developer.sima.ai/software/getting-started/dev-environment/).

**Verify:** `sima-cli sdk neat` drops you into a container shell; inside it `neat` prints an Insight URL and `https://localhost:9900` responds in a browser.

## Phase 4 — Install the Model Compiler

Skip this phase if you accepted the Model Compiler prompt in Phase 3, or if you only run pre-compiled models from the Model Zoo.

On the host (Ubuntu; pick `arm64` on aarch64 hosts — on macOS install inside the Neat SDK shell instead):

```bash
sima-cli install -v %platform_version% tools/model-compiler/amd64
activate-model-compiler      # activates the compiler environment (deactivate-model-compiler to exit)
```

For the ModelSDK Python API (`afe` — load/quantize/compile programmatically), use the model container environment:

```bash
sima-cli sdk model                        # enter the Model Compiler container shell
sima-cli install sdk-extensions/model     # install the ModelSDK (afe + MLA toolchain)
```

Go deeper: [Compile a Model](https://developer.sima.ai/software/compile-a-model/).

**Verify:** after `activate-model-compiler` (or inside the model shell):

```bash
python3 -c "import afe; print('afe OK')"
```

## Phase 5 — Connect the Modalix DevKit

If you paired during Phase 3, this is already done — run the Verify below. Otherwise pair explicitly:

```bash
sima-cli sdk setup --devkit <DEVKIT_IP>
```

Pairing installs the Neat Library and a PyNeat virtual environment on the DevKit (at `~/pyneat`) and configures the `dk` helper inside the SDK shell for build-and-run-on-DevKit workflows.

Manual/standalone alternatives:

- Install or update the Neat Library directly on the DevKit: `sima-cli neat install core@%neat_core_version%` (run on the DevKit; installs under `/media/nvme`, provisions PyNeat at `~/pyneat` — activate with `source ~/pyneat/bin/activate`).
- Install the NEAT apps runtime on the DevKit (needed to run the example apps in Phase 7):

```bash
# on the DevKit
wget -O /tmp/install-neat-apps.sh https://apps.sima-neat.com/tools/install-neat-apps.sh
bash /tmp/install-neat-apps.sh main
```

DevKit SSH login is `sima` (default password `edgeai`). Discover devices on the local network with `sima-cli device discover`. Connectivity problems → [Network Setup](/hardware/getting-started/standalone-mode/network) and [Configure Serial Connection](/hardware/getting-started/setup-serial).

Go deeper: [Neat Library documentation](https://developer.sima.ai/software/getting-started/neat-library/).

**Verify:**

```bash
ssh sima@<DEVKIT_IP> 'source ~/pyneat/bin/activate && python3 -c "import pyneat; print(\"pyneat OK\")"'
```

## Phase 6 — Compile a model

**Fast path — skip compilation.** The Model Zoo has pre-compiled MPK packages for common models:

```bash
sima-cli modelzoo -v %platform_version% get <model-name>
# e.g. the default detection model used by the examples:
# yolo26m-det-bf16-mla_tess-b1.tar.gz
```

**Compile path** (inside the model environment from Phase 4, with `afe` available). The canonical pattern — see `examples/compile_first_model.py` in [github.com/sima-neat/model-sdk](https://github.com/sima-neat/model-sdk):

```bash
python3 examples/compile_first_model.py \
  --model resnet50.onnx \
  --calib_images ./calib_images \
  --device modalix \
  --output ./compiled_resnet50
```

Key facts for custom compile scripts: import from `afe.apis` (`load_model`, `onnx_source`); target `gen2_target` = `modalix`, `gen1_target` = legacy `mlsoc`/`davinci`; quantize INT8 by default or BF16 (`bfloat16_scheme()`, preferred on Modalix); ONNX inputs must have static shapes (run graph surgery/simplification first if the model has dynamic dims).

The output is an **MPK package** — a `.tar.gz` containing `.elf` (runs on the MLA accelerator), optional `.so` (runs on the Cortex-A65), `*_mpk.json` (pipeline metadata), and `*_mla_stats.yaml` (per-layer profiling). This `.tar.gz` is exactly what applications load as their model.

Go deeper: [Compile a Model](https://developer.sima.ai/software/compile-a-model/) · [Model Zoo](https://developer.sima.ai/software/tools/model-zoo/).

**Verify:**

```bash
tar tzf <output>/*_mpk.tar.gz    # lists .elf, *_mpk.json (and optionally .so, *.yaml) members
```

## Phase 7 — Build and run a NEAT application

Work inside the Neat SDK shell (`sima-cli sdk neat`). The examples live in [github.com/sima-neat/apps](https://github.com/sima-neat/apps) — detection, segmentation, tracking, classification, depth, benchmarking, GenAI.

```bash
git clone https://github.com/sima-neat/apps.git
cd apps
./build.sh --clean      # cross-compiles all C++ examples for aarch64 Modalix
```

Fetch the model the example expects (from its README `Metadata` table) into `assets/models/`:

```bash
mkdir -p assets/models
sima-cli modelzoo -v %platform_version% get yolo26m-det-bf16-mla_tess-b1
```

Edit the example's `src/common/config.yaml`: set `model.path` to the `.tar.gz` (yours from Phase 6 or the Model Zoo one), and the input source (e.g. an RTSP URL). Then run **on the DevKit** (binaries and sources synced via the SDK's `dk` helper, or copy them over):

```bash
# C++ (on the DevKit)
./build/examples/object-detection/single-stream-object-detector/single-stream-object-detector \
  --config examples/object-detection/single-stream-object-detector/src/common/config.yaml

# Python (on the DevKit)
source ~/pyneat/bin/activate
pip install -r examples/object-detection/single-stream-object-detector/src/python/requirements.txt
python3 examples/object-detection/single-stream-object-detector/src/python/main.py \
  --config examples/object-detection/single-stream-object-detector/src/common/config.yaml
```

Shortcuts:

- Single example without cloning the repo: `curl -fsSL https://raw.githubusercontent.com/sima-neat/apps/main/scripts/get-example.sh | bash -s -- <example-name>`
- Need an RTSP test source? `sima-cli install gh:sima-ai/tool-mediasources` then `./mediasrc.sh <video-dir>`
- View live output (video + detection overlay) in **Insight** — the URL printed by `neat` in Phase 3.

Writing your own application (Model/Graph/Run C++ or PyNeat APIs) is beyond this page: start with [Develop Apps](https://developer.sima.ai/software/develop-apps/), the minimal [Hello Neat!](https://developer.sima.ai/software/develop-apps/hello-neat/minimal/) example, the [Tutorials](https://developer.sima.ai/software/tutorials/), and the [C++](https://developer.sima.ai/software/reference/cppapi/) / [Python](https://developer.sima.ai/software/reference/pythonapi/) API references. If the `neat-application-builder` skill is installed (`sima-cli playbooks`), use it.

**Verify:** `./build.sh` exits 0; the app runs on the DevKit and prints detections (or they appear in Insight).

## Phase 8 — GenAI with LLiMa

LLiMa is the on-device GenAI runtime (LLM / VLM / ASR). Install it on the DevKit:

```bash
# on the DevKit
sima-cli neat install llima
```

Get and run models (pre-compiled zoo at [huggingface.co/simaai](https://huggingface.co/simaai); stored under `/media/nvme/llima/models`):

```bash
llima search                      # browse available models
llima pull <model-name>           # download
llima list                        # show local models
llima run <model-dir> --mode cli  # interactive chat; --mode web for a browser UI
```

GenAI example apps (voice/vision assistants with OpenAI-compatible serving) live in the apps repo and ship `setup.sh` / `run.sh`:

```bash
curl -fsSL https://raw.githubusercontent.com/sima-neat/apps/main/scripts/get-example.sh | bash -s -- multimodal-assistant
cd multimodal-assistant && ./setup.sh && ./run.sh
```

Compiling your **own** GenAI model (rather than pulling a pre-compiled one) requires the Model Compiler host specs from Phase 0 (128 GB RAM recommended).

Go deeper: [GenAI with LLiMa](https://developer.sima.ai/software/genai-llima/).

**Verify:** `llima list` shows the pulled model; `llima run <model-dir> --mode cli` answers a prompt.

## Phase 9 — Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `sima-cli: command not found` | venv not on PATH | `export PATH="$HOME/.sima-cli/.venv/bin:$PATH"` (add to shell rc) |
| `sima-cli login` fails | wrong/expired portal credentials | `sima-cli logout && sima-cli login`; account at community.sima.ai |
| Docker `permission denied` | user not in `docker` group | `sudo usermod -aG docker $USER`, then log out/in |
| SDK install prompts hang in automation | installer is interactive | run pairing/compiler steps manually; keep a human in the loop for Phase 3 |
| DevKit unreachable | network / firmware mismatch | [Network Setup](/hardware/getting-started/standalone-mode/network); update firmware to %platform_version% via [sima-cli update](/hardware/getting-started/firmware-update/sima-cli) |
| Compile killed / OOM | insufficient RAM (esp. GenAI) | see Phase 0 host specs; 128 GB for GenAI compiles |
| Model loads but wrong outputs | compiled for wrong silicon | recompile with `--device modalix` (`gen2_target`); `mlsoc` is gen1 |
| Insight URL not loading | `neat` helper not running | re-enter `sima-cli sdk neat`, run `neat` again |
| Model download 403/404 | not logged in, wrong `-v` | `sima-cli login`; use `-v %platform_version%` |

Deeper software troubleshooting: [developer.sima.ai/software/reference/troubleshooting](https://developer.sima.ai/software/reference/troubleshooting/). Diagnose environments with `sima-cli sdk doctor`.

## Phase 10 — Documentation map (the SiMa.ai Developer Center)

Everything lives under [developer.sima.ai](https://developer.sima.ai), organized in five pillars. Use this map to route any question this page doesn't answer.

### Hardware — this site ([developer.sima.ai/hardware](https://developer.sima.ai/hardware))

| Page | Use when |
| --- | --- |
| [Getting Started](/hardware/getting-started/) | first-time DevKit bring-up hub |
| [Configure Serial Connection](/hardware/getting-started/setup-serial) | console access, cabling, `sima-cli serial` |
| [Standalone Mode](/hardware/getting-started/standalone-mode/) | network, NVMe storage, MIPI cameras |
| [PCIe Mode](/hardware/getting-started/pcie-mode/) | host card install, drivers, virtual network |
| [Firmware Update](/hardware/getting-started/firmware-update/) | `sima-cli update`, net-boot recovery, boot images |
| [DevKit Variants](/hardware/devkit/modalix-devkit) | board specs and interfaces (DevKit, PCIe card, EA kit) |
| [Glossary](/hardware/reference/glossary) | MLA, MPK, NEAT, BSP definitions |

### Software — core documentation ([developer.sima.ai/software](https://developer.sima.ai/software))

| Section | Page | Use when |
| --- | --- | --- |
| Getting Started | [Neat SDK](https://developer.sima.ai/software/getting-started/dev-environment/) | installing/configuring the dev environment, DevKit sync |
| Getting Started | [Neat Library](https://developer.sima.ai/software/getting-started/neat-library/) | runtime install/update, PyNeat, the `neat` CLI |
| Getting Started | [Compatibility](https://developer.sima.ai/software/getting-started/compatibility) | which SDK ↔ DevKit ↔ library versions work together |
| Model Preparation | [Compile a Model](https://developer.sima.ai/software/compile-a-model/) | quantization, compilation, graph surgery, accuracy validation |
| Model Preparation | [GenAI with LLiMa](https://developer.sima.ai/software/genai-llima/) | LLM/VLM/ASR setup, compile, and serving |
| Development | [Develop Apps](https://developer.sima.ai/software/develop-apps/) | Model / Graph / Run programming model |
| Development | [Hello Neat!](https://developer.sima.ai/software/develop-apps/hello-neat/minimal/) | smallest working application |
| Development | [Tutorials](https://developer.sima.ai/software/tutorials/) | numbered walkthroughs, first model → GenAI composition |
| Tools & Reference | [Tools](https://developer.sima.ai/software/tools/) | sima-cli reference, SDK networking, utilities |
| Tools & Reference | [Model Zoo](https://developer.sima.ai/software/tools/model-zoo/) | pre-compiled models, `sima-cli modelzoo` |
| Tools & Reference | [C++ API](https://developer.sima.ai/software/reference/cppapi/) | `simaai::neat` reference |
| Tools & Reference | [Python API](https://developer.sima.ai/software/reference/pythonapi/) | `pyneat` reference |
| Tools & Reference | [Troubleshooting](https://developer.sima.ai/software/reference/troubleshooting/) | SDK/network diagnostics and rollback |
| — | [Release Notes](https://developer.sima.ai/software/release-notes/) | what changed per release |

Inside the Neat SDK container, the packaged core source at `/neat-resources/core-src` and the installed public headers are the authoritative API ground truth.

### Examples, Models, Community

| Pillar | Where | Use when |
| --- | --- | --- |
| Examples | [developer.sima.ai/examples](https://developer.sima.ai/examples) · [github.com/sima-neat/apps](https://github.com/sima-neat/apps) | runnable reference apps: detection, segmentation, tracking, GenAI, benchmarking |
| Models | [huggingface.co/simaai](https://huggingface.co/simaai) · `sima-cli modelzoo` | pre-compiled GenAI and vision models |
| Community | [community.sima.ai](https://community.sima.ai) | developer portal account, forums, support |

## Phase 11 — Command reference

```bash
# ---- Phase 1: install ----
curl -fsSL https://artifacts.neat.sima.ai/sima-cli/linux-mac.sh | bash
sima-cli --version
sima-cli selfupdate

# ---- Phase 2: auth ----
sima-cli login
sima-cli logout
hf auth login                                    # Hugging Face (GenAI only)

# ---- Phase 3: Neat SDK ----
sima-cli neat install sdk@%sdk_channel%          # install SDK %sdk_version%
sima-cli sdk neat                                # enter SDK shell
neat                                             # (inside SDK) Insight URL
sima-cli sdk ls|start|stop|remove|doctor

# ---- Phase 4: Model Compiler ----
sima-cli install -v %platform_version% tools/model-compiler/amd64
activate-model-compiler
sima-cli sdk model                               # model container shell
sima-cli install sdk-extensions/model            # ModelSDK (afe)

# ---- Phase 5: DevKit ----
sima-cli sdk setup --devkit <DEVKIT_IP>
sima-cli device discover
sima-cli neat install core@%neat_core_version%   # Neat Library on the DevKit
source ~/pyneat/bin/activate                     # PyNeat venv (on DevKit)

# ---- Phase 6: models ----
sima-cli modelzoo -v %platform_version% get <model>
python3 examples/compile_first_model.py --model m.onnx --calib_images ./imgs --device modalix --output ./out

# ---- Phase 7: apps ----
git clone https://github.com/sima-neat/apps.git && cd apps && ./build.sh --clean
curl -fsSL https://raw.githubusercontent.com/sima-neat/apps/main/scripts/get-example.sh | bash -s -- <example>

# ---- Phase 8: GenAI ----
sima-cli neat install llima
llima search|pull|list|rm
llima run <model-dir> --mode cli|web

# ---- Hardware (documented on this site) ----
sima-cli serial            # serial console
sima-cli network           # DevKit IP config
sima-cli update            # firmware update
sima-cli install drivers/linux
sima-cli nvme format|remount
```

All `sima-cli` top-level commands: `appzoo`, `bootimg`, `device`, `download`, `install`, `login`, `logout`, `mla`, `modelzoo`, `neat`, `network`, `nvme`, `packages`, `playbooks`, `sdcard`, `sdk`, `selfupdate`, `serial`, `update`. Use `sima-cli <command> --help` for flags.

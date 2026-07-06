---
name: sima-environment-setup
description: Use when setting up a SiMa.ai development environment from scratch — installing sima-cli, authenticating to the SiMa Developer Portal, installing the Palette Neat SDK and Model Compiler, pairing a Modalix DevKit, compiling a model to an MPK package, and building or running NEAT C++/Python and GenAI/LLiMa applications. Do not use for Neat Library application design or API selection (use neat-application-builder), for hardware bring-up such as serial, network, or firmware procedures (follow the hardware docs), or for repository maintenance.
---

# SiMa Environment Setup

## Overview

Take a host (and optionally a Modalix DevKit) from zero to a working SiMa.ai
development environment. The single source of truth is the published agent
onboarding page — fetch it first and follow its numbered phases; it carries
the exact commands and the currently supported version pins:

- Raw (preferred): `https://developer.sima.ai/agents.md` or `https://developer.sima.ai/llms.txt`
- Rendered: `https://developer.sima.ai/agents`
- Local fallback when working inside the docs repo: `src/pages/agents.md`
  (note: the source contains unsubstituted `%key%` version tokens; values
  live in `src/versions.json`)

This skill encodes the workflow and guardrails; the page carries the commands.

## Workflow

1. Gather inputs from the human before running anything: SiMa Developer
   Portal credentials (community.sima.ai), the DevKit IP address (if a DevKit
   is in scope), a Hugging Face token (GenAI only), and the target silicon
   (default `modalix`).
2. Fetch the source of truth: `curl -fsSL https://developer.sima.ai/agents.md`.
3. Pick the phase subset from the page's decision matrix (Phase 0) that
   matches the stated goal. Do not run phases the goal does not need.
4. Execute the phases in order. Stop at every **Verify** block, run it, and
   confirm the expected result before continuing. Never skip verification.
5. `sima-cli login` and the SDK installer are interactive — hand those
   prompts to the human rather than trying to automate credentials.
6. On any failure, consult `references/troubleshooting.md`, then the page's
   Phase 9. Retry the failed Verify before moving on.
7. Before claiming success, run the end-state checks in
   `references/verification.md` for the phases you executed.
8. To route follow-up questions ("where do I read about X?"), use
   `references/documentation-map.md`.

## Defaults

- Target silicon `modalix` (gen2); `mlsoc`/`davinci` (gen1) only when the
  human says the hardware is the legacy generation.
- Primary host assumption: Ubuntu 22.04/24.04 x86_64 with Docker Engine.
- Install the SDK with `sima-cli neat install sdk@<channel>` using the channel
  named on the page; do not pin versions from memory.
- Everything installs through `sima-cli` — do not `docker pull` or `pip
  install` SiMa components directly unless the page says so.

## Boundaries

- Do not design application code or choose between Model/Graph/GenAI APIs —
  defer to the `neat-application-builder` skill and the Develop Apps docs.
- Do not perform hardware bring-up (serial cabling, network configuration,
  firmware flashing) beyond linking the human to the hardware pages the
  onboarding page references.
- Do not invent commands, package names, or version numbers from memory —
  always re-fetch the raw page.
- Do not claim success without the Verify results to show for it.

## References

- `references/verification.md`
- `references/troubleshooting.md`
- `references/documentation-map.md`

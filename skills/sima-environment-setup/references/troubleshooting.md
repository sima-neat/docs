# Troubleshooting

Ordered from most to least common. After every fix, re-run the failed Verify
from `verification.md` before proceeding. Deeper diagnostics:
`sima-cli sdk doctor` and
`https://developer.sima.ai/software/reference/troubleshooting/`.

## sima-cli: command not found

The installer puts the binary in a venv, not on the default PATH.

```bash
export PATH="$HOME/.sima-cli/.venv/bin:$PATH"
# persist it:
echo 'export PATH="$HOME/.sima-cli/.venv/bin:$PATH"' >> ~/.bashrc
```

On DevKits/containers the venv may instead be at `/data/sima-cli/.venv/bin`
or `/opt/sima-cli/.venv/bin`.

## Login failures / download 403

```bash
sima-cli logout && sima-cli login
```

Account is the SiMa Developer Portal (community.sima.ai). Model/firmware 404s
usually mean a wrong `-v <version>` flag — use the platform version from the
onboarding page.

## Docker: permission denied

```bash
sudo usermod -aG docker $USER
# then log out and back in (or `newgrp docker`)
```

## SDK installer hangs in automation

`sima-cli login`, `sima-cli neat install sdk@...`, and `sima-cli sdk setup`
are interactive (credentials, DevKit IP, compiler opt-in). Run them in a real
terminal with the human answering prompts; don't pipe input blindly.

## DevKit unreachable

1. `ping <DEVKIT_IP>`; if it fails, fix the network first:
   https://developer.sima.ai/hardware/getting-started/standalone-mode/network
   (or the serial console page to find the IP).
2. Confirm DevKit platform software matches the SDK (`sima-cli update`):
   https://developer.sima.ai/hardware/getting-started/firmware-update/sima-cli
3. SSH login is `sima` / default password `edgeai`.

## Compile killed / out of memory

Vision models need the base host spec; GenAI compiles need ~128 GB RAM and
large disk. Either move to a bigger host or pull a pre-compiled model
(`sima-cli modelzoo ... get`, or `llima pull` for GenAI).

## Model runs but outputs are wrong

Compiled for the wrong silicon generation. Modalix is `--device modalix`
(`gen2_target`); `mlsoc`/`davinci` is gen1. Recompile with the right target.

## ONNX model fails to compile

Dynamic/symbolic input shapes are the usual cause — make shapes static
(simplify the graph) before compiling. See the graph-surgery guide under
https://developer.sima.ai/software/compile-a-model/.

## Insight URL not loading

The `neat` helper inside the SDK shell serves it. Re-enter with
`sima-cli sdk neat`, run `neat`, and use the printed URL (self-signed cert —
accept the browser warning).

## SDK container broken / half-installed

```bash
sima-cli sdk doctor      # diagnose
sima-cli sdk remove      # last resort: remove and reinstall the SDK
```

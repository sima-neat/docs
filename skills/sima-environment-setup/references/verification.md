# Verification checklist

Run the checks for every phase you executed. Expected results are stated per
check; a miss means the phase is not done — go to `troubleshooting.md`.
Version numbers below say "or newer" deliberately: the authoritative pins are
on the onboarding page (`https://developer.sima.ai/agents.md`).

## Phase 0 — Host prerequisites

```bash
docker --version          # prints a version; docker daemon reachable (docker info exits 0)
python3 --version         # >= 3.8
nproc                     # >= 4
free -g                   # >= 16 GB total (128 GB for GenAI compiles)
df -h .                   # >= 100 GB free
```

## Phase 1 — sima-cli installed

```bash
sima-cli --version
```

- Prints the current release or newer. If `command not found`:
  `export PATH="$HOME/.sima-cli/.venv/bin:$PATH"` and re-check.

## Phase 2 — Authenticated

```bash
sima-cli login
```

- Exits 0; a second invocation reports the session is already active.
- GenAI only: `hf auth whoami` (or `huggingface-cli whoami`) shows the account.

## Phase 3 — Neat SDK

```bash
sima-cli sdk ls        # shows the installed Neat SDK environment
sima-cli sdk neat      # enters a container shell
```

- Inside the shell, `neat` prints an Insight URL (typically
  `https://localhost:9900`) and the URL responds in a browser.

## Phase 4 — Model Compiler / ModelSDK

```bash
# after activate-model-compiler, or inside `sima-cli sdk model`:
python3 -c "import afe; print('afe OK')"
```

## Phase 5 — DevKit paired

```bash
sima-cli device discover     # lists the DevKit
ssh sima@<DEVKIT_IP> 'source ~/pyneat/bin/activate && python3 -c "import pyneat; print(\"pyneat OK\")"'
```

## Phase 6 — Model compiled (or fetched)

```bash
tar tzf <path-to>*_mpk.tar.gz
```

- Archive lists `.elf` and `*_mpk.json` members (plus optional `.so`, `*.yaml`).

## Phase 7 — App built and running

- `./build.sh --clean` exited 0 in the Neat SDK shell.
- On the DevKit, the example runs with its `config.yaml` and prints
  detections (or the overlay appears in Insight).

## Phase 8 — GenAI / LLiMa

```bash
llima list                        # shows the pulled model
llima run <model-dir> --mode cli  # answers a prompt
```

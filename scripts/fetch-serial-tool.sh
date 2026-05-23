#!/usr/bin/env bash
# Fetch the Web Serial Console app from its source repo and stage it under
# static/tools/serial/ so it ships with the Docusaurus build.
#
# Mirrors the `serial-tool` target in the legacy Sphinx Makefile.
# Set SKIP_SERIAL_TOOL=1 to skip (uses whatever is already on disk).
# Override the source repo with SERIAL_REPO_URL=<git-url>.

set -euo pipefail

if [[ "${SKIP_SERIAL_TOOL:-0}" == "1" ]]; then
  echo "[fetch-serial-tool] SKIP_SERIAL_TOOL=1, leaving static/tools/serial/ untouched."
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SERIAL_REPO_URL="${SERIAL_REPO_URL:-git@bitbucket.org:sima-ai/apps-web-serial.git}"
DEST_DIR="$REPO_ROOT/static/tools/serial"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "[fetch-serial-tool] Cloning $SERIAL_REPO_URL ..."
if ! git clone --depth 1 "$SERIAL_REPO_URL" "$TMP_DIR/apps-web-serial" 2>&1; then
  echo "[fetch-serial-tool] WARNING: clone failed; keeping existing static/tools/serial/ contents."
  exit 0
fi

mkdir -p "$DEST_DIR"
rm -rf "$DEST_DIR"/*
cp "$TMP_DIR/apps-web-serial/index.html" "$DEST_DIR/"
cp -r "$TMP_DIR/apps-web-serial/media" "$DEST_DIR/"

echo "[fetch-serial-tool] Updated $DEST_DIR from $SERIAL_REPO_URL"

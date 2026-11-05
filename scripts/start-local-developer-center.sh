#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DOCS_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
WORKSPACE_ROOT="$(cd -- "${DOCS_ROOT}/.." && pwd)"
CORE_WEBSITE="${NEAT_CORE_WEBSITE:-${WORKSPACE_ROOT}/core/website}"

GATEWAY_PORT="${NEAT_GATEWAY_PORT:-3100}"
HARDWARE_PORT="${NEAT_HARDWARE_PORT:-3101}"
SOFTWARE_PORT="${NEAT_SOFTWARE_PORT:-3102}"
LOCAL_HOST="${NEAT_LOCAL_HOST:-localhost}"
LOCAL_ORIGIN="http://${LOCAL_HOST}:${GATEWAY_PORT}"

TEMP_DIR=""
HARDWARE_PID=""
SOFTWARE_PID=""
NGINX_PID=""
SKIP_BUILD=0

usage() {
  cat <<'EOF'
Usage: npm run start:developer-center -- [--skip-build]

Build and serve the Developer Center shell/Hardware docs and the sibling Core
Software docs behind a local nginx gateway.

Environment variables:
  NEAT_CORE_WEBSITE   Core website directory (default: ../core/website)
  NEAT_GATEWAY_PORT   Public gateway port (default: 3100)
  NEAT_HARDWARE_PORT  Internal shell/Hardware port (default: 3101)
  NEAT_SOFTWARE_PORT  Internal Core Software port (default: 3102)
  NEAT_LOCAL_HOST     Public hostname (default: localhost)

Options:
  --skip-build        Reuse existing build directories (they must already have
                      been built for the configured origin and base paths)
EOF
}

log() {
  printf '[developer-center] %s\n' "$*"
}

fail() {
  printf '[developer-center] Error: %s\n' "$*" >&2
  exit 1
}

cleanup() {
  local status=$?
  trap - EXIT INT TERM

  for pid in "${NGINX_PID}" "${SOFTWARE_PID}" "${HARDWARE_PID}"; do
    if [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}" 2>/dev/null || true
    fi
  done

  for pid in "${NGINX_PID}" "${SOFTWARE_PID}" "${HARDWARE_PID}"; do
    if [[ -n "${pid}" ]]; then
      wait "${pid}" 2>/dev/null || true
    fi
  done

  if [[ -n "${TEMP_DIR}" && -d "${TEMP_DIR}" ]]; then
    rm -rf -- "${TEMP_DIR}"
  fi

  exit "${status}"
}

trap cleanup EXIT INT TERM

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)
      SKIP_BUILD=1
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      usage >&2
      exit 2
      ;;
  esac
  shift
done

command -v npm >/dev/null 2>&1 || fail "npm is required."
command -v curl >/dev/null 2>&1 || fail "curl is required."
command -v nginx >/dev/null 2>&1 || fail "nginx is required (on macOS: brew install nginx)."

# Core requires Node 22.12+. Prefer Homebrew's keg-only Node 22 when the active
# shell still resolves an older global Node installation.
node_is_supported() {
  node -e '
    const [major, minor] = process.versions.node.split(".").map(Number);
    process.exit(major > 22 || (major === 22 && minor >= 12) ? 0 : 1);
  ' >/dev/null 2>&1
}

if ! command -v node >/dev/null 2>&1 || ! node_is_supported; then
  for node_prefix in /opt/homebrew/opt/node@22 /usr/local/opt/node@22; do
    if [[ -x "${node_prefix}/bin/node" ]]; then
      export PATH="${node_prefix}/bin:${PATH}"
      break
    fi
  done
fi

command -v node >/dev/null 2>&1 || fail "Node.js 22.12 or newer is required."
node_is_supported || fail "Node.js 22.12 or newer is required; found $(node --version)."

[[ -f "${DOCS_ROOT}/package.json" ]] || fail "Docs package.json was not found at ${DOCS_ROOT}."
[[ -f "${CORE_WEBSITE}/package.json" ]] || fail "Core website was not found at ${CORE_WEBSITE}. Set NEAT_CORE_WEBSITE to its location."
[[ -d "${DOCS_ROOT}/node_modules" ]] || fail "Run npm install in ${DOCS_ROOT} first."
[[ -d "${CORE_WEBSITE}/node_modules" ]] || fail "Run npm install in ${CORE_WEBSITE} first."

port_owner() {
  lsof -nP -iTCP:"$1" -sTCP:LISTEN 2>/dev/null || true
}

for port in "${GATEWAY_PORT}" "${HARDWARE_PORT}" "${SOFTWARE_PORT}"; do
  if [[ -n "$(port_owner "${port}")" ]]; then
    port_owner "${port}" >&2
    fail "Port ${port} is already in use. Stop that process or override the NEAT_*_PORT values."
  fi
done

TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/neat-developer-center.XXXXXX")"
HARDWARE_LOG="${TEMP_DIR}/hardware.log"
SOFTWARE_LOG="${TEMP_DIR}/software.log"
NGINX_LOG="${TEMP_DIR}/nginx.log"
NGINX_CONFIG="${TEMP_DIR}/nginx.conf"

if [[ "${SKIP_BUILD}" -eq 1 ]]; then
  [[ -f "${DOCS_ROOT}/build/index.html" ]] || fail "The shell/Hardware build is missing; run without --skip-build."
  [[ -f "${CORE_WEBSITE}/build/index.html" ]] || fail "The Core Software build is missing; run without --skip-build."
  grep -Fq '/software/assets/' "${CORE_WEBSITE}/build/index.html" \
    || fail "The Core Software build was not built for /software/. Run without --skip-build."
  log "Reusing existing build directories."
else
  log "Building shell and Hardware locales..."
  (
    cd "${DOCS_ROOT}"
    SYSDOC_URL="${LOCAL_ORIGIN}" \
    SYSDOC_BASE_URL=/ \
    npm exec -- docusaurus build
  )

  log "Building Core Software locales..."
  (
    cd "${CORE_WEBSITE}"
    DOCS_URL="${LOCAL_ORIGIN}" \
    DOCS_BASE_URL=/software/ \
    DOCS_DEVELOPER_CENTER_SHELL_BASE=/ \
    npm run build
  )
fi

log "Starting shell/Hardware on ${HARDWARE_PORT}..."
(
  cd "${DOCS_ROOT}"
  SYSDOC_URL="${LOCAL_ORIGIN}" \
  SYSDOC_BASE_URL=/ \
  npm run serve -- --host 127.0.0.1 --port "${HARDWARE_PORT}"
) >"${HARDWARE_LOG}" 2>&1 &
HARDWARE_PID=$!

log "Starting Core Software on ${SOFTWARE_PORT}..."
(
  cd "${CORE_WEBSITE}"
  DOCS_URL="${LOCAL_ORIGIN}" \
  DOCS_BASE_URL=/software/ \
  DOCS_DEVELOPER_CENTER_SHELL_BASE=/ \
  npm run serve -- --host 127.0.0.1 --port "${SOFTWARE_PORT}"
) >"${SOFTWARE_LOG}" 2>&1 &
SOFTWARE_PID=$!

wait_for_url() {
  local name=$1
  local url=$2
  local pid=$3
  local output_log=$4

  for _ in {1..120}; do
    if ! kill -0 "${pid}" 2>/dev/null; then
      printf '\n%s failed to start:\n' "${name}" >&2
      tail -50 "${output_log}" >&2 || true
      return 1
    fi
    if curl --fail --silent --output /dev/null "${url}"; then
      return 0
    fi
    sleep 0.25
  done

  printf '\nTimed out waiting for %s. Recent output:\n' "${name}" >&2
  tail -50 "${output_log}" >&2 || true
  return 1
}

wait_for_content() {
  local name=$1
  local url=$2
  local expected=$3
  local pid=$4
  local output_log=$5
  local response

  for _ in {1..40}; do
    if ! kill -0 "${pid}" 2>/dev/null; then
      printf '\n%s stopped before content validation:\n' "${name}" >&2
      tail -50 "${output_log}" >&2 || true
      return 1
    fi
    if response="$(curl --fail --silent "${url}")"; then
      if grep -Fq "${expected}" <<<"${response}"; then
        return 0
      fi
    fi
    sleep 0.25
  done

  printf '\n%s returned HTTP success but not the expected site content. Recent output:\n' "${name}" >&2
  tail -50 "${output_log}" >&2 || true
  return 1
}

wait_for_url "Shell/Hardware server" "http://127.0.0.1:${HARDWARE_PORT}/" "${HARDWARE_PID}" "${HARDWARE_LOG}"
wait_for_url "Core Software server" "http://127.0.0.1:${SOFTWARE_PORT}/software/getting-started/" "${SOFTWARE_PID}" "${SOFTWARE_LOG}"

cat >"${NGINX_CONFIG}" <<EOF
worker_processes 1;
pid ${TEMP_DIR}/nginx.pid;
error_log ${NGINX_LOG};

events {
  worker_connections 128;
}

http {
  access_log off;

  server {
    listen 127.0.0.1:${GATEWAY_PORT};
    server_name ${LOCAL_HOST};

    location = /software {
      return 302 /software/;
    }

    location ^~ /software/ {
      proxy_pass http://127.0.0.1:${SOFTWARE_PORT};
      proxy_set_header Host \$http_host;
      proxy_set_header X-Forwarded-Host \$http_host;
      proxy_set_header X-Forwarded-Proto \$scheme;
      proxy_redirect off;
    }

    location / {
      proxy_pass http://127.0.0.1:${HARDWARE_PORT};
      proxy_set_header Host \$http_host;
      proxy_set_header X-Forwarded-Host \$http_host;
      proxy_set_header X-Forwarded-Proto \$scheme;
      proxy_redirect off;
    }
  }
}
EOF

nginx -t -c "${NGINX_CONFIG}" >/dev/null
nginx -c "${NGINX_CONFIG}" -g 'daemon off;' &
NGINX_PID=$!

wait_for_url "nginx gateway" "${LOCAL_ORIGIN}/" "${NGINX_PID}" "${NGINX_LOG}"
wait_for_url "proxied Hardware docs" "${LOCAL_ORIGIN}/hardware/" "${NGINX_PID}" "${NGINX_LOG}"
wait_for_url "proxied Core Software docs" "${LOCAL_ORIGIN}/software/getting-started/" "${NGINX_PID}" "${NGINX_LOG}"
wait_for_content "proxied Core Software docs" "${LOCAL_ORIGIN}/software/getting-started/" '/software/assets/' "${NGINX_PID}" "${NGINX_LOG}"

log "Developer Center is ready: ${LOCAL_ORIGIN}/"
log "Hardware docs: ${LOCAL_ORIGIN}/hardware/"
log "Core Software docs: ${LOCAL_ORIGIN}/software/getting-started/"
log "Ukrainian Core docs: ${LOCAL_ORIGIN}/software/uk/getting-started/"
log "Press Ctrl+C to stop all three processes."

wait "${NGINX_PID}"

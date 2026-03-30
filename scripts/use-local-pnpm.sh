#!/usr/bin/env bash
set -euo pipefail

SOURCE_PATH="${BASH_SOURCE[0]}"
ROOT_DIR="$(cd -- "$(dirname -- "$SOURCE_PATH")/.." && pwd)"
LOCAL_NPM_CACHE="$ROOT_DIR/.npm-cache"

export PATH="$ROOT_DIR/scripts/bin:$PATH"
export NPM_CONFIG_CACHE="$LOCAL_NPM_CACHE"
export npm_config_cache="$LOCAL_NPM_CACHE"

hash -r

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  printf '%s\n' "Source this file to keep the workspace pnpm wrapper on PATH:" >&2
  printf '  source %s\n' "$ROOT_DIR/scripts/use-local-pnpm.sh" >&2
fi

#!/usr/bin/env bash
set -euo pipefail

SOURCE_PATH="${BASH_SOURCE[0]}"
ROOT_DIR="$(cd -- "$(dirname -- "$SOURCE_PATH")/.." && pwd)"

export PATH="$ROOT_DIR/.tools/node_modules/.bin:$PATH"
export NPM_CONFIG_CACHE="$ROOT_DIR/.cache/npm"

hash -r

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  printf '%s\n' "Source this file to keep the workspace pnpm on PATH:" >&2
  printf '  source %s\n' "$ROOT_DIR/scripts/use-local-pnpm.sh" >&2
fi

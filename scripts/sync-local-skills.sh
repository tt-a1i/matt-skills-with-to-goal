#!/usr/bin/env bash
set -euo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$repo/scripts/sync-local-skills.mjs" "$@"

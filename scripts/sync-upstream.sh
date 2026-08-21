#!/usr/bin/env bash
set -euo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: worktree must be clean before syncing upstream" >&2
  exit 1
fi

branch="$(git branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "error: upstream sync requires a named local branch" >&2
  exit 1
fi

git fetch --prune upstream main --tags

base="$(git merge-base HEAD upstream/main)"
if ! git merge-base --is-ancestor "$base" upstream/main; then
  echo "error: upstream history no longer descends from merge base $base" >&2
  exit 1
fi

if [[ "$base" == "$(git rev-parse upstream/main)" ]]; then
  echo "already based on current upstream/main"
  exit 0
fi

stamp="$(date +%Y%m%d-%H%M%S)"
backup_branch="backup/upstream-sync-$stamp"
git branch "$backup_branch" HEAD
echo "backup branch: $backup_branch"

git rebase --onto upstream/main "$base" "$branch"
npm run check-plugin-version
npm run lint:skills
if command -v claude >/dev/null 2>&1; then
  claude plugin validate . --strict
fi

echo "rebased $branch onto upstream/main"
echo "run npm run sync:local after reviewing and committing any conflict-resolution changes"

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
if [[ "$branch" == "main" ]]; then
  echo "error: create a review branch from origin/main before syncing upstream" >&2
  exit 1
fi

git fetch origin main
git fetch upstream main

if ! git merge-base --is-ancestor origin/main HEAD; then
  echo "error: this branch does not contain current origin/main; start a review branch from origin/main" >&2
  exit 1
fi

if git merge-base --is-ancestor upstream/main HEAD; then
  echo "already includes current upstream/main"
  exit 0
fi

stamp="$(date +%Y%m%d-%H%M%S)"
backup_branch="backup/upstream-sync-$stamp"
git branch "$backup_branch" HEAD
echo "backup branch: $backup_branch"

if ! git merge --no-ff --no-commit upstream/main; then
  echo "merge stopped; inspect git status and resolve conflicts by intent" >&2
  echo "follow docs/maintaining-fork.md, run npm run check, then git commit" >&2
  exit 1
fi

echo "upstream merged for review; no commit or push was made"
echo "inspect git diff --cached --stat, then review files in batches using docs/maintaining-fork.md"
echo "run npm run check and finish with git commit after resolving fork metadata and behavior"

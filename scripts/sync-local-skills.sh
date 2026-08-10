#!/usr/bin/env bash
set -euo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
canonical_root="${AGENTS_SKILLS_ROOT:-$HOME/.agents_skills}"
hermes_sync="$canonical_root/agent-skills-manager/scripts/sync-hermes.sh"
stamp="$(date +%Y%m%d-%H%M%S)"
backup_root="$canonical_root/.bak-matt-sync-$stamp"

case "$canonical_root" in
  ""|"/"|"$HOME")
    echo "error: refusing unsafe AGENTS_SKILLS_ROOT: $canonical_root" >&2
    exit 1
    ;;
esac

mkdir -p "$canonical_root" "$backup_root"

seen_names=()
seen_paths=()
synced=0

while IFS= read -r -d '' skill_md; do
  source_dir="$(dirname "$skill_md")"
  name="$(basename "$source_dir")"
  target="$canonical_root/$name"

  for i in "${!seen_names[@]}"; do
    if [[ "${seen_names[$i]}" == "$name" ]]; then
      echo "error: duplicate skill name '$name' in $source_dir and ${seen_paths[$i]}" >&2
      exit 1
    fi
  done
  seen_names+=("$name")
  seen_paths+=("$source_dir")

  if [[ -L "$target" ]]; then
    echo "error: $target is a symlink; resolve it before syncing" >&2
    exit 1
  fi

  if [[ -d "$target" ]]; then
    cp -R "$target" "$backup_root/$name"
  fi

  mkdir -p "$target"
  rsync -a --delete "$source_dir/" "$target/"
  diff -qr "$source_dir" "$target" >/dev/null
  synced=$((synced + 1))
done < <(find "$repo/skills/engineering" "$repo/skills/productivity" -mindepth 2 -maxdepth 2 -name SKILL.md -print0)

if [[ -x "$hermes_sync" ]]; then
  bash "$hermes_sync"
else
  echo "warning: Hermes sync script not found at $hermes_sync" >&2
fi

echo "synced $synced promoted skills"
echo "backup: $backup_root"

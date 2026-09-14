# Maintaining the fork

This repository has two remotes with different jobs:

- `upstream` is `mattpocock/skills`, the source of upstream releases.
- `origin` is `tt-a1i/matt-skills-with-to-goal`, the publication target for this fork.

The maintained branch is an **overlay**: upstream history stays intact, and fork-specific workflow changes sit on top. A normal merge from the old `origin/main` is unsafe because that remote branch was created from an earlier unrelated flat history.

## Sync upstream

Start from a clean maintained branch and run:

```bash
npm run sync:upstream
```

The script fetches `upstream/main`, records a timestamped backup branch, and rebases every fork commit after the merge base onto the new upstream tip. If a conflict occurs, resolve it by intent and continue the rebase. The script never pushes.

After the rebase:

1. Review the complete overlay with `git diff upstream/main...HEAD`.
2. Update the upstream version and commit in `README.md` when they changed.
3. Keep `package.json` and `.claude-plugin/plugin.json` on the same fork version.
4. Run `npm run check-plugin-version`, `npm run lint:skills`, and `claude plugin validate . --strict`.
5. Run `npm run sync:local` after the repository state is accepted.

## Sync local agents

The machine-wide canonical source is `~/.agents_skills`. Claude Code, Codex, OpenCode, Pi, and `.agents` point to it. Hermes keeps a real copy. Use this fork's `sync:local` command for that layout; the inherited `scripts/link-skills.sh` helper belongs to the upstream developer layout and can replace canonical copies with repository symlinks.

Preview the selected files before applying an update:

```bash
npm run sync:local -- --dry-run
npm run sync:local
```

The command requires Node.js and uses only its standard library. It considers this repository's promoted Skills and refreshes only their selected Hermes counterparts. Unrelated Skills and excluded Skills are left intact. It never runs the machine-wide Hermes mirror script.

### Keep personal installation choices

Create `~/.agents_skills/.matt-sync-exclude` with one Skill name per line. Blank lines and `#` comments are allowed. For example, a user who no longer wants this repository to install its optional review Skill can save:

```text
# Keep this machine's native review workflow
code-review
```

Exclusions are local configuration, not changes to the public plugin catalog. An excluded Skill is neither installed nor updated; exclusion does not remove an existing copy. A one-run `--exclude NAME` flag is also available.

Use repeated `--only NAME` options to update a subset:

```bash
npm run sync:local -- --dry-run --only goal-crafter --only tdd
```

### Reconcile local changes

The first sync adopts copies that already match the repository. A differing installed copy without a recorded baseline is a conflict. Later runs compare against `.matt-sync-state.json` in each destination: repository updates can replace unchanged managed copies, while local edits block the entire batch before any Skill changes. A managed Skill removed locally remains absent until explicitly reinstalled.

For a conflict, reconcile the installed changes into the repository, exclude the Skill, or explicitly choose the repository version for that named Skill:

```bash
npm run sync:local -- --dry-run --only goal-crafter --replace-local goal-crafter
npm run sync:local -- --only goal-crafter --replace-local goal-crafter
```

`--replace-local NAME` applies to that Skill's selected canonical and Hermes copies. It also permits reinstalling a locally removed Skill. An excluded Skill must be removed from the exclusion list first. There is no blanket force option.

Changed directories are staged and checked before replacement. Previous copies are retained under `.bak-matt-sync-*` in each destination, and the command prints the backup paths. A failed update may leave earlier selected Skills updated; rerun the preview and reconcile any reported differences before continuing. To restore a Skill, preserve its current copy and copy the saved directory back, then preview before the next sync.

A `.matt-sync-lock` directory prevents overlapping sync runs. After an interrupted run, confirm no sync process remains before removing a leftover lock. Per-Skill checks also reject changes detected between planning and replacement.

### Alternate destinations and checks

- `AGENTS_SKILLS_ROOT` selects another canonical directory. With an alternate canonical root, the real Hermes installation is not touched unless `HERMES_SKILLS_ROOT` is explicitly provided.
- `HERMES_SKILLS_ROOT` selects a separate Hermes destination. With the default canonical root, an existing `~/.hermes/skills` is refreshed automatically.
- `--skip-hermes` limits the operation to canonical copies.
- `--dry-run` lists actions and changed file paths without creating directories, backups, locks, or state. Conflicts produce a nonzero exit status.
- `npm run test:sync-local` exercises the sync in temporary directories without touching installed Skills.

## Publish to the fork

Local `main` tracks `upstream/main` so `git pull` cannot accidentally merge the old flat `origin/main`. Publishing therefore requires an explicit destination.

The first publication of this rewritten history must preserve the old remote tip with a backup branch or tag, then replace `origin/main` using `--force-with-lease`. That is a one-time destructive remote operation and requires explicit user authorization at action time. Later pushes follow the normal fork history.

Never push to `upstream`.

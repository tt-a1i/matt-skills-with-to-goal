# Maintaining the fork

`upstream` is `mattpocock/skills`; `origin` is `tt-a1i/matt-skills-with-to-goal`.
Keep both histories and resolve changes against the published fork's intent. Historical local copies can have different designs; begin each sync from current `origin/main`.

## Inspect before syncing

Record the working directory, branch, HEAD and dirty files before choosing a checkout. Preserve unrelated work by using an independent worktree when necessary.

```bash
git status --short --branch
git rev-parse HEAD
git fetch origin main
git fetch upstream main
git log --oneline origin/main..upstream/main
git diff --stat origin/main...upstream/main
```

If the new commits only affect excluded experimental skills, report that finding instead of creating a sync. The fork excludes experimental `chief-of-staff`, upstream Issue automation and the generic workflows listed in `skills/deprecated/README.md`; its own Goal/Fork boundaries compose through artifacts, as described in [ADR 0004](../.agents/adr/0004-loosely-coupled-skills.md).

Read file lists and diff statistics first, then open the relevant files or hunks. If a result is truncated, narrow the next query by path or line range instead of requesting the entire output again.

## Prepare a review merge

From a clean checkout, create a new review branch based on the published fork:

```bash
git switch -c codex/sync-upstream-<date> origin/main
npm run sync:upstream
```

The script requires a clean named branch other than `main`, fetches both remotes, and verifies that the branch contains current `origin/main`. It creates a local backup branch and merges `upstream/main` with `--no-ff --no-commit`. Even a fast-forwardable update stays uncommitted for review. It never rebases, pushes, or refreshes local installs.

On conflicts, the script exits with the merge and working files intact. Inspect `git status`, compare each side's change and its primary source, and resolve each affected file by intent. Whole-file `ours`/`theirs` choices are appropriate only when the whole file belongs to that side; they are not a batch conflict-resolution strategy. Stage each resolution, review the batches below, then finish with `git commit`.

## Review and validate in batches

Use `git diff --cached --stat` and `git diff --cached --name-status` for the merge overview. Inspect unstaged resolutions with `git diff -- <path>` and staged results with `git diff --cached -- <path>`. Avoid one large mutation script spanning skills, metadata and docs; finish and check each batch before starting the next.

1. **Skills and catalogs:** reconcile skill directories, invocation metadata, README entries and plugin inventory. Preserve the curated default set; an upstream update does not re-promote archived skills. Run `npm run lint:skills`.
2. **Distribution metadata:** preserve the fork package/plugin identity; align versions and lockfile metadata; update the upstream baseline in README. Pending upstream changesets must name the fork package. Run `npm run check-plugin-version`. If changesets changed, install dependencies with `npm ci --ignore-scripts` and run `npx changeset status`.
3. **Human docs:** review each changed or conflicted skill beside `docs/<bucket>/<name>.md`. Check default versus optional output, required versus optional dependencies, accepted inputs, and permissions/external effects. Correct contradictory claims, such as a page promising mandatory HTML when the skill defaults to Markdown. A passing inventory lint checks file presence and wiring, not the meaning of prose.

When the sync explicitly promises to leave selected skills unchanged, compare those paths against the recorded fork baseline. This is a task-specific acceptance check, not a permanent hash lock on the core skills.

Before committing, run:

```bash
npm run check
npm run test:sync-upstream
git diff --cached --check
```

`check` reuses skill inventory, plugin-version and tracked Bash syntax checks. `test:sync-upstream` exercises real merges in temporary local repositories, without GitHub or global installs. PR and main-push CI run both commands. When plugin manifests change, also run `claude plugin validate . --strict` in an environment that has the CLI; CI does not claim this additional validation.

## Publish and merge

Commit the reviewed merge, push the review branch to `origin`, and open a PR against `main`. Report the tested commit and CI result separately from manual behavior/doc review. The [PR template](../.github/pull_request_template.md) records that review.

After explicit merge authorization, use a merge commit so upstream ancestry survives. Squash/rebase merges lose that ancestry. Normal syncs do not replace published history or require a force push. Never push to `upstream`.

The earlier history migration is recorded in [fork-history-migration.md](history/fork-history-migration.md); it is not a prerequisite for current syncs.

## Sync local agents

After the repository state is accepted and local distribution is requested, run:

```bash
npm run sync:local
```

The machine-wide canonical source is `~/.agents_skills`; Hermes keeps a real copy. The script backs up affected canonical skills under `.bak-matt-sync-<timestamp>`, updates this repository's promoted set, verifies each directory, then invokes the canonical Hermes sync script. It does not remove skills owned by other repositories. Preparing or merging a PR does not itself update installations. Previously installed archived skills are not automatically uninstalled by `sync:local`; their removal is a separate local action.

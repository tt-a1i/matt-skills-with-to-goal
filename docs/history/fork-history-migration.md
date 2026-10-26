# Historical fork migration

This records past history preparation, not the current sync procedure. Use [maintaining-fork.md](../maintaining-fork.md) for new work.

## September 2026

The maintained overlay was rebased onto upstream while retaining fork-owned workflow changes and distribution identity. The earlier publication instructions described backing up the old remote tip before a one-time, explicitly authorized replacement of its history. Those instructions do not apply to normal upstream-sync PRs.

## October 10, 2026

[PR #17](https://github.com/tt-a1i/matt-skills-with-to-goal/pull/17) used a guarded rebase as preparation. Its final integration commit `73035ba` retained published fork `7b44372` and upstream `49dd158` as parents; PR merge `d09351e` preserved both histories. The intermediate preparation was backed up locally.

Current syncs use an ordinary uncommitted merge on a review branch, avoiding the rebase and reconstructed integration-commit detour.

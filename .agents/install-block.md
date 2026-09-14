# The canonical install block

This fork has one public identity: `tt-a1i/matt-skills-with-to-goal`. Installation wording in `README.md`, changesets, and release material must use the commands below. Human-facing pages under `docs/` carry no install commands because their publishing surface supplies its own install widget.

## Claude Code — fork marketplace

This fork is not the `mattpocock-skills` package in Claude Code's official marketplace. Add the fork repository as its own marketplace, then install its distinct plugin name:

<canonical-block name="claude-code">

```bash
claude plugin marketplace add tt-a1i/matt-skills-with-to-goal
claude plugin install matt-skills-with-to-goal@tt-a1i
```

</canonical-block>

## Codex and other agents — skills.sh

[skills.sh](https://skills.sh/tt-a1i/matt-skills-with-to-goal) copies editable Skill files into a supported Agent Skills harness.

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add tt-a1i/matt-skills-with-to-goal
```

Choose only the Skills that solve the workflow boundary you need. Each Skill is independently installable; no setup or companion Skill is required unless its own documentation names a concrete tool dependency.

</canonical-block>

For one named Skill:

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add tt-a1i/matt-skills-with-to-goal --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

## Choose one installation route

The Claude plugin is a managed read-only bundle. `skills.sh` installs editable copies. Installing both can load the same Skill twice, so users choose one route.

## Maintainer installation

Repository maintainers with the unified `~/.agents_skills` architecture use:

```bash
npm run sync:local -- --dry-run
npm run sync:local
```

This is a local maintenance command, not the public install story. It previews changes, preserves local exclusions, and detects installed edits before updating selected promoted Skills and their Hermes copies. See [maintaining the fork](../docs/maintaining-fork.md) for exclusions, conflict resolution, and recovery.

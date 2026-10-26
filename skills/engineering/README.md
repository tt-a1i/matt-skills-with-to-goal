# Engineering

Skills I use daily for code work.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

- **[grill-with-docs](./grill-with-docs/SKILL.md)**: Grilling session that also builds your project's domain model, sharpening terminology and updating `GLOSSARY.md` and ADRs inline.
- **[triage](./triage/SKILL.md)**: Move issues through a state machine of triage roles.
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.md)**: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
- **[setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.md)**: Configure this repo for the engineering skills (issue tracker, triage labels, domain doc layout). Run once per repo.
- **[to-spec](./to-spec/SKILL.md)**: Turn the current conversation into a spec and publish it to the issue tracker.
- **[to-tickets](./to-tickets/SKILL.md)**: Break any plan, spec, or conversation into a set of tracer-bullet tickets, each declaring its blocking edges, whether as text in a local file or as native blocking links on a real tracker.
- **[wayfinder](./wayfinder/SKILL.md)**: Plan a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets on the issue tracker, resolved one at a time until the way to the destination is clear.
- **[retro](./retro/SKILL.md)**: Suggest improvements to the coding agent's environment (navigation, automated checks, coding standards, steering files, tooling) after a session, most severe first.

- **[to-goal](./to-goal/SKILL.md)** — *(fork addition)* Compile approved evidence from any planning source into a portable, verifiable execution goal. Read-only: it never implements, mutates a tracker, or creates a branch.

- **[roundtable](./roundtable/SKILL.md)** — Convene parallel sub-agents that debate a decision from opposed perspectives — independent statements, anonymous cross-review, then a chaired verdict preserving consensus and dissent.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[domain-modeling](./domain-modeling/SKILL.md)**: Actively build and sharpen a project's domain model by challenging terms, stress-testing with scenarios, and updating `GLOSSARY.md` and ADRs inline.
- **[pr](./pr/SKILL.md)**: The shape a pull request body should take: a summary as the smallest visual that makes the change clear, before/after evidence that it works, and a merge-danger call (one-way or two-way door, plus blast radius).
- **[wizard](./wizard/SKILL.md)**: Generate an interactive bash wizard that walks a human through steps only they can perform: provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover.

- **[execute-spec-in-fork](./execute-spec-in-fork/SKILL.md)** — *(fork addition)* Orchestrate approved, bounded work through a same-directory Codex App fork, return decisions and evidence, then archive a valid completion.

- **[spec-executor](./spec-executor/SKILL.md)** — *(fork addition)* Execute an approved, bounded source in an isolated thread against its baseline and permission boundary, then return a `SPEC EXECUTION RECEIPT`.

- **[goal-crafter](./goal-crafter/SKILL.md)** — *(fork addition)* Draft a concise goal from an idea; clarify only missing decisions and preserve approved evidence.

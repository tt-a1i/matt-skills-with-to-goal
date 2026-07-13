---
name: to-goal
description: Turn an approved spec, agent-ready ticket, tracker frontier, or partially implemented ticket into a verifiable execution goal without re-interviewing the user. Use after to-tickets or triage, before starting a fresh implementation session; use --all only for an explicitly requested cross-ticket goal.
disable-model-invocation: true
---

# To Goal

Compile existing planning and repository evidence into an execution goal. Do not implement, mutate the tracker, create a branch, or modify files.

## Source of truth

Read and follow `../goal-crafter/SKILL.md` before drafting. It owns the rules for verifiable goals and target-harness formatting. This skill owns only context gathering, frontier selection, and execution handoff. Do not duplicate or weaken `goal-crafter`'s completion-standard rules here.

## Accepted inputs

Resolve one of:

- no argument: inspect the configured tracker and select the current unblocked, agent-ready frontier ticket;
- a ticket number or URL: read that ticket in full;
- a parent spec issue: read the spec, sub-issues, and blocking graph, then select its current frontier;
- a local spec or ticket path: read the complete file and any directly referenced local planning document;
- `--all <parent>`: generate one dependency-ordered cross-ticket goal.

Always read ticket comments. For a tracker parent, use native sub-issue and dependency relationships when available; otherwise use explicit blocker text. Do not infer that a ticket is ready merely from its label.

If no argument yields several frontier tickets, list them and ask the user to choose one. Do not silently combine them. If a requested ticket is blocked, report its blockers and do not generate an implementation goal.

For a spec with no tickets, generate a goal directly only when the entire work fits one fresh context window. If it is multi-session work, route it through `to-tickets` instead of bypassing the context boundary.

## Gather current evidence

Before drafting:

1. Read the complete source spec and selected ticket, including acceptance criteria and comments.
2. Inspect the repository instructions and relevant design vocabulary.
3. Inspect the current branch, HEAD, worktree status, recent commits, and diff.
4. Compare current behavior and tests with every acceptance criterion.
5. Classify criteria as evidenced complete, demonstrably incomplete, or unverified. A commit message is not evidence.
6. Discover validation commands from the repository's own scripts, CI, documentation, and existing tests.
7. Preserve user-established permissions and workspace boundaries from the source context.

Keep this work read-only. Do not create status artifacts merely to build the goal.

## Select scope

Default to exactly one frontier ticket. The generated goal must fit one fresh context window and must not attract work from downstream blocked tickets.

For `--all`:

- preserve the complete dependency order;
- distinguish the current frontier from future work;
- carry forward partially completed work without treating it as done;
- warn that the goal requires a persistent harness capable of context renewal;
- never present `--all` as the normal Matt workflow.

## Recommend execution capacity

Classify the implementation session by required capability, not by a hard-coded model name. The recommendation must remain portable across Claude Code, Codex, Pi, and other coding agents.

Choose exactly one capability tier:

- **Lightweight**: bounded search, inventory, formatting, mechanical edits, or a small change following an established pattern with low failure cost.
- **Standard**: normal feature work, focused bug fixes, tests, or moderate multi-file changes with clear repository patterns. This is the default.
- **Advanced**: difficult root-cause analysis, cross-module design, security or authorization changes, schema/data migrations, concurrency, long-context synthesis, or work where a plausible mistake has high cost.

Choose exactly one reasoning intensity:

- **Low**: deterministic work with little ambiguity and cheap verification.
- **Medium**: some design judgment, multiple affected files, or non-trivial tests. This is the default.
- **High**: ambiguous behavior, interacting invariants, risky migrations, concurrency, security boundaries, or expensive failure modes.

Recommend the lowest tier and intensity that can reliably complete the ticket. Include one short evidence-based reason. Do not recommend a stronger tier merely because the ticket is large; prefer splitting work when it cannot fit one fresh context window.

Only name a concrete model when the target harness and its available model choices are known from current context. When naming one, present it as an optional mapping after the portable recommendation, not as the recommendation itself. Never assume a fixed set such as Luna, Terra, or Sol.

## Draft the goal

Use the harness format selected by `goal-crafter`. When the harness is not explicit, infer it from the invocation context; if that is impossible, emit a generic goal block that can be pasted into a fresh coding-agent session.

Include these sections:

- **Goal**: one ticket-scoped outcome;
- **Current state**: branch, HEAD, relevant dirty files, evidenced completed work, known gaps, and existing failures;
- **Execution order**: the shortest dependency-respecting path through the selected ticket;
- **Completion criteria**: inherit every ticket criterion without changing product decisions, split into independently checkable statements, and add tests, review, commit, and workspace-cleanliness gates;
- **Constraints**: scope exclusions, permissions, unrelated dirty-file protection, dependency policy, and external-action limits;
- **Context**: source ticket/spec, relevant design documents, agreed test seam, and commands or files to inspect first.

Default constraints unless the source context explicitly overrides them:

- do not push, open a pull request, merge, close issues, or edit tracker state;
- do not modify unrelated dirty or untracked files;
- do not implement downstream tickets early;
- use the pre-agreed test seam and test behavior rather than implementation details;
- run focused tests during development and the repository's broad validation at the end;
- run the applicable code-review flow before committing;
- commit only after all selected-ticket criteria pass.

If current implementation is partial, put verified finished work in **Current state** and every remaining gap in **Completion criteria**. Never hide a known gap or tell the next Agent to redo verified work.

## Deliver

Output only:

1. a short readiness note;
2. one copy-pasteable goal block;
3. a session recommendation containing:
   - fresh session or persistent goal loop;
   - capability tier: Lightweight, Standard, or Advanced;
   - reasoning intensity: Low, Medium, or High;
   - one sentence explaining the choice from observed task risk and complexity;
   - an optional concrete model mapping only when the execution environment is known.

Recommend a fresh session for ticket implementation after to-tickets or triage. The ticket, spec, branch, and HEAD carry the context; do not create a handoff document unless essential context exists only in the conversation and was never published.

For `--all`, explicitly label the goal as cross-context and recommend a persistent goal loop. For a single frontier ticket, recommend a normal fresh `/implement` or goal-loop session. Keep the recommendation portable: for example, say `Advanced + High` for an authorization migration with concurrency invariants, not `use Model X` unless Model X is known to be available.

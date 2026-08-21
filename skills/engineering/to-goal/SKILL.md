---
name: to-goal
description: Turn an approved spec, agent-ready ticket, tracker frontier, or partially implemented ticket into a verifiable execution goal without re-interviewing the user. Use after to-tickets or triage, before starting a fresh implementation session; use --all only for an explicitly requested cross-ticket goal.
disable-model-invocation: true
---

# To Goal

Compile existing planning and repository evidence into an execution goal. Do not implement, mutate the tracker, create a branch, or modify files.

## Source of truth

Read `../goal-crafter/SKILL.md` only for **compiled-handoff mode**, Phase 2 harness formats, Phase 3's four self-checks, and Special Rules (never re-interview; one verifiable condition per checkbox). Skip Phase 1 and Examples. This skill owns context gathering, frontier selection, readiness checks, and execution handoff. Do not reopen decisions already made by `to-spec`, `to-tickets`, or `triage`.

## Accepted inputs

Resolve one of:

- no argument: inspect the configured tracker and select the current unblocked, agent-ready frontier ticket;
- a ticket number or URL: read that ticket in full;
- a parent spec issue: read the spec, sub-issues, and blocking graph, then select its current frontier;
- a local spec or ticket path: read the complete file and any directly referenced local planning document (local tracker: `.scratch/<feature>/spec.md` and one file per ticket under `.scratch/<feature>/issues/<NN>-<slug>.md`);
- `--all <parent>`: generate one dependency-ordered cross-ticket goal.

Always read ticket comments. For a tracker parent, use native sub-issue and dependency relationships when available; otherwise use explicit blocker text. Do not infer that a ticket is ready merely from its label.

If no argument yields several frontier tickets, list them and ask the user to choose one. Do not silently combine them. If a requested ticket is blocked, report its blockers and do not generate an implementation goal.

For a spec with no tickets, generate a goal directly only when the entire work fits one fresh context window. If it is multi-session work, route it through `to-tickets` instead of bypassing the context boundary.

## Gather current evidence

Before drafting:

1. Read the complete source spec and selected ticket, including acceptance criteria and comments.
2. Inspect the repository instructions and relevant design vocabulary.
3. Inspect the current branch, HEAD, worktree status, recent commits, and diff. Record the pre-implementation HEAD as the code-review fixed point.
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

## Readiness checklist

This list is for this compiler; do not put it in the paste block.

Required propositions — tick every item before drafting. If any of these is unchecked, stop and do not invent a goal.

<readiness-checklist>

- [ ] Source is agent-ready: every required product decision and completion condition is in the evidence. If not, stop, name what is missing, and do not reopen a planning interview.
- [ ] Ticket is unblocked. If blocked, report the blockers only; do not generate an implementation goal.
- [ ] Exactly one frontier. If several, list them and ask the user to choose; do not silently combine them.
- [ ] Pre-implementation HEAD recorded as the code-review fixed point.
- [ ] Every acceptance criterion classified: evidenced complete / demonstrably incomplete / unverified.
- [ ] Validation commands discovered from the repository's scripts, CI, documentation, or existing tests.
- [ ] Permissions and workspace boundaries from the source context preserved.
- [ ] Every completion criterion independently decidable (`goal-crafter` Phase 3: no "looks good").

</readiness-checklist>

Conditional prohibitions — satisfied by default on the single-ticket path. Do not tick them; an unchecked item here is not a stop.

- If this run is not `--all`: skip. If it is `--all`: the user asked for it explicitly, and the goal is labeled cross-context.
- Spec with no tickets: compile a goal only when the entire work fits one fresh context window; otherwise route through `to-tickets`.

## Goal template

Required fields must be filled. Conditional fields appear only when they apply. Use the harness envelope from `goal-crafter` Phase 2. When the harness is not explicit, infer it from the invocation context; if that is impossible, emit this generic block so it can be pasted into a fresh coding-agent session. Current state, Execution order, and the prefilled constraints stay required even when the harness names fewer sections.

Unless the source context explicitly overrides a default constraint, keep that line verbatim. When it does override, rewrite that line and name the source.

If current implementation is partial, put verified finished work in **Current state** and every remaining gap in **Completion criteria**. Never hide a known gap or tell the next agent to redo verified work.

Inherit every ticket criterion without changing product decisions. Do not relist evidenced-complete work as to-do.

<!-- compiler: only when tests were skipped, add these two Completion criteria lines (do not include them by default; they are not an execution to-do):
- [ ] Tests skipped because: <reason>
- [ ] Residual risk: <risk>
-->

<goal-template>

## Goal

<one ticket-scoped outcome>

## Current state

- Branch:
- HEAD (review fixed point):
- Dirty / untracked files to protect:
- Evidenced complete:
- Known gaps:
- Existing failures:

## Execution order

<shortest dependency-respecting path through the selected ticket>

## Completion criteria

- [ ] <ticket criterion>
- [ ] Ran the smallest applicable validation: `<command>`
- [ ] Ran the applicable code-review flow against the recorded pre-implementation fixed point
- [ ] Commit only after all selected-ticket criteria pass and the source context or user authorizes a commit
- [ ] Workspace is clean except for this ticket's changes (unrelated dirty or untracked files untouched)

## Constraints

- do not push, open a pull request, merge, close issues, or edit tracker state
- do not modify unrelated dirty or untracked files
- do not implement downstream tickets early
- use the pre-agreed test seam and test behavior rather than implementation details
- always run the smallest applicable validation during development
- require broad or full validation only when repository gates demand it, the user explicitly requests it, or the change affects core logic, security, data consistency, concurrency, or a known bug regression
- for low-risk non-behavioral work, allow tests to be skipped only when there is no relevant test seam or non-test validation is sufficient; still require the smallest applicable validation, and require the execution report to state why tests were skipped and identify any residual risk
- run the applicable code-review flow against the recorded pre-implementation fixed point before committing
- commit only after all selected-ticket criteria pass and the source context or user authorizes a commit
- Validation breadth: smallest | full
  Reason:

## Context

- Source ticket / spec:
- Design docs:
- Agreed test seam:
- Inspect first (commands / files):

</goal-template>

## Deliver

Output only:

1. the ticked Readiness checklist — not part of the paste block;
2. the filled goal template, copy-pasteable;
3. the filled Session recommendation.

<session-recommendation>

- Session: fresh | persistent goal loop
- Capability: Lightweight | Standard | Advanced
- Intensity: Low | Medium | High
- Reason: <one sentence from observed task risk and complexity>
- Optional model mapping: <only when the target harness and its model choices are known>

</session-recommendation>

Recommend a fresh session that directly executes the goal after `to-tickets` or `triage`. The ticket, spec, branch, and recorded fixed point carry the context; do not send the fresh session back through an interview or create a handoff document unless essential context exists only in the conversation and was never published.

For `--all`, explicitly label the goal as cross-context and recommend a persistent goal loop. For a single frontier ticket, recommend a normal fresh implementation or goal-loop session. If the harness automatically invokes `/implement`, the goal remains the execution contract and `/implement` must not re-interview or restate it. Keep the recommendation portable: for example, say `Advanced + High` for an authorization migration with concurrency invariants, not `use Model X` unless Model X is known to be available.

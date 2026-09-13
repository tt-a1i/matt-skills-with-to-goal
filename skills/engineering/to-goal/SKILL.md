---
name: to-goal
description: Turn approved planning evidence or partially completed work into a portable, verifiable execution goal. Use when work needs to cross sessions, people, agents, or harnesses; no other skill or tracker setup is required.
disable-model-invocation: true
---

# To Goal

Compile existing planning and repository evidence into an execution goal. Do not implement, mutate the tracker, create a branch, or modify files.

## Source of truth

Treat the user's approved planning evidence as authoritative, regardless of whether it came from a conversation, spec, issue, document, or another skill. Do not reopen settled decisions. If the evidence is incomplete, name the missing decision instead of forcing the user through a particular planning workflow.

## Accepted inputs

Resolve one of:

- no argument: inspect the current conversation and repository for the latest approved, unblocked unit of work;
- a ticket number or URL: read that ticket in full;
- a parent spec issue: read the spec, sub-issues, and blocking graph, then select its current frontier;
- a local spec or ticket path: read the complete file and any directly referenced local planning document (local tracker: `.scratch/<feature>/spec.md` and one file per ticket under `.scratch/<feature>/issues/<NN>-<slug>.md`);
- `--all <parent>`: generate one dependency-ordered cross-ticket goal.

Always read ticket comments. For a tracker parent, use native sub-issue and dependency relationships when available; otherwise use explicit blocker text. Do not infer that a ticket is ready merely from its label.

If no argument yields several frontier tickets, list them and ask the user to choose one. Do not silently combine them. If a requested ticket is blocked, report its blockers and do not generate an implementation goal.

For work that does not fit one fresh context window, preserve its dependency order and produce either one bounded frontier goal or, only when explicitly requested, a cross-context `--all` goal. Suggest splitting without requiring a particular ticketing skill.

## Gather current evidence

Before drafting:

1. Read the complete approved source, including acceptance criteria, corrections, and directly linked decisions or comments.
2. Inspect the repository instructions and relevant design vocabulary.
3. Inspect the current branch, HEAD, worktree status, recent commits, and diff. Record the pre-implementation HEAD as the comparison baseline.
4. Compare current behavior and tests with every acceptance criterion.
5. Classify criteria as evidenced complete, demonstrably incomplete, or unverified. A commit message is not evidence.
6. Discover validation commands from the repository's own scripts, CI, documentation, and existing tests.
7. Preserve user-established permissions and workspace boundaries from the source context.

Keep this work read-only. Do not create status artifacts merely to build the goal.

## Select scope

Default to exactly one unblocked unit of work. When the source uses tickets, choose one frontier ticket. The generated goal must fit one fresh context window and must not attract downstream work.

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

Recommend the lowest tier and intensity that can reliably complete the selected work. Include one short evidence-based reason. Do not recommend a stronger tier merely because the work is large; prefer splitting when it cannot fit one fresh context window.

Only name a concrete model when the target harness and its available model choices are known from current context. When naming one, present it as an optional mapping after the portable recommendation, not as the recommendation itself. Never assume a fixed set such as Luna, Terra, or Sol.

## Readiness checklist

This list is for this compiler; do not put it in the paste block.

Required propositions — tick every item before drafting. If any of these is unchecked, stop and do not invent a goal.

<readiness-checklist>

- [ ] Source is agent-ready: every required product decision and completion condition is in the evidence. If not, stop, name what is missing, and do not reopen a planning interview.
- [ ] The selected unit of work is unblocked. If blocked, report the blockers only; do not generate an implementation goal.
- [ ] Exactly one bounded frontier is selected. If several are equally valid, list them and ask the user to choose; do not silently combine them.
- [ ] Pre-implementation HEAD recorded as the comparison baseline.
- [ ] Every acceptance criterion classified: evidenced complete / demonstrably incomplete / unverified.
- [ ] Validation commands discovered from the repository's scripts, CI, documentation, or existing tests.
- [ ] Permissions and workspace boundaries from the source context preserved.
- [ ] Every completion criterion is independently decidable from observable evidence; no subjective "looks good" conditions.

</readiness-checklist>

Conditional prohibitions — satisfied by default on the single-ticket path. Do not tick them; an unchecked item here is not a stop.

- If this run is not `--all`: skip. If it is `--all`: the user asked for it explicitly, and the goal is labeled cross-context.
- Work with no tickets: compile a goal directly when it fits one fresh context window; otherwise recommend a split without requiring a particular planning tool.

## Goal template

Required fields must be filled. Conditional fields appear only when they apply. Adapt the envelope to a known target harness; otherwise emit this generic block so it can be pasted into a fresh coding-agent session. Current state, Execution order, and the prefilled constraints stay required even when the harness names fewer sections.

Unless the source context explicitly overrides a default constraint, keep that line verbatim. When it does override, rewrite that line and name the source.

If current implementation is partial, put verified finished work in **Current state** and every remaining gap in **Completion criteria**. Never hide a known gap or tell the next agent to redo verified work.

Inherit every source criterion without changing product decisions. Do not relist evidenced-complete work as to-do.

<!-- compiler: only when tests were skipped, add these two Completion criteria lines (do not include them by default; they are not an execution to-do):
- [ ] Tests skipped because: <reason>
- [ ] Residual risk: <risk>
-->

<goal-template>

## Goal

<one bounded outcome>

## Current state

- Branch:
- HEAD (comparison baseline):
- Dirty / untracked files to protect:
- Evidenced complete:
- Known gaps:
- Existing failures:

## Execution order

<shortest dependency-respecting path through the selected work>

## Completion criteria

- [ ] <source criterion>
- [ ] Ran the smallest applicable validation: `<command>`
- [ ] Reviewed the final diff against the source criteria and recorded baseline
- [ ] Commit only after all selected criteria pass and the source context or user authorizes a commit
- [ ] Workspace is clean except for this ticket's changes (unrelated dirty or untracked files untouched)

## Constraints

- do not push, open a pull request, merge, close issues, or edit tracker state
- do not modify unrelated dirty or untracked files
- do not implement downstream work early
- use the agreed validation seam and prefer behavior evidence over implementation details
- always run the smallest applicable validation during development
- require broad or full validation only when repository gates demand it, the user explicitly requests it, or the change affects core logic, security, data consistency, concurrency, or a known bug regression
- for low-risk non-behavioral work, allow tests to be skipped only when there is no relevant test seam or non-test validation is sufficient; still require the smallest applicable validation, and require the execution report to state why tests were skipped and identify any residual risk
- review the final diff against the source criteria and recorded baseline before committing; use any available review tool only when it adds value
- commit only after all selected criteria pass and the source context or user authorizes a commit
- Validation breadth: smallest | full
  Reason:

## Context

- Approved source:
- Design docs:
- Agreed validation seam:
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

Recommend a fresh session that directly executes the goal. The source, branch, and recorded baseline carry the context; do not send the fresh session back through an interview or require a particular upstream skill.

For `--all`, explicitly label the goal as cross-context and recommend a persistent goal loop. For one bounded frontier, recommend a normal fresh implementation or goal-loop session. The goal remains the execution contract regardless of how the target agent implements it. Keep the recommendation portable: for example, say `Advanced + High` for an authorization migration with concurrency invariants, not `use Model X` unless Model X is known to be available.

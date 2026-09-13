## What it does

`spec-executor` implements one approved, bounded contract in an isolated execution conversation, then returns a compact receipt. It preserves the source, comparison baseline, validation seam, non-goals, and external-action permissions inherited at the boundary.

It does not rewrite the approved source into another long goal. The inherited planning evidence remains the [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source), while implementation logs stay in the execution conversation.

## When to reach for it

Type `/spec-executor`, or the agent reaches for it automatically when an isolated execution conversation contains an approved, bounded source and asks for implementation.

| Situation | Route |
|---|---|
| Approved work fits one implementation session in Codex App | Optionally run [execute-spec-in-fork](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/execute-spec-in-fork.md) |
| Same contract without Codex task orchestration | Fork manually and run `spec-executor` |
| Work requires several dependency-ordered slices | Split it with any suitable planning method |
| Context is noisy or must cross agents without history | Optionally compile a portable goal |
| Product decisions or the validation seam remain open | Clarify the source before execution |

## Prerequisites

The thread needs one explicitly approved source. The implementation repository and its starting baseline must be available, and the work must fit one reliable execution context.

## Lock, execute, receipt

The leading idea is the **execution lock**: before editing, the executor states the outcome, source, scope, validation seam, and external authority. It then implements against that fixed contract and reviews the final diff from the recorded baseline.

The closing `SPEC EXECUTION RECEIPT` reports each acceptance criterion with evidence, changed files, validation, review findings, remaining risks, final worktree state, and every external effect. It can also carry an optional `Goal / spec quality` label. The executor may leave that field blank; the planning thread or the user fills it after comparing the receipt with the actual diff. A blank label is not a failed completion.

## Common questions

**Why not use `implement` directly?**

`implement` is the general build path. `spec-executor` adds the fork contract, fixed-point review, explicit external authority, and a receipt designed to flow back to the planning thread.

**Does it create and archive the fork itself?**

No. In Codex App, [execute-spec-in-fork](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/execute-spec-in-fork.md) owns the task lifecycle and uses `spec-executor` inside the child. Other harnesses can keep using the manual fork-and-receipt route.

**Does invoking it authorize a commit, push, or deployment?**

No. It authorizes in-scope local implementation and validation only. Every external action needs authority from the approved source or a later user instruction.

**What if the work no longer fits one session?**

The executor preserves the worktree, returns a partial receipt, and routes the remaining work through tickets or a compiled goal instead of silently losing context.

**Does the executor have to grade the spec?**

No. `Goal / spec quality` is a retrospective label, not a completion condition. The executor may leave it blank; someone comparing the receipt with the actual diff fills it later.

## It's working if

- The executor names one approved source and one pre-implementation baseline.
- Every acceptance criterion returns with pass/fail evidence.
- Unrelated dirty files and downstream work remain untouched.
- The planning thread receives a concise receipt rather than implementation-log overflow.
- External effects are reported explicitly, including those not performed.

## Where it fits

`spec-executor` is a standalone execution-boundary tool. [execute-spec-in-fork](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/execute-spec-in-fork.md) can automate its lifecycle in Codex App; a portable goal is an optional alternative when work must cross contexts without inherited history. [ask-matt](https://aihero.dev/skills-ask-matt) remains an optional catalog.

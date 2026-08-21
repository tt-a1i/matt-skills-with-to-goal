## What it does

`spec-executor` implements the latest approved `SPEC READY` contract in a forked execution thread, then returns a compact receipt to the planning thread. It preserves the source spec, review fixed point, test seam, non-goals, and external-action permissions inherited at the fork.

It does not rewrite the approved spec into another long goal. The inherited planning conversation remains the [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source), while implementation logs stay in the execution thread.

## When to reach for it

Type `/spec-executor`, or the agent reaches for it automatically when a forked conversation contains a final `SPEC READY` block and asks for implementation.

| Situation | Route |
|---|---|
| Approved spec fits one implementation session in Codex App | Run [execute-spec-in-fork](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/execute-spec-in-fork.md) |
| Same contract without Codex task orchestration | Fork manually and run `spec-executor` |
| Spec requires several dependency-ordered slices | Use [to-tickets](https://aihero.dev/skills-to-tickets) |
| Context is noisy or must cross agents without history | Compile a `to-goal` handoff |
| Product decisions or the test seam remain open | Return to [to-spec](https://aihero.dev/skills-to-spec) |

## Prerequisites

The thread needs a final `SPEC READY` block or an explicitly identified approved spec. The implementation repository and its starting baseline must be available, and the spec must fit one reliable execution context.

## Lock, execute, receipt

The leading idea is the **execution lock**: before editing, the executor states the outcome, source, scope, validation seam, and external authority. It then implements against that fixed contract and reviews the final diff from the recorded baseline.

The closing `SPEC EXECUTION RECEIPT` reports each acceptance criterion with evidence, changed files, validation, review findings, remaining risks, final worktree state, and every external effect. It can also carry an optional `Goal / spec quality` label. The executor may leave that field blank; the planning thread or the user fills it after comparing the receipt with the actual diff. A blank label is not a failed completion.

## Common questions

**Why not use `implement` directly?**

`implement` is the general build path. `spec-executor` adds the fork contract, fixed-point review, explicit external authority, and a receipt designed to flow back to the planning thread.

**Does it create and archive the fork itself?**

No. In Codex App, [execute-spec-in-fork](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/execute-spec-in-fork.md) owns the task lifecycle and uses `spec-executor` inside the child. Other harnesses can keep using the manual fork-and-receipt route.

**Does invoking it authorize a commit, push, or deployment?**

No. It authorizes in-scope local implementation and validation only. Every external action needs authority from the final spec or a later user instruction.

**What if the work no longer fits one session?**

The executor preserves the worktree, returns a partial receipt, and routes the remaining work through tickets or a compiled goal instead of silently losing context.

**Does the executor have to grade the spec?**

No. `Goal / spec quality` is a retrospective label, not a completion condition. The executor may leave it blank; someone comparing the receipt with the actual diff fills it later.

## It's working if

- The executor names one final spec source and one pre-implementation fixed point.
- Every acceptance criterion returns with pass/fail evidence.
- Unrelated dirty files and downstream work remain untouched.
- The planning thread receives a concise receipt rather than implementation-log overflow.
- External effects are reported explicitly, including those not performed.

## Where it fits

`spec-executor` is the forked implementation step after [to-spec](https://aihero.dev/skills-to-spec). [execute-spec-in-fork](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/execute-spec-in-fork.md) automates that step in Codex App, while `to-goal` remains the portable route for noisier or longer work. Use [ask-matt](https://aihero.dev/skills-ask-matt) when choosing between them.

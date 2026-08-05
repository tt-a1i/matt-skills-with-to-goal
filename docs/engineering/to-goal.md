## What it does

`to-goal` compiles an approved spec, an agent-ready issue, or the current unblocked frontier into a verifiable execution goal for a fresh [session](https://www.aihero.dev/ai-coding-dictionary/session). It carries the current code state, execution order, completion criteria, constraints, and source context across the boundary.

It is read-only. It does not implement, change the issue tracker, create a branch, or reopen decisions that `to-spec`, `to-tickets`, or `triage` already settled.

## When to reach for it

You invoke this by typing `/to-goal` — the agent will not reach for it on its own.

| Situation | Route |
|---|---|
| One approved spec fits a coherent inherited conversation | Fork at `SPEC READY` and use `spec-executor` |
| Work crosses days, people, agents, or parallel sessions | Use `to-goal` on the current frontier |
| The conversation contains noisy or conflicting drafts | Use `to-goal` to compile only approved evidence |
| Several tickets must run in one renewing [harness](https://www.aihero.dev/ai-coding-dictionary/harness) | Use `/to-goal --all` explicitly |

## Prerequisites

The work needs an approved spec or agent-ready issue with observable acceptance criteria. A configured issue tracker from [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) is required when the source is not passed as a local path.

## The execution contract

The leading idea is the **frontier**: the unblocked slice that can finish in one fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) without absorbing downstream work. The goal records a review fixed point and converts every source criterion into a separately checkable completion condition.

Capability recommendations stay portable. They describe the lowest reliable tier and reasoning intensity rather than assuming a particular vendor or model name.

## Common questions

**Does this replace TDD or implementation planning?**

No. It preserves the agreed test seam and scope. The execution session still learns through implementation; the goal prevents it from guessing product intent or expanding beyond the issue.

**Why not put every ticket in one goal?**

One-ticket-per-context keeps the contract small enough to verify. `--all` is reserved for a persistent harness that can renew context while preserving dependency order.

**Does generating the goal authorize a push or deployment?**

No. Commit, push, pull request, deployment, tracker, production-data, and real-service permissions remain explicit and separate.

## It's working if

- A fresh agent can start from the goal without asking which spec, branch, or acceptance criteria apply.
- Every completion criterion has observable evidence and a clear done/not-done answer.
- Verified finished work is preserved while known gaps remain visible.
- The goal covers one frontier issue unless `--all` was explicitly requested.

## Where it fits

`to-goal` is a context-boundary chain step after [to-tickets](https://aihero.dev/skills-to-tickets) or [triage](https://aihero.dev/skills-triage), before a fresh implementation session. Use [ask-matt](https://aihero.dev/skills-ask-matt) when the correct route is unclear.

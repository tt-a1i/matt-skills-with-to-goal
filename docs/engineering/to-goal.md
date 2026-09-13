## What it does

`to-goal` compiles approved planning evidence or the current unblocked frontier into a verifiable execution goal for a fresh [session](https://www.aihero.dev/ai-coding-dictionary/session). The source may be a conversation, spec, issue, document, or partially completed repository state.

It is read-only. It does not implement, change an issue tracker, create a branch, or reopen settled decisions. No tracker setup or upstream Skill is required.

## When to reach for it

You invoke this by typing `/to-goal` — the agent will not reach for it on its own.

| Situation | Route |
|---|---|
| One approved source fits a coherent inherited conversation | Fork and optionally use `spec-executor` |
| Work crosses days, people, agents, or parallel sessions | Use `to-goal` on the current frontier |
| The conversation contains noisy or conflicting drafts | Use `to-goal` to compile only approved evidence |
| Several tickets must run in one renewing [harness](https://www.aihero.dev/ai-coding-dictionary/harness) | Use `/to-goal --all` explicitly |

## Prerequisites

The work needs an approved source with observable acceptance criteria. That source can live in the current conversation, a local document, an issue tracker, or the repository itself.

## The execution contract

The leading idea is the **frontier**: the unblocked slice that can finish in one fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) without absorbing downstream work. The goal records a review fixed point and converts every source criterion into a separately checkable completion condition.

Capability recommendations stay portable. They describe the lowest reliable tier and reasoning intensity rather than assuming a particular vendor or model name.

## Common questions

**Does this replace TDD or implementation planning?**

No. It preserves the agreed validation seam and scope. The execution session still learns through implementation; the goal prevents it from guessing product intent or expanding beyond the source.

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

`to-goal` is a standalone context-boundary tool before a fresh implementation session. Planning and ticketing Skills can produce useful input, but none is required. [ask-matt](https://aihero.dev/skills-ask-matt) remains an optional catalog, not an entry gate.

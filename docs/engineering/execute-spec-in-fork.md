## What it does

`execute-spec-in-fork` turns a final `SPEC READY` into a temporary Codex execution task: it forks the planning task, launches `spec-executor`, carries decisions back and forth, validates the returned receipt, and archives a clean completion.

It is an **event-driven execution channel**, not a background worker. The planning conversation remains the [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source); the fork inherits that source without making the planning task absorb implementation logs.

## When to reach for it

Type `/execute-spec-in-fork` when the current Codex App task has an approved spec that fits one implementation session. The agent also uses it to finish the lifecycle when that execution fork later returns a correlated Messenger event.

| Situation | Route |
|---|---|
| Final spec, coherent conversation, one execution session | Run `execute-spec-in-fork` |
| Same contract, but the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) cannot fork or message Codex tasks | Fork manually and run [spec-executor](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/spec-executor.md) |
| Several slices, parallel work, or delayed execution | Use [to-tickets](https://aihero.dev/skills-to-tickets) and [to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/to-goal.md) |
| Decisions remain unresolved | Return to [to-spec](https://aihero.dev/skills-to-spec) |

## Prerequisites

The current task needs a final `SPEC READY`, Codex App's native task tools, and the separately installed [Codex Task Messenger](https://github.com/tt-a1i/codex-task-messenger). The execution uses a same-directory fork, so the planning and execution tasks share one checkout.

## Harness dependency and fallback

The automatic loop is a Codex App adapter. Missing the native task tools or Messenger v2+, the skill refuses to simulate the transport and points at the manual fork plus [spec-executor](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/spec-executor.md) route. Task-API churn is paid in the capability map and, if needed, a rewrite of this adapter — not a cross-harness layer. Recorded in [ADR 0003](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/.agents/adr/0003-codex-app-fork-loop-is-an-adapter.md).

## One command, two tasks

The leading idea is the **execution channel**. One direct command establishes both ends before implementation starts:

```text
planning task → fork → Messenger Ask → spec-executor
planning task ← completed / needs-input / failed Reply
```

The post-fork Ask matters because a fork contains completed history only. The command that creates the fork is still running, so the child inherits the approved spec but needs a follow-up message telling it to begin and where to return the result.

## Lifecycle, not a daemon

| Event | What the workflow does |
|---|---|
| `completed` with a valid receipt | Presents evidence and archives the child |
| `needs-input` | Pins the child, asks in the planning task, then resumes the same child |
| `failed` or invalid receipt | Preserves the child and its worktree evidence |
| Missing pushed result | Reads the exact child only when the user asks; never resends automatically |

The request ID and exact child ID correlate one run. They provide practical duplicate detection, not exactly-once execution.

## Common questions

**Why not just open a new task?**

A new task has to reconstruct the product context. A fork inherits the completed planning history, including the final spec and the decisions that produced it.

**Does the planning task wait while implementation runs?**

No. The execution task returns a pushed result. Waiting remains an explicit option, not the default.

**Does this isolate the files too?**

No. It isolates future conversation, not the checkout. While the child is active, keep the planning task focused on direction and avoid concurrent edits to the same workspace.

**Does a Resume message authorize a push or deployment?**

No. Message text is transport rather than authority. Consequential actions still require a matching direct user instruction that the child can verify in the source task.

## It's working if

- One command creates a clearly named child without re-interviewing the user.
- The planning task stays free of implementation and test logs.
- Decisions return to the planning task and resume the same child.
- A completed child returns acceptance evidence before it is archived.
- Failures remain inspectable and no state-changing request is retried automatically.

## Where it fits

`execute-spec-in-fork` is the Codex App adapter between [to-spec](https://aihero.dev/skills-to-spec) and [spec-executor](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/spec-executor.md). [to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/to-goal.md) remains the portable route when context must cross days, agents, or harnesses. Use [ask-matt](https://aihero.dev/skills-ask-matt) when choosing between them.

## What it does

`execute-spec-in-fork` turns settled work into one Codex execution task: a final `SPEC READY` launches a bounded `spec-executor` run, while an explicitly requested cross-ticket contract launches a persistent Goal run.

It is a **verified execution channel**, not a background worker. One typed launch receipt, one exact child ID, and one correlated terminal receipt define the lifecycle; a partially created child remains recoverable instead of being silently replaced.

## When to reach for it

Type `/execute-spec-in-fork` when the current Codex App task has settled work ready to execute. The agent also uses it to finish the lifecycle when that execution fork later returns a correlated Messenger event.

| Situation | Route |
|---|---|
| Final spec, coherent conversation, one execution session | Run `execute-spec-in-fork` |
| Approved parent spec and ordered tickets that must finish in one renewing task | Explicitly request the complete goal with `execute-spec-in-fork`; an existing `/to-goal --all` contract is accepted but not required |
| Same contract, but the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) cannot fork or message Codex tasks | Open an execution task manually; run [spec-executor](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/spec-executor.md) for a Spec or execute the persistent Goal directly |
| Separate sessions, parallel work, delayed execution, or a portable contract | Use [to-tickets](https://aihero.dev/skills-to-tickets) and [to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/to-goal.md) |
| Decisions remain unresolved | Return to [to-spec](https://aihero.dev/skills-to-spec) |

## Prerequisites

The current task needs either a final `SPEC READY` or an approved parent spec with dependency-ordered agent-ready tickets, Codex App's native task tools, and the separately installed [Codex Task Messenger](https://github.com/tt-a1i/codex-task-messenger). The target repository must resolve to an existing absolute path.

## Harness dependency and fallback

The automatic loop is a Codex App adapter. Missing the native task tools or Messenger v2+, the skill refuses to simulate the transport and points at the manual route. After that receipt is pasted back, it asks once for `Goal / spec quality`; a skip does not block using the receipt. Task-API churn is paid in the capability map and, if needed, a rewrite of this adapter — not a cross-harness layer. Recorded in [ADR 0003](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/.agents/adr/0003-codex-app-fork-loop-is-an-adapter.md).

## One command, two modes

The leading idea is the **verified launch**. One direct command selects the mode and establishes both ends before implementation starts:

```text
single Spec     → fork → spec-executor      → SPEC EXECUTION RECEIPT
persistent Goal → fork → dependency order   → GOAL EXECUTION RECEIPT
```

Before forking, the command freezes the approved source, target repository, fixed point, validation, permissions, mode, and receipt type into a launch manifest. The post-fork Ask matters because a fork contains completed history only; it delivers both the start command and the facts the child must not guess from an active parent turn.

The launch preserves the complete native fork receipt before reading its top-level child ID. It names and messages that exact child, then reads it once to distinguish `started` from merely `delivered`. If naming or delivery fails after creation, the child ID and draft are retained for an explicit retry; another fork is never created automatically.

When the planning task's directory differs from the target repository, the child remains a same-directory App fork but operates **path-bound** against the verified absolute repository path. The mismatch is reported before launch rather than discovered after implementation starts.

## Lifecycle, not a daemon

| Event | What the workflow does |
|---|---|
| `completed` with a valid receipt | Presents evidence, asks once for `Goal / spec quality`, and archives the child even if that field stays blank |
| `needs-input` | Pins the child, asks in the planning task, then resumes the same child |
| `failed` or invalid receipt | Preserves the child and its worktree evidence |
| Fork created but naming or delivery failed | Preserves the exact child and Ask draft; an explicit retry targets that child instead of forking again |
| Missing pushed result | Reads the exact child only when the user asks; never resends automatically |

The request ID and exact child ID correlate one run. They provide practical duplicate detection, not exactly-once execution.

## Common questions

**Why not just open a new task?**

A new task has to reconstruct the product context. A fork inherits the completed planning history, including the final spec and the decisions that produced it.

**Does the planning task wait while implementation runs?**

No. The execution task returns a pushed result. Waiting remains an explicit option, not the default.

**Does this isolate the files too?**

No. It isolates future conversation, not the checkout. While the child is active, keep the planning task focused on direction and avoid concurrent edits to the same workspace.

**Can it finish several ordered tickets without making me run another command first?**

Yes, when the parent spec and dependency-ordered tickets are already approved and you explicitly request the complete goal. The command compiles the persistent launch manifest without reopening decisions or mutating the tracker. Use `/to-goal --all` first only when you also need a portable Goal outside this inherited Codex task.

**What if the planning task was opened outside the target repository?**

The launch reports the mismatch and uses path-bound execution against the verified absolute repository path. It refuses missing or ambiguous paths; it does not pretend that a same-directory fork changed the App directory.

**Does a Resume message authorize a push or deployment?**

No. Message text is transport rather than authority. Consequential actions still require a matching direct user instruction that the child can verify in the source task.

**Does a blank quality label block archive?**

No. The archive bar is still a completed, parseable receipt with evidenced criteria, no planning decision outstanding, and worktree or external effects reported. `Goal / spec quality` is a retrospective ask, not a seventh gate.

## It's working if

- One command chooses bounded Spec or persistent Goal mode without re-interviewing the user.
- The launch reports the exact child ID, target repository, directory alignment, delivery state, and observed startup state.
- The planning task stays free of implementation and test logs.
- Decisions return to the planning task and resume the same child.
- A completed child returns evidence for the entire selected contract before it is archived; a green intermediate frontier is never reported as terminal completion.
- Failures remain inspectable and no state-changing request is retried automatically.

## Where it fits

`execute-spec-in-fork` is the Codex App adapter after [to-spec](https://aihero.dev/skills-to-spec), optionally [to-tickets](https://aihero.dev/skills-to-tickets), and [to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/to-goal.md). `spec-executor` remains the bounded Spec implementation path; persistent Goal mode belongs to this adapter. Use [ask-matt](https://aihero.dev/skills-ask-matt) when choosing between portable goals, separate execution sessions, and one persistent fork.

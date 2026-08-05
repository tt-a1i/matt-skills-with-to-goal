## What it does

`goal-crafter` defines what makes an execution goal verifiable and formats that goal for the target [harness](https://www.aihero.dev/ai-coding-dictionary/harness). A goal is ready only when an agent can decide whether it is done from observable completion criteria.

It has two invocation modes. A standalone request is clarified with the user; a compiled handoff consumes already-approved evidence and never repeats the planning interview.

## When to reach for it

Type `/goal-crafter`, or the agent reaches for it automatically when you ask for a goal prompt, an unattended task, or a self-running loop.

| Starting point | Mode |
|---|---|
| A vague task that needs a goal | Standalone interview |
| An approved spec or issue passed by `to-goal` | Compiled handoff |

## Verifiable means observable

The leading idea is **checkable completion**. “Improve quality” leaves the finish line to judgment; a named command, artifact, behavior, or threshold gives the agent a binary condition it can verify.

Each checkbox carries one condition. Constraints name the protected files, permissions, budget, and scope boundaries that keep the loop from optimizing unrelated work.

## Common questions

**What is the difference between `goal-crafter` and `to-goal`?**

`goal-crafter` owns verifiability and harness formatting. `to-goal` owns repository evidence, frontier selection, readiness checks, and the execution handoff.

**Why does standalone mode ask what done looks like?**

Without an observable finish line, an unattended agent can stop early or continue indefinitely. The completion criteria are the control surface of the loop.

**What happens when an approved source is incomplete?**

Compiled-handoff mode reports the missing decision or evidence as not agent-ready. It does not quietly invent an answer or restart the interview.

## It's working if

- Every checkbox can be evaluated without subjective wording such as “better” or “cleaner.”
- The goal names its workspace, source context, and protected boundaries.
- A compiled handoff contains no repeated product interview.
- Work that cannot fit one goal is split instead of hidden inside a vague objective.

## Where it fits

`goal-crafter` is both a reach-for-it-anytime standalone and the shared goal vocabulary underneath `to-goal`. See [ask-matt](https://aihero.dev/skills-ask-matt) for the complete workflow map.

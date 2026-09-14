## What it does

`goal-crafter` designs a goal and observable completion criteria for complex autonomous work. It reuses decisions from the request and approved sources, asking only for information that materially changes the goal or its acceptance.

Its entrypoint selects the requested deliverable before loading the detailed design guide. A simple reminder goes straight to the available native scheduler; asking for a prompt produces a prompt.

## When to reach for it

Type `/goal-crafter`, or the agent reaches for it when you request goal design for multi-step autonomous work.

| Request | Route |
| --- | --- |
| A task needs scope and completion criteria | Goal design, using known facts first |
| Approved evidence needs a formatted goal | Compiled handoff without a repeated interview |
| A reminder has a clear action, target, and time | Native scheduling |
| Only a goal or reminder prompt is requested | Draft the text |

## Common questions

**Will it ask five questions every time?**

No. Task, workspace, completion, constraints, and execution environment are information to establish. Existing answers are reused; only a missing consequential decision needs a question.

**Does receiving a goal mean the automation is running?**

No. A goal is an execution brief. Scheduling also requires a user request and a successful result from the current native scheduling tool. The brief is not an API schema or proof of execution.

**How is this different from `to-goal`?**

`goal-crafter` designs completion criteria and the requested format. [to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/to-goal.md) compiles approved work and repository evidence into a portable execution contract. An incomplete approved source is returned with the missing decision identified.

## It's working if

- Supplied facts and approved decisions are carried forward without another interview.
- Completion criteria name observable behavior, evidence, or artifacts.
- A clear reminder reaches scheduling directly.
- Drafting, scheduling, and actual completion are reported as distinct results.

## Where it fits

This is a standalone goal-design capability. [ask-matt](https://aihero.dev/skills-ask-matt) is an optional catalog for choosing related skills.

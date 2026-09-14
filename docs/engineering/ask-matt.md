## What it does

`ask-matt` recommends the smallest useful capability from this repository for your current situation, then stops. It can recommend direct work when a clear task needs no additional workflow.

It carries known decisions forward and checks a skill's own entrypoint before making a recommendation that depends on its prerequisites or behavior.

## When to reach for it

You invoke it by typing `/ask-matt`; the agent does not select it automatically.

| Situation | What it helps choose |
| --- | --- |
| An idea is unsettled | Discussion, documentation, or a decision map |
| Work is approved | Direct implementation, an execution skill, or a context handoff |
| Work needs portability | A goal or a focused handoff |
| A specific capability is missing | Research, testing, review, diagnosis, or design |
| You already know the desired skill | Invoke that skill directly |

## Context and execution

A coherent conversation can be used directly or inherited in a fork. A goal is useful when approved work needs compression or transport. A fork shares files and inherits history; parallel implementation still needs separate workspace and ownership boundaries.

An approved conversation, issue, spec, or document can supply the source. The execution skills choose tests and reviews according to the task; a particular interview, marker, TDD skill, or review skill is not a prerequisite.

## Common questions

**Is there one required sequence of skills?**

No. Start from the capability you are missing. A task already approved does not need another planning interview, and a simple reminder can use native scheduling directly.

**Does a skill missing from automatic discovery mean it is not installed?**

No. Some skills are explicit-only and absent from automatic discovery. The catalog describes this repository, not your installed inventory; installation should be checked when it affects the recommendation.

**What if the catalog and a skill disagree?**

The skill's entrypoint owns its behavior. The router checks it before relying on a prerequisite or claiming that it runs another workflow.

**Can it route over all my personal skills?**

This catalog covers the repository's skills. It is not an installed-skill scanner.

## It's working if

- It names a next action and explains the gap that action fills.
- Existing plans and decisions are reused.
- It distinguishes optional help from real tool dependencies.
- It ends with a recommendation instead of starting the selected work.

## Where it fits

This is the optional catalog over the repository. The [README](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/README.md) lists the installable set; each skill's own contract defines how it works.

## What it does

`writing-for-agents` is the reference for writing agent-facing documents: a skill, an `AGENTS.md` or `CLAUDE.md`, a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), a runtime prompt, a README, any doc an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) reads. The format differs, but the writing does not. The same levers make each one predictable, so the agent follows the same *process* on every run (not necessarily to the same output).

Its default fix is to delete, not to explain. Ask an agent to write instructions for another agent and it spends most of its words explaining what the [model](https://www.aihero.dev/ai-coding-dictionary/model) already knows. Each of those lines is a **no-op**: it costs [context](https://www.aihero.dev/ai-coding-dictionary/context) and changes no behaviour. This reference helps you find them, so it is as useful on a document you already have as on a blank file.

It was called `writing-great-skills` until v1.1. The new name fits what it always was. Almost none of it is specific to skills. The skill-only mechanics (frontmatter, the model- versus user-invoked choice, router skills) live in a linked `SKILL-MECHANICS.md` that you read only when the document in front of you is a skill.

## When to reach for it

Type `/writing-for-agents`, or the agent reaches for it on its own when you're creating or editing a skill, or modifying `AGENTS.md` or `CLAUDE.md`.

Reach for it by hand for everything else an agent reads: your docs, specs and [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket), system and [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) prompts. The test is one question: does an agent read this? It does not matter how the agent gets the document: a pointer names it, a human pastes it, or it is in the repo. To find out what a codebase contains, use [grill-with-docs](https://aihero.dev/skills-grill-with-docs). This reference controls how a document reads, not what it knows.

## The two loads

The central idea is two budgets that every document and pointer spends:

- **Context load**: the cost of always-loaded material on the agent's window: an `AGENTS.md` line, a skill description, anything sitting in context every [turn](https://www.aihero.dev/ai-coding-dictionary/turn) whether or not it fires.
- **Cognitive load**: the cost to you of remembering which documents exist and when to reach for each. You are the index. Do not try to minimise this cost, because it is the price of human agency.

Once you think in these two loads, most authoring decisions (split or don't, inline or disclose, point or push) become the same trade made in different places.

## The levers

- **[Context pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer)**: the reference held in context that names out-of-context material and encodes when to reach it. A skill description and an `AGENTS.md` line naming a doc are the same thing. The pointer's *wording*, not its target, decides how reliably the agent follows it.
- **Information hierarchy**: the ladder from in-file step, to in-file reference, to disclosed reference behind a pointer. **[Progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)** is moving material down that ladder so the top stays easy to read.
- **Completion criteria**: how clear and demanding each step's done-condition is, and the **legwork** that demand causes. They are the defence against **premature completion**.
- **Leading words**: a compact concept already in the model's pretraining (*tight*, *red*, *tracer bullet*) that the agent thinks with while running the document. It works in two places. In the body it guides execution, and in the pointer it triggers invocation.
- **Pruning**: single source of truth, relevance, and the no-op test applied sentence by sentence, against **duplication**, **sediment** and **sprawl**.

## Common questions

**Where did `/writing-great-skills` go?**
It is this skill, renamed in v1.1. Users pointed it at `AGENTS.md`, docs, specs, tickets and runtime prompts long before the rename. Structure, leading words and pruning apply to any text an agent reads. There is no alias. Reinstall under the new name.

**"Writing for agents": so the agent does the writing?**
The other way round. You are the author; the agent is the reader. That is what makes it hard. You write for a reader that has already read everything, so explanation is waste and precision is the whole job.

**Can't I just ask the agent to write it for me?**
You can, and it will produce something verbose. Left alone the model explains what it already knows, and it will not apply the no-op test or reach for a leading word on its own. Use the reference to review the draft. Most of its value comes from that review pass.

**I asked an agent to trim a document and it cut the functionality.**
Agents told to "streamline" optimise for length, because length is the thing they can see. The no-op test checks behaviour, not style: delete the line and ask whether the agent's behaviour changed. When a sentence fails, delete the whole sentence rather than trim words from it, and settle a disagreement about it by running the document, not by arguing.

**How do I know when it's done?**
When it works, and you can no longer find duplication, sediment or no-ops. There is no automated eval. You check by running the document by hand and using the failure-mode vocabulary to diagnose problems. When a document misbehaves, the same vocabulary helps you fix it: name the failure mode first, then fix that.

**Should this live in `CLAUDE.md` or somewhere else?**
Ask which load you want to pay. `CLAUDE.md` loads into every [session](https://www.aihero.dev/ai-coding-dictionary/session) unconditionally. Material behind a pointer costs only the pointer's own line until it fires. Anything that applies in one session out of ten costs context load in the other nine.

**Do I need to rewrite my documents for each new model?**
Mostly no, and over-fitting to one model causes its own problems. Updating for a new model is usually another no-op pass rather than a rewrite.

**My skill only works on the exact task I built it from.**
The common method (do the work once, then have the agent write it up as a skill) fits that one run too closely, and the examples come out too specific. Keep the run as evidence, then generalise on purpose: strip what belonged to that repo and those files, and write for the class of task.

**English isn't my first language. Do I lose the leading-word advantage?**
No. Finding the word that packs the most behaviour into the fewest [tokens](https://www.aihero.dev/ai-coding-dictionary/token) is work the reference does for you.

## It's working if

- The document gets shorter as it gets better, and you are surprised how little is left.
- You can point at a leading word and see it change the agent's behaviour in more than one place.
- Nothing is stated twice, in any form. Duplication is the most reliable sign a document was never tested.
- Reference that only one branch needs sits behind a pointer rather than in the main file.

## Where it fits

A standalone reference for agent-facing instructions. `retro` loads it when considering environment changes; it also applies when writing skills, steering files or referenced docs.

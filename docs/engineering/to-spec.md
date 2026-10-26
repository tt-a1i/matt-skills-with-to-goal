## What it does

`to-spec` turns the conversation you have just had into a **[spec](https://www.aihero.dev/ai-coding-dictionary/spec)**, and publishes it to your issue tracker as a single issue.

It does not interview you. When you reach for it, the deciding is already done. So it synthesises what is known (from the thread, the codebase, your `GLOSSARY.md` and ADRs) and does not start a new round of questions. The spec records decisions you already made. It is not a place to make new ones.

## When to reach for it

You invoke this by typing `/to-spec`; the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

Reach for it when the build is too big for one agent [session](https://www.aihero.dev/ai-coding-dictionary/session) and must be split across several. That is the whole trigger:

| Where you are | What to run |
| --- | --- |
| You haven't decided anything yet | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) first |
| Decided, and the work fits one [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) | implementation directly with the agent: skip the spec |
| Decided, and the work spans several sessions | `/to-spec`, then [to-tickets](https://aihero.dev/skills-to-tickets) |
| A [wayfinder](https://aihero.dev/skills-wayfinder) map has cleared | `/to-spec #<map_issue>` |

## Prerequisites

`to-spec` publishes the spec as an issue, so [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) must first configure a tracker and the triage-label vocabulary for this repo. Either kind of tracker works: a real tracker like GitHub, or local markdown files under `.scratch/`, which work with no extra setup.

## The spec is a decision record

The spec exists because context windows end. You settled many things while [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling): the shape of the solution, the choices you argued through, and what you deliberately refused. All of that is in one conversation that you are about to clear. The spec keeps it.

So the spec does not validate or decide anything. It records what you decided, in your project's own vocabulary, so a fresh session can pick up the work without you explaining it again. If the spec states something you never said, that is a defect.

## Seams before prose

Before it writes anything, `to-spec` sketches the **seams** where the feature will be tested, and checks them with you. It prefers existing seams to new ones, and picks the highest seam it can. The ideal number of seams for a change is one.

Implementation and review can use the agreed seams recorded here to check the intended behavior. The spec preserves that agreement without requiring a named testing or review skill.

## Common questions

**Where did `/to-prd` go?**
It is this skill, renamed in v1.1. "Spec" is now the one term used throughout, and the old `to-prd` slug no longer works, so reinstall under the new name. The old vocabulary is replaced by the pair *spec* and *tickets*. The spec is the destination and the decisions that fix it. The [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) are the steps that get there. If you change direction, delete the unfinished tickets and keep the spec.

**Why does the spec get the `ready-for-agent` label? I don't want an agent implementing off it.**
The label means "no further triage needed": the document is complete enough for an agent to work from. It marks an input, not a work order. But [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agents that poll for `ready-for-agent` cannot see that difference. They will try to build the whole spec in one run instead of picking up the ticket slices. This is the most-reported problem with the skill. Until it changes, exclude the parent spec explicitly in your AFK agent's prompt, or remove the label after `/to-tickets` has run.

**Why not go straight from grilling to `/to-tickets` and skip the spec?**
Often you should. The spec is worth its step only on multi-session work. Its value is that the tickets are disposable and the spec is not. Each ticket is sized for one fresh context window and then gets deleted or closed, while the spec stays as the one place that records the reasoning behind them. On a single-session change, that gives you nothing, and you pay for an extra synthesis step where the [model](https://www.aihero.dev/ai-coding-dictionary/model) can drift. Go from grilling to implementation directly with the agent.

**I just finished a wayfinder map. What do I feed it?**
Give it the main map issue, `/to-spec #<map_issue>`, not the individual decision tickets. [wayfinder](https://aihero.dev/skills-wayfinder) produces decisions spread across a map, not deliverables. `to-spec` collapses them into one document you can build from. If you loop the map straight into implementation directly with the agent, you lose that step.

**Is the spec for me to review, or is it just for the agent?**
Mostly for the agent, and it reads that way: complete, dense, and full of references. Read the seams and the out-of-scope section. In those two places, a wrong decision is cheapest to catch now and most expensive to find later. People do complain about reading the whole thing, and there is no summary mode. But if the spec surprises you, the grilling was too shallow; the spec is not too long.

**Do I keep the spec frozen once tickets start, or let the agent rewrite it?**
Nothing keeps it in sync. In practice it is a snapshot of what you knew at that moment, and it goes out of date the first time implementation teaches you something. Treat it as disposable after the work ships. Your `GLOSSARY.md` and ADRs are the files meant to last. If you learn something during implementation that should last, put it there, not in an edited spec.

**My work is a refactor or a module boundary, not a feature. Does the template fit?**
Less well, and this is a known limitation. The template relies heavily on user stories, which do not fit architectural work. You end up writing stories nobody asked for around decisions that are really about interfaces and invariants. Use the implementation-decisions and testing-decisions sections instead. Record the lasting architectural decisions as ADRs through [grill-with-docs](https://aihero.dev/skills-grill-with-docs), not in the spec.

**Will it check the tracker for related work, or cite the ADRs it's respecting?**
No to both. It reads and follows the ADRs for the area it touches, but it does not link them. It also does not search the tracker for overlapping issues before it writes, so a spec can duplicate work that someone already filed, and nothing warns you. If the area is busy, search the tracker yourself first.

**`/to-tickets` couldn't read my spec: it kept truncating.**
A tracker issue may not return a very large spec in full, and there is no local copy to use instead. To fix this, do not [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) or [compact](https://www.aihero.dev/ai-coding-dictionary/compaction) between `/to-spec` and `/to-tickets`. Run them in the same window, and `/to-tickets` never has to fetch the spec again.

## It's working if

- It starts writing instead of asking you a new round of questions.
- It shows you the seams before it writes, and proposes as few as it can.
- It uses your project's nouns, not generic product-management boilerplate.
- You remember making every decision in it. It invented nothing to fill a section.
- The out-of-scope section lists real things. The things you refused are usually the most useful lines on the page.

## Where it fits

Turn approved discussion into a spec. `grill-with-docs` can supply the discussion, and `to-tickets` can split larger work. A bounded approved source can be executed directly or handed to `spec-executor`.

## Optional execution handoff

This fork can append a `SPEC READY` index with the source, repository, baseline, agreed test seam, non-goals, external authority, and next route. A bounded spec can be forked to `spec-executor`; larger work can be split or compiled with `to-goal`. The marker is a convenience, not a prerequisite for the fork-owned execution skills. One test seam is the default; a genuine external boundary can justify another.

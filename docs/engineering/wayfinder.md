## What it does

`wayfinder` takes an effort too big for one agent [session](https://www.aihero.dev/ai-coding-dictionary/session). This is an idea whose **destination** you can name but whose route you cannot yet see. Wayfinder charts it as a shared **map** of **decision tickets** on your issue tracker, then resolves the tickets one at a time until the route is clear.

It plans and does not build. Every ticket asks a question, and the answer is a decision, not a slice of a build. The map is finished when nothing is left to decide before someone builds the thing. This rule separates a wayfinder ticket from an ordinary implementation [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), and it is the rule agents break most often. When the map clears, wayfinder hands off and does not continue into code.

## When to reach for it

You invoke this by typing `/wayfinder`; the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

It is the heaviest flow in the set, so the trigger is narrow. The effort must be larger than one agent session can hold, and the route to the destination must be unclear. The split is session count: `/grill-with-docs` for single-session planning, `/wayfinder` for multi-session planning.

| What you have in front of you | What to run |
| --- | --- |
| A well-scoped feature you can settle in one sitting | [grill-me](https://aihero.dev/skills-grill-me), or [grill-with-docs](https://aihero.dev/skills-grill-with-docs) when there is a codebase |
| A greenfield project, or a build spanning many sessions, with the route still unclear | `/wayfinder` |
| A thread where the deciding is already done | [to-spec](https://aihero.dev/skills-to-spec): skip straight past the map |
| A cleared wayfinder map | [to-spec](https://aihero.dev/skills-to-spec), then [to-tickets](https://aihero.dev/skills-to-tickets) and implementation directly with the agent |
| An existing session that has already grown too big | say "hand off to `/wayfinder`" ([handoff](https://aihero.dev/skills-handoff) bridges into a map as well as out of one) |

Greenfield is not a requirement. People use wayfinder routinely on legacy and half-built codebases, and it can be more useful there, because much of the fog is "what is already true here" rather than "what should we do".

## Prerequisites

The map and its tickets live on the repo's issue tracker, so wayfinder needs the tracker setup from [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills). That step writes a "Wayfinding operations" section. The section describes how to express the map, its child tickets, blocking edges, and frontier queries on GitHub, GitLab, or local markdown. Wayfinder finds that doc through the pointer in your `CLAUDE.md` / `AGENTS.md`, not at a fixed path. With no tracker configured, it falls back to local markdown files.

The tracker does real work. Its native blocking links show the frontier in the tracker's own UI. On a tracker without native dependency links (a self-hosted Gitea, say), wayfinder infers blockers from the map text. That works, but you must supervise it more closely.

## The map, the fog, and the frontier

The **map** is a single issue labelled `wayfinder:map`, and its tickets are its child issues. It is an **index, not a store**. A decision lives in exactly one place, its ticket, and the map only gives a one-line summary and a link. A session loads the map at low resolution and opens individual tickets when it needs them. This lets a map keep growing without every session loading its whole history.

The map has four sections:

- **Destination.** What the end of this map looks like. You name it first, before any ticket exists, because the destination fixes the scope you measure every ticket against.
- **Decisions so far.** One line per closed ticket, each with a link to where the detail lives.
- **Not yet specified.** This is the **fog of war**: decisions you can tell are coming but cannot yet phrase sharply. The test for fog versus ticket is whether you can state the question precisely *now*, not whether you can answer it. When you resolve a ticket, the fog ahead of it clears, and anything you can now specify graduates into a new ticket.
- **Out of scope.** Work beyond the destination. Fog only gathers *toward* the destination, so out-of-scope work stays closed and never graduates.

The **frontier** is the set of open, unblocked, unclaimed tickets (the edge of the known). A session claims a ticket by assigning it to itself before it does any work. The assignee *is* the claim, so concurrent sessions skip that ticket. Sessions refer to tickets by name, never by a bare `#42`, because a wall of issue numbers is hard to read in narration.

## The four decision-ticket types

Every ticket carries a `wayfinder:<type>` label. Each ticket is either **[HITL](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)** (worked with a human who speaks for themselves) or **[AFK](https://www.aihero.dev/ai-coding-dictionary/afk)** (driven by the agent alone). A HITL ticket resolves only through the live exchange. An agent that answers its own [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) questions has broken it.

| Type | Mode | Reach for it when | Resolved by |
| --- | --- | --- | --- |
| `grilling` | HITL | The default. The question can be settled by talking it through. | [grilling](https://aihero.dev/skills-grilling) plus [domain-modeling](https://aihero.dev/skills-domain-modeling), in a fresh session |
| `prototype` | HITL | "How should this look" or "how should this behave": a question talking cannot settle. | a prototype built directly with the agent, with a link from the ticket to the built artifact |
| `research` | AFK | A fact outside the working directory is blocking a decision. | A [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent), started when you chart the map and run in parallel on a `research/<name>` branch |
| `task` | Either | Nothing to decide, but manual work blocks a decision, such as provisioning access, signing up for a service, or moving data so you can see its shape. | The agent alone where it can, otherwise a precise checklist for the human |

`task` is the only type that *does* rather than decides. It belongs on the map only because it unblocks a decision, never because it delivers part of the destination. This type goes wrong most often in practice. Agents read it as an implementation step and start to write product code inside the map.

Research is the only exception to *one ticket per session*.

## Independent research context

Research subagents start with a fresh context window and receive the relevant ticket and evidence pointers. This keeps the planning conversation out of their reading context; it does not alter deliberate execution-chat forks.

## Common questions

**How is this different from `/grill-with-docs`? Which should I start with?**
Session count, not project size. `/grill-with-docs` is single-session planning; wayfinder is multi-session planning. If you can hold the whole thing in one conversation, grilling is cheaper and better, and wayfinder is slower and denser for that case. The community shorthand is that wayfinder only makes sense if the work does not fit into a single session. This is by far the most-asked wayfinder question. People keep asking it because the skill descriptions do not tell you where your own task sits on that line. You have to judge the session count yourself.

**When it asks for the "destination", does it mean the end of this session or the end of everything?**
The end of the whole map, not just the first session. The question reads ambiguously, but wayfinder is a multi-session tool by definition, so a session-scoped answer never makes sense. Typical destinations are a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) to hand off, a decision to lock before planning starts, a proof of concept, or an in-place change such as a data migration.

**The map is cleared. Didn't wayfinder already write the spec and make the tickets? Why do I still need `/to-spec` and `/to-tickets`?**
No. Wayfinder's tickets are decision tickets, and by the time the map closes they are all closed too. What is left is a map full of linked decisions, which is not a build plan. [to-spec](https://aihero.dev/skills-to-spec) collapses those linked decisions into one spec (`/to-spec #<map_issue>`), and [to-tickets](https://aihero.dev/skills-to-tickets) slices that spec into tracer-bullet implementation tickets. If you loop the map straight into implementation directly with the agent, you skip the collapse and lose the linked detail. Go straight to implementation only when the effort turned out small. Some people run the shorter pipeline and report that it works. The two extra steps give you an explicit spec that a reviewer or a colleague can read, which matters more when you do not work alone.

**My agent started writing production code in the middle of a wayfinder session.**
This is the most-reported failure with this skill, and a real gap in the skill causes it. You can override wayfinder's "plan, don't do" default in the map's **Notes**. But the agent writes the Notes, so the constraint and its exemption live in a file that the constrained agent owns. One user watched an agent write "this map carries execution" into its own Notes. In later sessions the agent read that line back as permission and built on a live server. The skill has no hard stop for "I meant the default." Until it does, read the Notes on any map you did not chart yourself, keep implementation in separate sessions, and treat any `wayfinder:task` that looks like a slice of the build as mis-typed.

**I charted 27 tickets, and by the time I got to the thirteenth, the rest no longer made sense.**
This question is verbatim from a user report, and others report the same outcome. By default, wayfinder plans comprehensively. When later tickets rest on assumptions that earlier tickets invalidate, the map falls into the waterfall trap that critics accuse the skill of. Two things help. First, scope the map to a bounded destination, not to the whole product. Users report that maps scoped to one defined epic behave better than a sprawling "implement V1". The goal is to ship small increments, not to plan something very big. Second, [prototype](https://www.aihero.dev/ai-coding-dictionary/prototyping) aggressively. The route stays current because cheap concrete artifacts expose uncertainty before implementation depends on it. Wayfinder is "prototypemaxxing", not "planmaxxing".

**Can I work several tickets in parallel?**
The frontier shows you which tickets you can take, and blocking edges make parallel work safe on paper. In practice, one ticket at a time is the safer default. If you work two grilling tickets at once, one session can ask you a question you just answered in the other, because the sessions share no [context](https://www.aihero.dev/ai-coding-dictionary/context). Prototype tickets have a known gap too. One user reported an agent that built three UI variations, chose one itself, and closed the ticket. That choice is yours, and the skill does not yet say so clearly enough. If you do run tickets in parallel, review the dependency graph yourself first.

**Do I have to use GitHub Issues?**
No. Any issue tracker works. GitHub has the best support, because its native sub-issues and blocking relationships make the frontier visible without opening the map. People also use GitLab, Linear, Jira and local markdown. There are two caveats. On a tracker with no native blocking, wayfinder infers the dependency graph from text, and you must correct it by hand. Local markdown puts the artifacts in your repo, which is not recommended, because material stored in the repo tends to persist by accident. Open-source maintainers hit the opposite problem (public trackers fill up with agent-generated planning tickets) and often choose local markdown anyway.

**The grilling is exhausting. Every question is three paragraphs long.**
This is the sharpest open complaint about wayfinder, and nobody has fixed it yet. One user broke it down this way: the verbosity itself causes decision exhaustion, and the length hides *why* the agent asks a question, so you lose the chain from decision to decision as the map grows. The verbosity looks like a property of the current set of [models](https://www.aihero.dev/ai-coding-dictionary/model) rather than of the skill. Users try two mitigations: a lower [reasoning effort](https://www.aihero.dev/ai-coding-dictionary/effort), and a plain-language instruction in your global `CLAUDE.md`. Expect to think hard here anyway. Wayfinder demands a lot of thinking from you, and that is most of its purpose, not a defect.

**A decision I already closed turned out to be wrong. Do I edit the old ticket or make a new one?**
There is no official guidance, and the agent's default is unhelpful. It tends to design around the bad decision instead of challenging it, so you must steer it yourself. What works is to tell wayfinder plainly what changed. It then updates the map, revises the affected tickets, and comments on the closed ones. You can recover from scope changes mid-map. But if you *designed* a map to change, that is a sign the scope is wrong.

**Where did `decision-mapping` go?**
It is this skill. v1.1 renamed it to `wayfinder`, and you invoke it as `/wayfinder`. "Decision map" was jargon, and it was also inaccurate, because only one of the four ticket types is a decision by itself. The new name gave the skill one consistent vocabulary (destination, fog of war, frontier, the map) instead of an invented term on top. The unit kept the word "decision": a wayfinder ticket is a **decision ticket**, so that people do not read it as an implementation ticket.

## It's working if

- The destination is written down and agreed before a single ticket exists.
- Every open ticket reads as a question. Any ticket that reads "build the X" is either mis-typed or belongs downstream of the map.
- You can look at your tracker and see which tickets are takeable without opening the map, because native blocking shows the frontier.
- A session resolves one ticket, posts the answer as a resolution comment, closes it, and adds one line to the map's *Decisions so far*. Then it stops.
- **Not yet specified** shrinks over time. When fog graduates into a ticket, it leaves that section and does not appear in both places.
- When the opening breadth-first grill finds no fog at all, the skill stops and tells you the effort is small enough to skip the map.
- The session that finishes the map points you toward a spec, not a pull request.

## Where it fits

Plan work whose unresolved decisions span sessions. It uses `grilling` and `domain-modeling`; agents perform research and prototypes directly when a decision needs evidence. `to-spec` can capture the resolved plan.

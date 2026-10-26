## What it does

`triage` works through the issues on your project's tracker. It moves each one through a small state machine of **triage roles** (a category role and a state role). Each issue ends as an agent-ready brief, a specific question for the reporter, or a closed issue with a recorded reason.

It is only for issues **you didn't create**. That means raw bug reports, incoming feature requests, or an external pull request that arrived unannounced: work that came into the tracker from outside, in whatever shape the reporter left it. [Tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) from [to-tickets](https://aihero.dev/skills-to-tickets) are already agent-ready, so if you run `triage` over them, you waste the work. The rule is simple: `/triage` is only for incoming issues, not for issues you created yourself.

It also differs from labelling by hand because it recommends and then waits. It gives you its category and state call with reasoning, plus what it found in the codebase, and applies nothing until you tell it to.

## When to reach for it

You invoke this by typing `/triage` and then describing what you want in plain language. The [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own. Examples: "Show me anything that needs my attention", "let's look at #42", "move #42 to ready-for-agent".

| What you have | Where to go |
| --- | --- |
| A tracker full of raw reports from other people | `/triage` |
| A rough idea of your own, nothing written down | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| A settled conversation to turn into a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) | [to-spec](https://aihero.dev/skills-to-spec) |
| A spec to split into agent-ready tickets | [to-tickets](https://aihero.dev/skills-to-tickets) |
| A confirmed bug that needs a root cause, not a label | diagnosis directly with the agent |

## Prerequisites

`triage` reads and writes your issue tracker, so [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) must first configure that tracker and its label vocabulary. The role names below are **canonical**. The label strings in your tracker may differ, and setup provides the mapping. If your tracker already uses the canonical names exactly, you have nothing to map and nothing to set up.

The tracker config also decides whether external pull requests count as a request surface, and who counts as external. That flag is off by default, and setup no longer asks about it. To bring PRs into scope, turn it on in `docs/agents/issue-tracker.md`.

## The state machine

Every triaged item ends with exactly one category role and one state role. There are two categories: `bug` (something is broken) and `enhancement` (new feature or improvement). There are five states:

| State | Means |
| --- | --- |
| `needs-triage` | You need to evaluate it. An unlabelled issue normally lands here first. |
| `needs-info` | Waiting on the reporter. Returns to `needs-triage` when they reply. |
| `ready-for-agent` | Fully specified, with an agent brief attached. An [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agent can take it. |
| `ready-for-human` | The same brief, plus why an agent can't do it: judgment, external access, manual testing. |
| `wontfix` | Closed, with the reason recorded. |

That is the whole vocabulary. The rule of exactly one state role per item keeps the queries simple. The states are also the most-requested area of the [skill](https://www.aihero.dev/ai-coding-dictionary/skill). Users have asked for a state for work that is specified but blocked on another issue, a `deferred` state for work that waits on a future trigger, and a terminal `implemented` state. None of those has shipped. See the questions below.

`wontfix` has three cases. The difference matters because only one of them writes to the knowledge base:

| Why you're closing it | What happens |
| --- | --- |
| Already implemented | A comment that points to where the feature already lives. Nothing goes into `.out-of-scope/`, because it's a built feature, not a rejected one, and a file there would break the dedup checks. |
| Rejected bug | Polite explanation, then close. |
| Rejected enhancement | A file in `.out-of-scope/`, linked from the closing comment, then close. |

`.out-of-scope/` holds one markdown file per rejected **concept**, not per issue. Each file is a short design document, not a database row. It says what was rejected, why, and lists every issue that asked for it. `triage` reads the whole directory before it evaluates anything. It matches by concept, not keyword, so "night theme" matches `dark-mode.md`. When it finds a match, it shows you the old decision and asks if you still agree with it, instead of arguing the request again from the start.

## Verify before you brief

Before any [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling), `triage` checks that the claim holds. For a bug, it reproduces it from the reporter's steps. For a PR, it checks out the branch and runs the relevant tests. Then it reports one of three results:

- Confirmed, with the code path.
- Failed to reproduce.
- Not enough detail to try. This is the strongest `needs-info` signal there is.

In the same pass, it runs two more checks against the codebase. The **redundancy** check asks if the feature is already implemented, and searches by domain concept, not by the reporter's wording. The **prior rejection** check asks if `.out-of-scope/` already says no. Both checks are cheap, and a hit on either produces a `wontfix`.

All of this work makes one artifact good: the **agent brief**. This is the structured comment that `triage` posts when an issue moves to `ready-for-agent`. After `triage` posts it, the brief is the contract and the original report is only context. Briefs are **durable** rather than precise, because an issue can sit in `ready-for-agent` for weeks while the code changes. So a brief names types, signatures and behavioural contracts, and never file paths or line numbers. A confirmed reproduction makes a much stronger brief than a guess.

## A PR is an issue with attached code

If the tracker treats external pull requests as a request surface, they go through the same machine, with the same categories, states and transitions. The states apply to the diff. `ready-for-agent` means a brief is attached and an agent should take the next step on the code. `ready-for-human` means a person can merge it. A brief on a PR describes what is left to do to the existing diff, not how to build the thing from nothing.

Discovery shows only *external* PRs, because a collaborator's in-progress branch is not triage work. That filter applies only to discovery. If you name a PR explicitly, `triage` handles it, whoever wrote it.

## Common questions

**I ran `/to-spec` and `/to-tickets`, and now those tickets are sitting there untriaged. Do I run `/triage` over them?**
No. They are already agent-ready. `to-tickets` applies the `ready-for-agent` label when it publishes them, so an AFK runner picks them up without another pass. The user who hit this had run the spec flow and seen `needs-triage` on the output, and their AFK runner ignored everything. `triage` is the on-ramp for work that arrives from outside. The spec flow is the lane for work you start yourself. The two meet at `ready-for-agent`, not before.

**Is `triage` still relevant now that there's a `to-spec` → `to-tickets` → `implement` flow?**
Only if you have inbound work. `triage` is older than that flow and does a different job: it handles reports other people filed. If everything in your tracker came from your own planning, you will rarely use it. If you maintain anything public, or your team files bugs to you, it is where that work starts. The main use is open-source repos that take issues from external contributors.

**The agent tried to apply `ready-for-agent` and `gh` said the label doesn't exist.**
This is a known open bug ([#616](https://github.com/mattpocock/skills/issues/616)). `setup-matt-pocock-skills` writes the label vocabulary into `docs/agents/triage-labels.md`, but does not create the labels in your tracker. Create the five state labels and two category labels yourself, once, with `gh label create` or the tracker's UI, and the error stops. The issue links to a community fix branch that has not been merged.

**Five states aren't enough. What about blocked, or deferred, or implemented?**
This is the most-filed gap on the skill. It comes in three forms:

- An issue that is fully specified but waits on another issue to close ([#139](https://github.com/mattpocock/skills/issues/139)). The reporter said `ready-for-agent` is "technically true" there but misleading, so an agent picks it up and gets stuck.
- Future work that is intended but waits on a trigger, so it is not actionable yet ([#297](https://github.com/mattpocock/skills/issues/297)).
- A terminal state for "implemented, awaiting verification". Without it, an AFK runner can queue finished tickets again.

The blocked case is accepted as real, but the name is undecided (`blocked` versus `paused`). None of it has shipped. As a workaround, people add a repo-local extra label next to the category. The state slot then holds an accurate value, but the skill does not know about the extra label. One community fork goes further and adds `needs-slicing`, `tracking` and effort labels. That works, but it belongs to that fork, not to the skill.

**How is this different from diagnosis directly with the agent?**
The verification step here is shallow on purpose. It answers "is this real, and roughly where does it live", and does not look for a root cause. If a bug does not reproduce from the reporter's steps in a few minutes, use `needs-info`, or use diagnosis directly with the agent if you want to investigate it now. Neither skill's text mentions the other yet. A user reported that gap, and it is still open.

**Can I point it at my whole backlog and let it run?**
You can ask, but watch what it reads. The "show what needs attention" pass is a cheap listing for *selection*. You pick one issue, and then `triage` gathers full [context](https://www.aihero.dev/ai-coding-dictionary/context) on that issue. If you run it across twenty issues at once, the agent can use that cheap listing as its only evidence without telling you. The listing returns issue bodies but not comments. One user hit exactly this. Three issues already had a comment that said "already fixed, recommend closing", and all three got new agent briefs instead. For a bulk pass, say explicitly that it must read the comments on each issue.

**Does it work with Linear, or anything other than GitHub Issues?**
Yes. The tracker is config, not a hard-coded assumption. People run it against Linear (through the `linear` CLI), GitLab, and plain markdown files under `.scratch/`. A common split is Linear for issues and planning, and GitHub for code and PRs. Skills that say "issue tracker" then map to Linear, and skills that say "PR" map to GitHub. The local-markdown tracker has an open template bug: the generated file can contain the acceptance criteria twice, once at the top level and once inside the agent brief ([#200](https://github.com/mattpocock/skills/issues/200)).

## It's working if

- Every item it touches ends with exactly one category role and one state role, never zero, and never two conflicting states.
- It gives you a recommendation with reasoning and stops. It does not relabel the issue and move on.
- It reproduced the bug, or checked out and ran the PR, before anything reached `ready-for-agent`.
- The briefs it writes name types and behaviours, and contain no file paths and no line numbers.
- When a request you rejected six months ago comes back, it tells you and quotes the old reason instead of triaging it again.
- Every comment it posts starts with `> *This was generated by AI during triage.*`

## Where it fits

Evaluate incoming issues and PRs against the repository's scope. Tracker setup provides storage and label conventions; `grilling` and `domain-modeling` help only when the report needs clarification.

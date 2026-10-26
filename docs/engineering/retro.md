## What it does

`retro` looks back over a coding [session](https://www.aihero.dev/ai-coding-dictionary/session) and suggests improvements to the agent's **[environment](https://www.aihero.dev/ai-coding-dictionary/environment)**, so the next run goes better. It reads the session's own record (the current one by default, or one you point it at in the session logs). It finds the moments where the agent struggled, and gives you a list of candidate fixes, most severe first.

It changes the environment, not the code. Take the bug the agent shipped, the file it needed twenty [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call) to find, or the rule the reviewer missed. `retro` does not fix any of them directly. It asks what in the repo let them happen, and proposes the check, pointer, or standard that prevents them next time. It also only proposes. Nothing changes until you pick a candidate.

## When to reach for it

You invoke this by typing `/retro`, and the agent won't reach for it on its own.

Reach for it at the end of a session that was harder than it should have been. For example, the agent searched too long for something, made a mistake a tool could have caught, or needed information it could not get. A smooth session has little to teach, and the findings come from the difficult ones. If you want a verdict on the code the session produced, use review against requirements and repository standards instead.

## Where the findings land

Each candidate belongs to one category, and the category decides where the fix goes:

| What went wrong in the session | Fix it with |
| --- | --- |
| The agent took a long time to find a file or fact | A **navigation pointer** from a file it already reads |
| It made a mistake a tool could have caught | An **[automated check](https://www.aihero.dev/ai-coding-dictionary/automated-check)**: lint rule, type, test, pre-commit hook, CI job |
| The reviewer missed a judgement-call mistake | A rule in `CODING_STANDARDS.md` for the reviewer agent |
| `AGENTS.md` or `CLAUDE.md` is large | Move its steering out, into standards or checks |
| A tool call was expensive for what it returned | Streamline the tool, or replace it |
| A steering file is full of lines that change nothing | Delete the **no-ops** |
| The agent needed information it couldn't reach | Widen its access: tee the dev server log to a file, give read-only access to a service |

The leading idea is that standards belong to the **reviewer**, not the implementer. The implementing agent has the most context pressure, because it explores, writes code, and debugs failures. The reviewing agent gets a diff and nothing else. So a new rule goes where there is room to apply it, which is review. It never goes in [AGENTS.md](https://www.aihero.dev/ai-coding-dictionary/agents-md), which loads into every session's [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) whether it is relevant or not.

Before `retro` writes any rule, it classifies the violation. A **mechanical** violation (a banned API, an import shape, a file-location rule) gets a deterministic check, because a check can fail and a sentence in a standards file can't. Only real judgement calls, which no linter can enforce, become prose. If the repo has no guardrail at all (no pre-commit hook, and no CI job that runs lint, typecheck, and tests), `retro` reports that as a finding of its own.

## Common questions

**Does it write the lint rule itself, or wait for a yes? Can I wire it to run after every session?**

It waits. `retro` only proposes. Nothing changes until you pick a candidate, so it edits nothing by hand and installs no hook automatically. This is deliberate. One user asked for exactly this after being "burned by auto-hooks that blocked good changes." It takes judgement to decide what deserves a permanent check, so the skill stays [human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop) and user-invoked. Some users do run it after every implementation run. But a smooth session has little to teach, so a run after every session mostly produces rules nobody needed. There is no dry-run mode. A proposed check is code like any other, so try it against the repo before you let it block merges.

**Won't this pile up lint rules forever? Does it ever suggest removing one?**

Partly, and this is its weakest spot. It can remove prose: no-ops in steering files, and steering in `AGENTS.md` or `CLAUDE.md` that belongs in standards or a check. It flags these for deletion when the files are large. It judges them against the one session it reads, so treat each one as a candidate for the deletion test, not a verdict. It does not audit the lint rules, hooks, or CI jobs it proposed last month. It sees one session, so it cannot tell you that a rule now fires too often or that the bug behind it is gone. You must still prune checks yourself. A rule that fires constantly on good code is the sign to remove it.

**Won't it just invent generic advice to fill its categories?**

This is the strongest criticism of it. One user found that "once the job is finished, the AI tends to forget the struggles from the middle of the session and invents generic advice to satisfy the retro categories." Every candidate must come from the session's own record, so the advice is specific to that session. This has a cost as well as a benefit. It rarely invents something irrelevant, but it can give too much weight to whatever this one session was about. Discard any candidate you can't trace to a specific moment. Treat the severity order as a first draft too, because a quiet, expensive mistake can rank below a loud, cheap one.

**My session is long. Run it now, or start fresh?**

By default it reviews the current session. That is the best case, because the struggles are still in the context window. If the session has already moved out of the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) it, and point a fresh `/retro` at the previous session in the session logs.

**The agent keeps making the same mistake. Should I add a line to `CLAUDE.md`?**

Usually not, and `retro` pushes back on this more than anything else. A line in `CLAUDE.md` loads into every session, gives less weight to everything else in the file, and goes out of date as the code changes. If the mistake is mechanical, the fix is a check that fails. If it is a judgement call, it goes in the coding standards the reviewer reads. `AGENTS.md` and `CLAUDE.md` are for navigation pointers and little else. For the same reason, `retro` is not a [memory system](https://www.aihero.dev/ai-coding-dictionary/memory-system). It does not store what happened. It changes the environment so the mistake cannot happen again.

**My setup mentions `CODING_STANDARDS.md` and I don't have one. Where does it come from?**

No skill ships the file. The first time a session finds a judgement-call rule for the reviewer, `retro` proposes to create it. After you accept, the reviewer can read and apply it. Any other standards doc you already keep, such as `CONTRIBUTING.md`, works the same way.

**How is it different from `improve-codebase-architecture`?**

The input is different. [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) needs only the code, and looks for structural improvements to it. `retro` needs a session history, and improves the environment the agent works in, not the code. You use both; neither replaces the other.

## It's working if

- Every candidate points back to a specific moment in the session, not a generic best practice.
- Repeat mistakes turn into failing checks, and your `AGENTS.md` gets shorter over time, not longer.
- If a check already existed but was not connected, the finding is to connect it, not a proposal to build a new one.
- The next session on the same kind of task finds what it needs faster.

## Where it fits

A user-invoked review of a coding session's environment. It uses `writing-for-agents` for instruction design and the repository's existing checks before proposing more tooling.

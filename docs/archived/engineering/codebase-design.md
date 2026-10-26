> **Archived, 2026-10-26.** Removed from this fork's default set. The source is preserved under `skills/deprecated`; use the agent directly for this work.

## What it does

`codebase-design` fixes the words you use to design a module: **module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**. It defines each one precisely, bans the loose substitutes ("component", "service", "API", "boundary"), and states the handful of principles that follow from them.

It is a reference, not a process. It runs no loop, produces no artifact, and never stops to ask you a question. Every other skill that touches design uses its vocabulary. On its own, it gives you the words and stops. Know this before you invoke it. If you point a [session](https://www.aihero.dev/ai-coding-dictionary/session) at a skill with no process and no stopping rule and say "go", the agent invents a process. The questions below show what that looks like.

## When to reach for it

Type `/codebase-design`, or the agent reaches for it automatically when a design task fits.

Reach for it when you already know which code you're redesigning and you need to think about its shape: where the seam goes, how small the interface can get, whether an extraction removes complexity from its callers. Also use it to settle an argument about what a design word means.

Several skills are close to it. Pick by the problem you have:

| The problem | The skill |
|---|---|
| The shape of one module: its interface, its seam, its depth | `codebase-design` |
| The *words of the domain*: "account" means three things, two people mean different things by "cancellation" | [domain-modeling](https://aihero.dev/skills-domain-modeling) |
| You don't yet know *which* module to redesign | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) (the survey that finds candidates) |
| You want the design argued with, not just named | [grilling](https://aihero.dev/skills-grilling) |
| There's a concrete behaviour to build and you want tests that survive a refactor | [tdd](https://aihero.dev/skills-tdd) |

## The vocabulary

The glossary is the skill. The skill defines every term against the others, and gives each one the word it replaces.

| Term | What it means | Don't say |
|---|---|---|
| **Module** | Anything with an interface and an implementation. Deliberately scale-agnostic: a function, a class, a package, a slice spanning tiers. | unit, component, service |
| **Interface** | Everything a caller must know to use it correctly: the type signature, plus invariants, ordering constraints, error modes, required config, performance characteristics. | API, signature |
| **Depth** | Leverage at the interface: how much behaviour a caller or a test can exercise per unit of interface they have to learn. **Deep**: a lot of behaviour behind a small interface. **Shallow**: the interface is nearly as complex as the implementation. | none |
| **Seam** | Michael Feathers' term: a place you can alter behaviour without editing in that place. It is the *location* of an interface, and where to put it is its own decision, separate from what goes behind it. | boundary |
| **Adapter** | A concrete thing satisfying an interface at a seam. It names a role, not a kind of thing: an in-memory fake and a Postgres repo are both adapters. | none |
| **Leverage** | What callers get from depth: more capability per unit of interface learned. | none |
| **Locality** | What maintainers get from depth: changes, bugs and verification stay in one place, so one fix covers every caller. | none |

The skill does *not* define depth as the ratio of implementation lines to interface lines, which is Ousterhout's own definition. That metric rewards padding the implementation, so the skill uses depth-as-leverage instead.

## The four principles

- **Depth is a property of the interface, not the implementation.** A deep module can be built internally from small swappable parts. Callers just don't see them. A module can have internal seams its own tests use, and one external seam at its interface.
- **The deletion test.** Imagine deleting the module. If complexity disappears, the module was a pass-through. If it reappears across N callers, the module was hiding real complexity.
- **The interface is the test surface.** Callers and tests cross the same seam. If you want to test *past* the interface, the module is the wrong shape.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't cut a seam until something varies across it. A single-adapter seam is just indirection.

Two supporting files go further, and the skill reads them on demand rather than up front. [DEEPENING.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DEEPENING.md) classifies a candidate's dependencies into four categories (in-process, local-substitutable, remote-but-owned, true-external), because the category decides how you test the deepened module across its seam. [DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DESIGN-IT-TWICE.md) starts parallel [sub-agents](https://www.aihero.dev/ai-coding-dictionary/subagent) to produce three or more radically different interfaces for the same module, then compares them on depth, locality and seam placement.

## Common questions

**How do I actually build a deep module in TypeScript?**

This is the most-asked question about the skill and the skill does not answer it. It defines what a deep module *is*; it says nothing about how to stop a stray import from reaching past the interface. [Issue #458](https://github.com/mattpocock/skills/issues/458) put it plainly: "let's say we're happy with the interface, it hides the details, etc. But how do we enforce it? I think without linting or clear guardrails, humans and LLMs alike will start making it messy over time." The answer in that thread gave three options: wrap it in a class or IIFE and accept that the class gets enormous; make it a package in a monorepo and accept the monorepo tooling; or use a linter like [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) to forbid imports that bypass the interface. Of these mechanisms, Effect is the best and dependency-cruiser the second-best. There is a `setup-ts-deep-modules` skill in the repo's `in-progress/` bucket that lays down a `src/packages/<name>/index.ts` convention, but it is a beta-channel skill with no docs page, and it ships no lint rule.

**I pointed a session at it and it burned 100k [tokens](https://www.aihero.dev/ai-coding-dictionary/token) redesigning things I never asked about.**

This is a known problem, filed as [issue #449](https://github.com/mattpocock/skills/issues/449). The skill is model-invoked and describes itself as vocabulary, but nothing in it hard-stops an agent from treating it as a runnable process. Told to "resume in /codebase-design and drive the open decisions", an agent picked the part of the skill closest to a process: the parallel sub-agents in `DESIGN-IT-TWICE.md`. It re-explored code a previous session had already mapped, and worked for a long time before it asked anything. This skill has none of the guardrails a driver skill has (checkpoints, one question at a time, no auto-advance), because it is a reference. The workaround is to invoke a driver skill (`/grill-with-docs`, `/improve-codebase-architecture` or `/tdd`) and use `codebase-design` as its vocabulary. The issue is open.

**Where did `design-an-interface` go? And is there an `/interface-design` skill?**

This skill replaced `design-an-interface` and took over its content. Nothing is missing. Its "design it twice" technique (parallel sub-agents generating radically different designs, from Ousterhout) ships here as `DESIGN-IT-TWICE.md`. Separately, several people have asked for a dedicated `/interface-design` skill for the deep-module/thin-interface philosophy; this skill already covers that philosophy, and no separate skill is planned. If you came looking for either name, this is the page.

**Isn't this a file-structure convention, such as folders, barrel files, feature slices?**

No. People have pushed back on this many times, and the skill has not changed. [Issue #95](https://github.com/mattpocock/skills/issues/95) proposed a formalised fractal-tree file structure as the concrete implementation of deep modules; the reply was that the two are independent: "deep modules are about the design of the interface and accessing through a strict interface, no matter what the file system looks like. It seems perfectly possible that you could have shallow modules with this approach." The same came up in #458: "I think you might be tying the concept of modules too closely to the file system. The file system can certainly be a useful hint to the shape of modules, but there's no need to use the file system in the construction of deep modules." The glossary defines **module** as scale-agnostic on purpose.

**Does `tdd` actually use this vocabulary?**

It does now, but for a long time it did not. v1.0 removed the inline deep-module notes from `tdd` in favour of this shared skill, but nobody added a pointer to replace them, so `tdd` defined "seam" for itself and referenced nothing. The pointer is now in `tdd`, and the agent follows it when the open question is the shape of the interface, not the tests. `tdd` still owns "seam" as the boundary you *test* at; this skill owns the module shape behind it.

**Does the design-it-twice pattern work outside Claude Code?**

Not cleanly. `DESIGN-IT-TWICE.md` says "spawn 3+ sub-agents in parallel using the Agent tool", and "Agent" is the name of a Claude Code [tool](https://www.aihero.dev/ai-coding-dictionary/tool). The repo ships metadata for other [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness), including Codex, and those may have no tool with that name. So the parallel-design phase is less portable than the skill's metadata suggests. [Issue #564](https://github.com/mattpocock/skills/issues/564) tracks this, and it is open.

**Can I add my own concepts to the glossary, such as connascence, module secrets, [progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)?**

People have proposed those. [Issue #180](https://github.com/mattpocock/skills/issues/180) adds Parnas's module secrets and Page-Jones's connascence as a naming layer for *what* is leaking across a seam, with a working diff attached; [issue #303](https://github.com/mattpocock/skills/issues/303) proposes progressive disclosure inside the implementation, so a module that is deep at its public interface also has structure inside it. Both are open and unmerged. The shipped glossary is small on purpose, and the skill itself gives the reason: consistent language is the whole point, and a term nobody uses consistently is worse than no term.

## It's working if

- The design conversation stops producing the words "component", "service" and "boundary", and starts producing "module", "interface" and "seam".
- Someone can point at a proposed extraction and say whether it passes the deletion test, without hedging.
- A proposed seam comes with a second adapter named, not just the first one.
- Discussion of an interface covers invariants, ordering and error modes, not only the type signature.
- Invoking it does not start a session. If the agent begins reading files and proposing refactors from `/codebase-design` alone, it has mistaken the reference for a driver.

## Where it fits

`codebase-design` is a **reach-for-it-anytime standalone**, and the vocabulary layer underneath the engineering skills rather than a step in any chain. Its closest neighbour is [domain-modeling](https://aihero.dev/skills-domain-modeling), the parallel reference for the *problem domain*'s words rather than the module's shape. The two are usually wanted together, since naming a deep module well needs both. [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) is the other: it surveys a codebase for deepening candidates and writes every one of them in this glossary, so it finds the module and you design it in this skill's words. When you're unsure which skill or flow fits, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.

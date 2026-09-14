## What it does

`tdd` develops observable behavior test-first: one failing test, then the implementation that makes it pass. Tests observe public boundaries and derive expected results independently of the implementation.

It reuses established test boundaries and chooses routine ones from the code. A missing decision needs user input only when it changes the behavior or a consequential coverage tradeoff.

## When to reach for it

Type `/tdd`, or the agent reaches for it when a task calls for developing behavior test-first.

| Situation | Approach |
| --- | --- |
| A feature or bug has observable inputs and expected results | Use the red → green loop |
| Existing checks already establish the behavior of a small change | Reuse those checks |
| A regression could recur undetected | Add a test that would independently catch it |
| The public interface itself needs design | Consult [codebase-design](https://aihero.dev/skills-codebase-design) when useful and available |

## Tests that survive implementation changes

A **seam** is a public boundary where behavior can be observed. Choose it from the source criteria and existing tests. For a new boundary with meaningful tradeoffs, explain what each option catches or misses.

Build in vertical slices: one behavior, one test, one working implementation. Expected results come from a known example or contract. Tests that repeat the implementation's calculation or assert internal wiring can stay green while the behavior is wrong.

After a green test, behavior-preserving cleanup needed by the current change can be made with the affected checks rerun.

## Common questions

**Must I approve every test boundary?**

No. Existing decisions and tests usually establish it. When a choice materially affects the contract or coverage, the agent explains the tradeoff and asks for that decision.

**Does every code change need a new test?**

No. Add a test when it gives independent evidence for a relevant behavior or failure. Reversible formatting and configuration edits may already be covered by existing checks; avoid tests that merely restate those edits.

**Does refactoring require `code-review`?**

No. Focused cleanup can follow a green test. Broader redesign needs a separate scope; review methods follow the task rather than a required companion skill.

## It's working if

- A regression test fails for the relevant behavioral reason before the fix.
- Expected values come from an independent example or requirement.
- Internal refactoring leaves behavior-focused tests useful.
- The run reuses known test boundaries and only asks about consequential missing decisions.

## Where it fits

This is a standalone methodology reference. [implement](https://aihero.dev/skills-implement) may use it when test-first development fits the work. [ask-matt](https://aihero.dev/skills-ask-matt) remains an optional catalog.

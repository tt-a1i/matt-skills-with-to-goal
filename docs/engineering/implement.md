## What it does

`implement` completes bounded work from an approved conversation, spec, or ticket, including the validation and repairs needed to meet its acceptance criteria. It carries settled decisions and authorization forward while choosing implementation, tests, and review methods for the task.

## When to reach for it

You invoke it by typing `/implement`; the agent does not select it automatically.

| Source | Use |
| --- | --- |
| A clear bounded task already agreed in conversation | Implement from that conversation |
| A spec or ticket with defined behavior | Implement from the identified source |
| Work with unresolved consequential decisions | Clarify those decisions first |
| Work too large for one execution session | Split it into bounded units |

For a small clear task, asking the agent to implement it directly is also sufficient.

## Verification and completion

Validation follows the behavior and impact of the change. Existing tests and repository checks are preferred; [tdd](https://aihero.dev/skills-tdd) can help when developing behavior test-first. A full suite is appropriate when repository requirements, impact, or failures call for it.

The final review covers the complete task diff, including uncommitted work, against the accepted criteria. In-scope findings are repaired and affected checks rerun before delivery. An optional specialist review must support the actual diff being reviewed.

## Common questions

**Must `tdd` and `code-review` be installed?**

No. The task needs suitable validation and review, which can use existing tools or a specialist skill when useful. Missing an optional skill does not stop implementation.

**Will it ask me to approve the same plan or testing boundary again?**

No. It reuses the source and established public test boundaries. A question is needed when a missing decision changes the task, expected behavior, or authorization.

**Does it commit, close tickets, or open a PR automatically?**

Those actions follow authorization in the request or approved source. Invoking implementation alone does not authorize publication or tracker changes. Delivery reports which actions actually occurred.

**Can it review changes before committing?**

Yes. The review includes staged and working-tree changes, rather than relying on a comparison that only sees committed history.

## It's working if

- The implementation matches the identified source and preserves unrelated work.
- Checks provide evidence for the changed behavior without unnecessary repeated suites.
- In-scope failures are repaired instead of merely listed at the end.
- The final result distinguishes implementation, verification, remaining gaps, and authorized external actions.

## Where it fits

This is an optional execution entry. [spec-executor](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/spec-executor.md) adds an isolated execution contract and evidence receipt. [ask-matt](https://aihero.dev/skills-ask-matt) helps choose an entry when needed.

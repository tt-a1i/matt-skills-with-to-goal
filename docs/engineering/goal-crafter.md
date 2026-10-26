## What it does

`goal-crafter` turns an idea or task into a concise goal prompt with an outcome, observable completion evidence, relevant constraints and starting context. It writes a goal; it does not execute the task or create an automation.

It uses the available conversation before asking questions. Approved decisions stay settled, and only missing decisions that change the task need clarification.

## When to reach for it

Type `/goal-crafter`, or the agent reaches for it when you ask for a goal prompt or help defining completion criteria.

Use it while the goal still needs to be written. For an already-approved task whose repository state must be inspected and carried to a new session, use [to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/to-goal.md).

## Common questions

**Does it always ask five questions or use a fixed template?**

No. It asks only for missing decisions and uses the shortest useful form. Dependencies need an execution order; a small task may need only a few sentences.

**Must every criterion be an automated test?**

No. Artifacts, observed behavior, measurements and explicit user acceptance can be evidence. Passing tests cannot replace product acceptance.

**Does the goal start running after it is written?**

No. The prompt is ready to hand to an agent. Executing, scheduling or granting new external-action permissions is separate.

## It's working if

- Another agent can identify the outcome, scope and finish line without guessing.
- Already-approved answers are not asked again.
- The prompt carries material constraints without a prescribed implementation method.

## Where it fits

Goal authoring before execution. `to-goal` compiles approved work against current repository evidence; [spec-executor](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/spec-executor.md) performs implementation. All three keep separate entrypoints.

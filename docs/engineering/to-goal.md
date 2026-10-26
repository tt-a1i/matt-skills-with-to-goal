## What it does

`to-goal` compiles approved work and current repository evidence into a portable execution contract. It accepts conversation, specs, issues, local documents or partially completed work, without requiring a planning skill or tracker setup.

It remains read-only and preserves settled decisions. It does not implement, create a branch, write files or mutate a tracker.

## When to reach for it

Invoke `/to-goal` when work crosses sessions, people or agents, or the conversation is too noisy to inherit reliably. Supply an issue, parent spec or local path when the source is outside the current conversation.

Use [goal-crafter](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/goal-crafter.md) when the goal itself still needs to be authored from an idea.

## The execution contract

The goal carries the source, intended outcome, current state, review baseline, remaining work, observable completion evidence and permissions. Verified work is preserved and unverified claims stay visible. The output is concise, without a required readiness checklist or model-tier taxonomy.

Default to one bounded, unblocked outcome. Explicit `/to-goal --all <parent>` carries dependency-ordered work across contexts and requires an execution harness that can renew its context.

## Common questions

**Is this the executor?**

No. It writes the handoff. [spec-executor](https://github.com/tt-a1i/matt-skills-with-to-goal/blob/main/docs/engineering/spec-executor.md) executes approved work and reports evidence.

**What if the task is blocked or partially finished?**

Blockers are reported instead of hidden in a runnable goal. Partial work is separated into verified completion, remaining work and unverified claims.

**Does the goal authorize a push or deployment?**

No. It carries existing user authorization and identifies actions still requiring a decision.

## It's working if

- The executor can locate the source and compare changes against the recorded baseline.
- Verified work is not repeated and remaining acceptance criteria are visible.
- Scope and permissions survive the move to another session.

## Where it fits

An approved-source compiler before a fresh execution session. It is distinct from both goal authoring and implementation, and needs no companion skill.

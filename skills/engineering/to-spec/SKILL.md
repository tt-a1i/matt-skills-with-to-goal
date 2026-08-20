---
name: to-spec
description: Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of what you've already discussed.
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user — just synthesize what you already know.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - default to one per spec unless a genuine external boundary forces another.

Check with the user that these seams match their expectations.

3. Write the spec using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>

4. Choose the execution route after publishing:

- If the complete spec fits one implementation context and the current conversation is coherent enough to fork, mark it for `fork → /spec-executor`.
- If it needs several tracer-bullet slices, parallel work, cross-agent transfer, or context compression, mark it for `/to-tickets` instead. Do not pretend a large spec is fork-ready.
- If a product decision or test seam is still unresolved, emit `SPEC NOT READY` with the missing decision. Do not launch implementation.

5. End a ready result with this compact launch block so a forked thread can find the final contract without guessing between drafts:

```text
SPEC READY

- Status: ready for implementation
- Source: <published spec URL or path>
- Repository: <implementation repository>
- Baseline: <current commit, branch, or explicit source baseline>
- Test seam: <highest agreed behavior seam>
- Non-goals: <explicit exclusions>
- External authority: <commit, push, review, deploy, tracker, data, and real-service permissions; default ungranted>
- Next route: fork + /spec-executor | /to-tickets
```

The launch block is an index into the approved spec, not a replacement for it. Do not repeat the full spec inside the block.

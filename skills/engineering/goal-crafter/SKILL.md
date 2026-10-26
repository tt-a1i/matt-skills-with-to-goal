---
name: goal-crafter
description: Draft a verifiable goal prompt from an idea or task. Use when the user asks for a goal, completion criteria, or a prompt to hand to another agent; this skill writes the goal rather than executing or scheduling it.
---

# Goal Crafter

Turn the user's intended outcome into a concise goal that another agent can execute and verify.

Use the conversation and supplied evidence first. Ask only about missing decisions that change the scope, completion criteria, or permissions. Already-approved material needs no new interview; if it is missing an essential decision, identify the gap rather than inventing an answer.

A useful goal states:

- **Outcome:** the result the user wants, with the relevant workspace or target.
- **Completion:** observable evidence that distinguishes finished from unfinished work. Preserve the user's criteria; do not substitute green tests for product acceptance. If final acceptance needs the user, name that boundary.
- **Constraints:** material scope, authorization, budget, or files to protect, when applicable.
- **Context:** the sources and starting points the executor actually needs.

Use the shortest format that carries those facts. Adapt to a named harness when its format is known; otherwise use plain Markdown. A small task may need only a few sentences. Include an execution order only when dependencies matter. Do not prescribe a fixed interview, number of checkboxes, or engineering method.

Preserve authority from the source: writing a goal does not authorize implementation, commit, push, deployment, messages, or scheduling. Do not promise an unattended run will necessarily finish. Keep explicitly requested capability or model choices; omit generic model-tier recommendations.

Deliver the goal ready to copy, plus only essential unresolved questions. This is goal authoring. `to-goal` separately compiles an approved source against repository state, and `spec-executor` performs implementation; neither is required to use this skill.

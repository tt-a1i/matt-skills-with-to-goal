---
name: goal-crafter
description: >
  Design goal prompts and completion criteria for complex autonomous agent work.
  Use when the user requests a goal prompt or wants to turn a multi-step task or approved plan into a verifiable goal.
---

# Goal Crafter

Turn a vague task into a **verifiable goal** that an AI agent can run unattended.

**Leading principle**: A goal without a checkable completion criterion is just a wish. The agent must be able to answer "Am I done?" without asking a human.

## Route before goal design

- A reminder or routine scheduled action with a clear action, target, and timing goes directly to the available native scheduling tool. Ask only for a missing scheduling detail that prevents creation; do not run the goal interview. Report success only after the tool confirms creation or update.
- If the user asks only for a goal prompt, deliver that prompt without creating an automation or starting execution. An explicit request to draft a reminder prompt is still a drafting task.
- Use goal design when autonomous work needs a defined scope, completion criteria, evidence, or stopping conditions. A schedule alone does not make a task complex.

## Invocation modes

Choose the mode before following the process:

- **Standalone mode**: the user brings a task or directly asks for a goal. Extract what is already known in Phase 1; ask only for missing decisions that materially affect the goal.
- **Compiled-handoff mode**: approved planning evidence already supplies the answers. **Do not interview the user again.** Apply only this skill's verifiability rules and target-harness formatting. The evidence may come from a conversation, spec, issue, document, or another skill.

In compiled-handoff mode, if a required product decision or completion condition is genuinely absent from the sources, report that the source is not agent-ready and name the missing evidence. Do not reopen the planning interview from inside goal compilation.

## Design and deliver the goal

For an actual goal-design task, read [goal-design.md](references/goal-design.md). It contains the information checklist, harness-specific brief formats, verification rules, and examples. Load it only after the routing check above selects goal design.

Complete the requested deliverable: a usable goal prompt, a compiled handoff, or a tool-confirmed automation when scheduling is also requested. Reuse known task facts and approved criteria; do not restart an interview merely because this skill was invoked.

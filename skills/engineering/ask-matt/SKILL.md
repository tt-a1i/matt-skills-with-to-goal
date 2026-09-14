---
name: ask-matt
description: Ask which skill or flow fits your situation. A router over the skills in this repo.
disable-model-invocation: true
---

Recommend the smallest useful capability for the user's current situation, then stop. This is an optional catalog of this repository, not a required workflow. Clear, bounded work may need no skill.

Use known decisions and artifacts to choose an entry. Ask only for missing information that would change the recommendation. When a recommendation depends on a skill's prerequisites or behavior, read that skill's entrypoint before making the claim; its own contract wins over this catalog.

## Choose by the missing capability

| Situation | Suggested entry |
| --- | --- |
| Clear small task, ready to execute | Direct implementation; `/implement` is optional |
| Unsettled idea needing discussion | `/grill-me`; `/grill-with-docs` when decisions should also be recorded in the project |
| A large effort whose direction is still unclear | `/wayfinder` for a decision map |
| A formed decision needing opposing perspectives | `/roundtable` |
| A question that needs runnable evidence | `/prototype` |
| Technical facts or documentation need investigation | `/research` |
| Decisions live with someone else | `/to-questionnaire` |
| Agreement needs a durable specification | `/to-spec` |
| Work needs dependency-aware execution slices | `/to-tickets` |
| An approved source should execute in a Codex App fork | `/execute-spec-in-fork`; it requires the named task tools, `/spec-executor`, and Codex Task Messenger |
| A manually forked or isolated execution session already has its source | `/spec-executor` |
| Approved work needs portable context across sessions, people, or harnesses | `/to-goal` |
| Autonomous work needs a goal and completion criteria | `/goal-crafter`; a clear reminder goes directly to native scheduling |
| A bounded conversation, spec, or ticket is ready for implementation | `/implement` |
| Observable behavior should be developed test-first | `/tdd` |
| A review is requested | Use the available review capability; `/code-review` is an optional Standards + Spec review |
| An external issue or PR needs assessment and disposition | `/triage` |
| A complex failure needs diagnosis | `/diagnosing-bugs` |
| An existing merge or rebase needs conflict resolution | `/resolving-merge-conflicts` |
| Module boundaries or interfaces need design | `/codebase-design` |
| Architecture needs a simplification or deepening survey | `/improve-codebase-architecture` |
| Domain vocabulary, CONTEXT, or an ADR needs work | `/domain-modeling` |
| Agent-facing instructions need writing | `/writing-for-agents` |
| A specific upstream workflow needs tracker and domain-document setup | `/setup-matt-pocock-skills` |
| A human-only account or infrastructure step needs guidance | `/wizard` |
| An explanation in the current discussion was unclear | `/wait-what` |
| A topic needs structured teaching | `/teach` |

`/grilling` is the shared interview capability behind the grilling entries. `/handoff` carries otherwise-unrecorded context when crossing a boundary; it is unnecessary when the destination can reconstruct the task from existing sources.

## Execution and context boundaries

Already-approved conversations, specs, issues, and documents are valid sources. Goal and fork execution do not require a particular planning skill or a `SPEC READY` marker. `/implement` and `/spec-executor` choose validation and review methods for the task; neither requires `/tdd` or `/code-review` to be installed.

- Continue in the current session when its context remains useful and the task is small enough.
- Use a fork when inheriting the conversation helps and the requested isolation is for subsequent conversation. Forks share files; parallel implementation still needs workspace and ownership boundaries.
- Use `/to-goal` when the source needs compression or transport. It writes a contract; it does not create an execution environment.
- For a broader question about continuing, compacting, or handing off context, read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md).

## Deliver the recommendation

Name the next action, why it fits the current gap, and any prerequisite that affects whether it can run. Recommend additional steps only when they solve a known later need. This catalog describes available repository skills, not the user's installed inventory: a missing automatic-discovery entry does not prove that an explicit-only skill is absent. Verify installation when it matters.

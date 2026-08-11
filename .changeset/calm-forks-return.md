---
"matt-skills-with-to-goal": patch
---

Add `execute-spec-in-fork`, a Codex App orchestration skill that creates a same-directory execution fork from the final `SPEC READY`, launches `spec-executor` through Codex Task Messenger, routes decisions back to the planning task, validates the returned receipt, and archives only a correlated clean completion.

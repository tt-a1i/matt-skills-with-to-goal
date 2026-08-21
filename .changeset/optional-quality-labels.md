---
"matt-skills-with-to-goal": patch
---

Add an optional `Goal / spec quality` field to `spec-executor`'s `SPEC EXECUTION RECEIPT` so a completed run can record whether the contract was accurate, too vague, wrong, missing a constraint, or over-scoped. `execute-spec-in-fork` asks once before archive; a skip does not block using the receipt or archiving the child. Docs pages follow.

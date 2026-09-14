---
name: implement
description: "Implement bounded work from an approved conversation, spec, or ticket and verify its completion."
disable-model-invocation: true
---

Resolve the requested work from the approved conversation, spec, or ticket. For an ambiguous ticket number, use repository context to find the intended source before editing. Preserve settled decisions, existing authorization, and unrelated working-tree changes.

Choose implementation and validation methods for the requested behavior. Use test-first development when requested or useful; reuse established public test boundaries. A specialist skill is optional unless the task explicitly requires it.

Run the smallest meaningful checks while developing, then the repository-required checks applicable to the change. Expand validation when impact, failures, or missing coverage warrant it.

Review the complete task diff, including uncommitted changes, against the source criteria. Fix in-scope findings and rerun the affected checks. Finish with the implemented behavior, validation evidence, and any remaining gaps.

Commit or perform external actions only within authorization already provided by the user or approved source. Reuse that authorization without asking again; implementing the work alone does not grant permission to publish it.

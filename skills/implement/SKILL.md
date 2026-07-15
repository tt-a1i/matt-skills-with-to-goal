---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

If the input is a goal produced by `to-goal`, treat it as the execution contract. Do not re-interview the user, restate the ticket, or reopen product decisions. If execution is blocked by a genuinely missing decision that the goal and its cited sources do not resolve, stop and report that the goal was not agent-ready; do not start a new planning interview from the implementation session.

Use /tdd where possible, at pre-agreed seams.

Use the validation policy carried by the goal; `to-goal` owns that risk classification. Without a goal, follow repository and user instructions and always run the smallest applicable validation that can establish correctness rather than assuming the full suite is required. Skip tests only when there is no relevant test seam or non-test validation is sufficient for the low-risk change; report why and identify residual risk.

Once done, use /code-review against the pre-implementation fixed point recorded in the goal. If no fixed point was provided, use the implementation session's starting HEAD and state that choice explicitly.

Commit only when the goal, source context, or user authorizes a commit. Never infer permission to push, open a pull request, merge, or mutate tracker state.

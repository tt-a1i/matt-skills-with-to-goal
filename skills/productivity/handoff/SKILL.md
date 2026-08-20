---
name: handoff
description: Compact the current conversation into a portable handoff document, with an optional live clarification path for compatible Codex tasks.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS - not the current workspace.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

When the facts are available, include a compact **Continuation** section with:

- the exact source task ID (omit it rather than guessing),
- the current execution owner (`source`, `receiver`, or `unassigned`),
- the repository, branch, fixed point, and worktree state when relevant.

If the source and receiving sessions are existing Codex App tasks working in the same directory, suggest `/codex-task-messenger`. The receiver may use it to ask the source task one concrete question when the answer is not settled by the handoff or its referenced artifacts. A Messenger reply supplements the handoff; it does not replace the handoff or expand the user's authorization.

Before editing a shared directory, the receiver should confirm execution ownership once if the handoff leaves it unclear. Read-only clarification does not require an ownership transfer. If the source task is unavailable or Messenger is incompatible with the destination, continue from the handoff and referenced artifacts, surfacing only a real blocker.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

# The Codex App fork loop is an adapter, not a portable orchestration layer

`execute-spec-in-fork` is this fork's automatic closed loop: one approved `SPEC READY` becomes a disposable same-directory execution task, decisions travel through Codex Task Messenger, and a validated receipt archives the child. That loop is **Codex App only**. Other harnesses get the manual fallback — fork from the final spec, run `/spec-executor` there, paste the receipt back.

The loop has two hard dependencies:

- Codex App's native task tools (fork, message, read, name, pin, archive)
- Codex Task Messenger with its Ask / Reply / Resume card protocol (v2 or later)

Missing either is a refuse, not a degrade-in-place. Do not invent a new task or simulate the transport. Point at the manual route.

The skill programs against those tools by name. The names live in the [capability map](../../skills/engineering/execute-spec-in-fork/SKILL.md#harness-capability-map) and nowhere else. When the task API is renamed or reshaped, change that table; rewrite this adapter if the capabilities themselves move. That is accepted. We are **not** building a cross-harness orchestration abstraction — one real adapter plus an honest fallback is cheaper than a fake portable layer.

This ADR records the runtime orchestration dependency. Distribution shape (Claude plugin now, Codex plugin later) stays in [0002](./0002-ship-as-a-claude-code-plugin.md).

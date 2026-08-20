# Cross-ticket goals as the normal `to-goal` path

`to-goal` compiles one frontier ticket by default. Promoting its `--all` cross-ticket mode to the normal route, or to the default, is out of scope. The flag stays available on explicit request.

## Why this is out of scope

A goal is a contract that has to fit one fresh context window, and one ticket is the unit that reliably does. A cross-ticket goal is executable only on a harness that can renew its own context mid-run while preserving dependency order. On an ordinary fresh session it runs out of room somewhere in the middle, and that failure is quiet: the work stops looking finished rather than looking broken.

Scope attraction is the second cost. Once several tickets sit in one goal, the executing agent can see downstream work whose blockers have not cleared, and partially implementing it becomes the cheapest-looking next move. The one-ticket default exists to keep that work out of view until it is genuinely ready.

Verification is the third. Criteria for a single ticket can be checked one at a time against observable evidence. Across a chain, "done" degrades into a judgment about how far the run got — which is precisely the wish that a verifiable goal is supposed to replace.

The escape hatch is the flag itself. A user running a persistent goal loop who wants the whole chain asks for `--all`, and the compiled goal is labelled cross-context and carries its harness requirement with it. What is rejected is presenting that as the ordinary route.

## Prior requests

- tt-a1i/matt-skills-with-to-goal#7 — archived retroactively. `skills/engineering/to-goal/SKILL.md` instructed the agent never to present `--all` as the normal workflow, without recording why.

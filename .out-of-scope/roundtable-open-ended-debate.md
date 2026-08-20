# Open-ended debate rounds until the table converges

The roundtable runs exactly two rounds: parallel independent statements, then one anonymous cross-review. Adding further rounds, or looping until the seats agree, is out of scope.

## Why this is out of scope

Value and cost run in opposite directions across the rounds. Round one produces the arguments. Round two is where each argument first meets a rebuttal it cannot dismiss by authorship, which is where most of the information appears. By round three the seats are largely restating positions already on the record, while each extra round adds N more sub-agent runs to a session that already costs 2N.

Convergence is also the wrong success condition. A table that has not agreed after cross-review is reporting a real finding: the decision turns on a fact nobody at the table holds. The fixed output shape says exactly that — undefeated dissent survives into the verdict, and "what would change the verdict" names the missing fact. Looping to agreement would trade that honest split for a manufactured consensus, which is the failure the adversarial briefs exist to prevent.

There is a structural limit underneath the economics. Genuine multi-round conversation between agents needs turn-taking, shared mutable state, and a scheduler — an orchestration layer. This skill is prose in a `SKILL.md`. It can reliably describe two fan-out passes and one synthesis; it cannot reliably describe a convergence loop. Real agent-to-agent debate belongs to agent-team and orchestration tooling, and a skill that pretends to it fails in ways the user only discovers mid-run.

The escape hatch is the user's own judgment. Read the verdict, sharpen the motion with what the table surfaced, and convene a fresh one. A second deliberate table on a better motion beats a third automatic round on the original.

## Prior requests

- tt-a1i/matt-skills-with-to-goal#7 — archived retroactively. The two-round ceiling was stated in the skill's cost guardrails without its reasoning.

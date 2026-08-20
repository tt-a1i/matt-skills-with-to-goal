# A code-review variant of the roundtable

`roundtable` debates decisions and designs. A variant that points the same multi-seat debate at a diff, a branch, or a pull request is out of scope.

## Why this is out of scope

Diff review already has an owner. `code-review` runs a fixed two-axis review — Standards and Spec — in parallel sub-agents that report independently and deliberately do **not** rebut each other, because a reviewer's job is to state findings against a known bar rather than win an argument about them.

The roundtable's mechanism is the opposite by construction: adversarial seat briefs, anonymous cross-review, and a chaired verdict that preserves undefeated dissent. That machinery exists to settle a contested *choice*. A diff is not a contested choice — it is an artifact measured against criteria that were agreed upstream of it.

Building the variant would leave two skills answering "review my changes" with different shapes and different outputs, so the user has to know which is which before they can pick one. Overlapping responsibility costs more than the coverage it buys: every future change to review behaviour has to land twice, or the two drift apart.

The escape hatch composes the pieces that already exist. Run `code-review`, then hand its findings to the roundtable inside the evidence pack, with the motion phrased as the decision actually in dispute ("We should ship this diff as it stands"). The diff gets its multi-perspective argument, and the roundtable never grows a review mode.

## Prior requests

- tt-a1i/matt-skills-with-to-goal#7 — archived retroactively. `skills/engineering/roundtable/SKILL.md` carried the boundary as a one-line scope note with none of the reasoning behind it.

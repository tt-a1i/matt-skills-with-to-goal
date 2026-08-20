## What it does

`roundtable` pressure-tests a decision, plan, or proposal by dispatching parallel [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent) that each argue it from a deliberately opposed perspective, then synthesising the debate into one chaired verdict. Every seat is briefed to make the strongest case from its assigned perspective even where its all-things-considered judgement would land elsewhere — the design exists to defeat convergence, the failure mode where asking one model for "multiple opinions" returns the same opinion four times in different costumes.

Round one is isolated: no seat sees another seat's statement, so no one anchors on the first opinion voiced. Round two strips the seat names and shuffles the statements before each seat rebuts, so rebuttals attack claims, not personas. The verdict is advice, never action — the roundtable reports, the user decides.

## When to reach for it

You invoke this by typing `/roundtable` — the agent won't reach for it on its own.

| Your situation | Reach for |
| --- | --- |
| A decision or design is already formed and you want it attacked from several sides before committing | `roundtable` |
| The idea isn't formed yet — you need questions, not opponents | [grilling](https://aihero.dev/skills-grilling), which interviews *you* until the idea is sharp |
| The thing to judge is a diff or a branch | [code-review](https://aihero.dev/skills-code-review) — the roundtable is never pointed at code changes |
| You want your own thinking stress-tested conversationally | [grill-me](https://aihero.dev/skills-grill-me) |

The input has to survive being framed as a **motion** — a single debatable claim ("We should extract X into its own service"), not an open question. If your ask is still fog, the skill sends you to `/grilling` first rather than convening a table over mush.

## The motion, the seats, the chair

Three words carry the whole skill. The **motion** is the one-sentence claim the table supports or opposes; framing it is the gate, and a muddled motion fails in front of you, not inside four parallel subagents. The **seats** — by default Skeptic, Architect, User Advocate, Pragmatist, recomposable to any 3–5 perspectives — each receive the identical evidence pack and argue their brief. The **chair** is the main thread: it assembles the evidence before dispatch (seats don't hunt for facts), de-anonymizes after cross-review, and judges without averaging — dissent that no rebuttal actually defeated survives into the report, attributed to its seat.

Cost is bounded by construction: a full roundtable is 2N subagent runs (N statements, N anonymous cross-reviews), quick mode is N, and two rounds is the ceiling. A table that hasn't earned a verdict after cross-review reports the unresolved split and what evidence would settle it — that is a finding, not a failure.

## Common questions

**Why not just ask the agent to list pros and cons?**

Because one context window listing both sides self-moderates: it converges on a balanced-sounding middle and never commits to the strongest version of either attack. Isolated seats with adversarial briefs and anonymous cross-review force each argument to be made at full strength and then survive a rebuttal aimed at the claim rather than the arguer.

**How is this different from `/grilling`?**

Direction of fire. Grilling interrogates *you* to sharpen an idea that isn't formed yet; the roundtable takes a proposition that *is* formed and has models attack it from opposed perspectives. They chain: grill until a motion exists, then convene the table over it.

## It's working if

- The report arrives in the fixed shape — Verdict, Consensus, Dissent worth weighing, Vote table, What would change the verdict — with dissent attributed to named seats.
- The seats actually disagree; four instant agreements mean the motion was too easy to be worth a table.
- The verdict ends with the facts that would flip it, so you know what to check before acting.
- Nothing gets implemented afterward — the session hands the verdict back and stops.

## Where it fits

A reach-for-it-anytime standalone at the decision stage, before any spec or code exists. [grilling](https://aihero.dev/skills-grilling) is the upstream neighbour, because it forges the motion the table needs; [code-review](https://aihero.dev/skills-code-review) is the boundary neighbour, because judging a diff is its job, never the table's. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the whole set when you're unsure which skill the situation wants.

---
name: roundtable
description: Convene a roundtable of sub-agents that debate a decision or proposal from opposing perspectives — parallel independent statements, anonymous cross-review, then a chaired verdict reporting consensus and dissent.
disable-model-invocation: true
---

Pressure-test a decision, plan, or proposal by dispatching parallel sub-agents that argue it from deliberately opposed perspectives, then synthesising their debate into one verdict that preserves dissent.

Scope: decisions and designs only. Reviewing a diff is `/code-review`'s job — don't point the roundtable at code changes.

## Process

### 1. Frame the motion

Restate the user's question as a single debatable **motion** — a claim the table can support or oppose ("We should extract X into its own service"), not an open question ("What should we do about X?"). If the user's ask is too vague to frame, ask them to sharpen it first; if it's still fog, suggest running `/grilling` before convening the table.

Then assemble the **evidence pack** yourself, in the main thread: relevant file paths and excerpts, constraints, decisions already made, anything the user attached. Finding facts is the chair's job, not the seats' — sub-agents don't hunt on their own, so the whole table debates the same evidence.

Before dispatching anyone, confirm the motion is one sentence and the evidence pack is complete enough to argue from. A muddled motion should fail here — not inside four parallel sub-agents.

### 2. Seat the table

Default four seats:

- **Skeptic** — assumes the motion fails and argues why; enforces YAGNI; hunts hidden assumptions.
- **Architect** — argues from long-term structure: module depth, coupling, cost of evolution.
- **User Advocate** — argues from the experience of whoever uses or calls the result; real workflows over hypothetical ones.
- **Pragmatist** — argues from the shortest viable path: maintenance burden, opportunity cost, what ships this week.

The user may recompose the table for the topic ("seat a table of security experts") — keep it to 3–5 seats. Every seat brief, default or custom, must carry this line verbatim: **"Your job is to make the strongest case from this perspective, even if your all-things-considered judgement would land elsewhere."** That line is the first defence against convergence.

### 3. Round one — independent statements

Dispatch N sub-agents in parallel, one per seat. Each gets an identical input pack except for its seat brief — include:

- The motion, verbatim.
- The full evidence pack — the sub-agent has no other access to it.
- Its seat brief, including the strongest-case line from step 2.
- The output contract: "State your position (support / oppose / support-with-conditions), your three strongest arguments, and the single biggest risk you see. Under 300 words."

Isolation is the point: no seat sees another seat's statement, so no one anchors on the first opinion voiced.

### 4. Round two — anonymous cross-review

Skip this round only when the user asked for a **quick roundtable**.

Strip the seat names from the round-one statements, shuffle their order, and label them Position A, B, C, D. Dispatch N sub-agents in parallel again — each gets:

- The motion and evidence pack, as before.
- Its own seat brief, plus which anonymized position was its own.
- All anonymized positions in full.
- The brief: "Rebut the position you most disagree with, quoting the claim you're attacking. Concede any point in your own position that another position genuinely weakened. Rank A–D by persuasiveness, best to worst. Under 300 words."

Anonymization makes seats attack arguments, not personas — a rebuttal aimed at "the Skeptic" is theatre; one aimed at an unattributed claim has to engage the claim.

### 5. Chair's synthesis

The main thread de-anonymizes and judges. Judging is not averaging: a position isn't wrong because it's outnumbered, and dissent that no rebuttal actually defeated goes in the report intact, attributed to its seat. Fixed output shape:

```
## Verdict — the recommendation, one paragraph
## Consensus — points every seat agreed on
## Dissent worth weighing — undefeated objections, attributed to their seats
## Vote table — seat × position × cross-review ranking
## What would change the verdict — facts that would flip it
```

Don't act on the verdict — the roundtable advises; the user decides.

## Cost guardrails

A full roundtable is 2N sub-agent runs (N statements + N cross-reviews); quick mode is N. Two rounds is the ceiling — no open-ended debate loops. If the table hasn't earned a verdict after cross-review, that itself is the finding: report the unresolved split and what evidence would resolve it.

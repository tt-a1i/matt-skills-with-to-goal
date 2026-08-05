---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

## Question format

Lead each round with a fixed header, then emit every frontier question in one shape. Use emoji as **structure anchors** and **question-type signals** — not decoration in every sentence.

**Round header:**

```
🔥 **Round N** · K questions
```

**Each question** (one type emoji before the number):

```
<type> **QN** - **<question title>**
<body — prose and/or multiple choices>

💡 <your recommended answer>
```

**Round footer** (after the last question):

```
👇 Reply by number: `1) …  2) …  3) …`
```

### Type emoji (pick one that fits the decision)

| Type | Emoji | Use when |
|---|---|---|
| Scope / in-or-out | 🎯 | Boundary, YAGNI, what ships now |
| Trade-off | ⚖️ | A vs B, pick one path |
| Risk / failure | ⚠️ | What breaks, abuse cases, rollback |
| Naming / language | 🏷️ | Terms, glossary, how we say it |
| UX / UI | 👀 | What someone sees or clicks |
| Data / state | 🧩 | Model shape, transitions, schema |
| Cost / perf | ⚡ | Latency, money, scale |
| Auth / trust | 🔐 | Permissions, tenancy, secrets |
| Timing | ⏱️ | When, sequencing, milestones |
| Challenge | 🪞 | "Do you actually need this?" |
| Dependency | 🔗 | Blockers, prerequisites |
| Open / foggy | 💭 | Still ill-formed; need a direction |

Fixed skeleton (do not invent alternatives each round): `🔥` round · type emoji + `QN` · `💡` recommendation · `👇` reply prompt.

Keep the body text clean — at most one optional mood emoji in the round header line if it helps (e.g. a long session), never a spray of emoji inside the question body.

## Round loop

Each round the user answers reshapes the tree — settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it — don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report — ask the rest of the frontier now. The _decisions_ are the user's — put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

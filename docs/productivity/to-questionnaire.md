## What it does

`to-questionnaire` turns a decision you can't settle on your own into a **questionnaire**: a Markdown document you hand to the one person who holds what you're missing, for them to fill in async or for the two of you to work through in a meeting.

It grills you about the **send**, never the subject. An interview about the topic is pointless, because not knowing the topic is why you're writing to someone else. So it asks the two things you can always answer (who this is going to, and what you need back from them) and aims every question in the document at the **gap** between the two.

## When to reach for it

You invoke this by typing `/to-questionnaire`; the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

Reach for it when a decision is blocked on knowledge that lives in one other person's head: a client, a domain expert, an exec who owns the business rules, a colleague on a team you don't sit with. Which skill you want depends on where the answers are:

| The answers are in… | Reach for |
| --- | --- |
| Your own head, unsharpened | [grill-me](https://aihero.dev/skills-grill-me) |
| The codebase | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| Someone else's head | `to-questionnaire` |
| Nobody's head yet, the question needs something to react to | a prototype built directly with the agent |

The common case is a [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) session that stalls because some of the questions it raised aren't yours to answer. Run `/to-questionnaire` in that same conversation to take those questions offline, then bring the answers back and carry on.

## The send, not the subject

The interview is two exchanges, and then it stops.

- **Who is it going to?** Their role, their expertise, their relationship to you. This sets the tone and how much context the document has to carry. An outside client needs orienting; a teammate does not.
- **What do you need back?** The concrete decisions or facts you can't resolve alone. This becomes the checklist for the finished document. Every item you name gets a question aimed at it.

Everything after that is drafting. The skill writes the file to `to-questionnaire-<slug>.md` in the current directory. There is no setup, no workspace, and nothing to configure.

## The document

The document is a **discovery questionnaire**, because you lack the context and the recipient has it. That sets its shape:

- A purpose line naming the decision that depends on it, and a short context section for a recipient who knows none of your background.
- Questions ordered **most-important-first** and grouped under themed headings, because async means you may only get one pass.
- One idea per question, never compound, with an answer stub beneath it and a *why this matters* line only where a question could be misread.
- Explicit permission to answer "I don't know", because a flagged uncertainty is useful and a confident guess that reads like a fact is not.
- A closing catch-all: anything we didn't ask that we should know?

The document is deliberately not two things. It isn't **branching**. The questions are a flat, grouped list, not a tree that skips section D if you answered A. It isn't **multi-recipient** either. One run produces one document for one person.

## Common questions

**Does it read my grilling session and extract the questions from it?**
Not as a step of its own. The skill has no ingest phase. It asks about the send, then drafts. What makes it work after a grilling session is that you run it in the **same conversation**, so the [session](https://www.aihero.dev/ai-coding-dictionary/session) is already in [context](https://www.aihero.dev/ai-coding-dictionary/context) and the drafting can draw on it. If you start it in a fresh session, it knows nothing about the grilling, and you supply the topic again yourself when you answer "what do you need back?".

**The missing answers don't all live with the same person. Can it split them by recipient?**
No. Step one asks for *the* recipient, singular, and the skill pitches the tone and context of the whole document at them. If three people hold three parts of the answer, run it three times, once per person. People have asked for one document that routes questions by discipline or role, but that did not ship.

**Are the questions dependent: does it skip sections based on earlier answers?**
No. The dependent-question design was explored and did not ship. The output is a static document: themed groups, most-important-first, every question live. The objection to it is fair. A [model](https://www.aihero.dev/ai-coding-dictionary/model) that plans more than two or three questions ahead of a real answer plans badly, and a branching document has to plan all of them ahead of every answer.

**What if the recipient doesn't know either?**
The document tells them to say so. It explicitly asks for "I don't know" and partial answers. A flagged uncertainty is worth more than a guess, because a vague answer and a confidently wrong one look identical once they're back in your context.

**Does it send it anywhere (Slack, an issue tracker, email)?**
No. It writes a Markdown file in the current directory and tells you the path. Delivery is yours: paste it into a [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), drop it in a Slack thread, attach it to an email, or open it on a shared screen and work through it live. People have done all four by hand.

**Isn't this just `/grill-me` in batch mode?**
No. `grill-me` already asks in **rounds**. It asks the whole frontier of open questions at once, then recomputes it from your answers, so it already meets the "give me all the questions at once" need. `to-questionnaire` differs on another axis. It is about whose head the answers are in, not how the questions are delivered. To answer them yourself faster, use `grill-me`. To get them out of someone else, use this.

**Couldn't I just ask the agent for this without a skill?**
Yes, and plenty of people did before it existed: `OPEN_QUESTIONS.md` files, spreadsheets sent to clients, a "needs more info" ticket per unanswered question. The skill buys you two things: the interview never drifts onto the subject, and the document comes out in a shape a non-technical recipient can fill in. If you already have a house format that works, you don't need this.

## It's working if

- It asks about the recipient and about what you need back, then stops asking. If it asks about the subject itself, the skill has gone wrong.
- Every item you named as "what I need back" is traceable to a question in the file.
- The questions read as aimed at what the *recipient* knows, not as your own open questions copied down verbatim.
- You could hand the file to someone who wasn't in the conversation and they would know why they got it and by when to reply.
- The answers that come back are usable input for a new grilling round, rather than a fresh set of questions.

## Where it fits

Collect decisions or facts held by other people. `grill-me` clarifies what to ask; returned answers can inform `grill-with-docs` or an approved spec.

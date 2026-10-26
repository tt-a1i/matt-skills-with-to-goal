## What it does

You type `wait-what` when you did not understand a message. The [agent](https://www.aihero.dev/ai-coding-dictionary/agent) then re-pitches what it just said. It adds the context you were missing, writes in plain English, and uses the vocabulary from your project's `GLOSSARY.md`.

The skill is three lines long. That is the design, not an unfinished draft. Skills against verbosity usually fail because they grow too long. A four-hundred-line concision skill still leaves the [model](https://www.aihero.dev/ai-coding-dictionary/model) verbose, because the model copies the length of the skill, not its request. This one has a single precise leading word and nothing else.

## When to reach for it

You invoke it by typing `/wait-what`. The agent will not reach for it on its own, and it shouldn't. Only you know when you stopped following.

Use it as soon as you notice you're skimming. For example, the agent has started to use jargon it invented, put five acronyms in one sentence, or explained a decision whose premise you never saw. It fixes the conversation you're already in. To stop the jargon arriving at all, use [grill-with-docs](https://aihero.dev/skills-grill-with-docs), which builds the shared language upfront.

## The name is the mechanism

The leading word is **wait**. "Be concise" is an instruction about the agent's output, and the model obeys it by clipping words and losing you further. **Wait** is about *your* state. It says you stopped understanding here. An agent that hears "be brief" writes clipped fragments. An agent that hears "wait, you lost me" backs up and explains.

That difference is the whole skill. Every popular fix for verbosity names the *output*: `/tldr`, `/no-fluff`, `/talk-normal`. The model over-corrects into clipped fragments that are shorter and no clearer. Naming the *listener* asks for both halves at once: fewer words **and** the context you were missing.

The skill says re-pitch **that**, not "that last message". What lost you is usually bigger than one paragraph, so the agent decides how far back to go.

## It plugs into the language you already have

The body reuses the leading words already in your global `CLAUDE.md` and your project's `GLOSSARY.md`. ASD-STE100 Simplified Technical English sets the register. The ubiquitous language supplies the nouns. The skill, `CLAUDE.md` and `GLOSSARY.md` use the same [tokens](https://www.aihero.dev/ai-coding-dictionary/token), so invoking it is not a new instruction. It is a reminder of one the agent already agreed to.

If you have no `GLOSSARY.md` (and no `GLOSSARY-MAP.md` pointing to one for the context at hand), the skill still works. You lose only the domain-vocabulary half.

## It's working if

- The re-pitch is **shorter and clearer**, not shorter and blunter.
- It adds the premise you were missing, instead of only deleting words.
- Project nouns replace invented ones. The terms in your `GLOSSARY.md` come back.
- You can use it twice in a row, and it does not degrade into terseness.

## Where it fits

Re-explain a message when the necessary context did not land. `grill-with-docs` and `domain-modeling` can establish shared vocabulary earlier, but are not prerequisites for a clarification.

# Naming the roundtable skill `council`

The multi-perspective debate skill is called `roundtable`. Renaming it to `council`, or shipping `council` as an alias, is out of scope.

## Why this is out of scope

Three reasons, none of which depends on when the question gets asked.

**There is no official feature to be consistent with.** The original case for `council` was that it matched the harness. Claude Code ships no `council` feature, so the premise is simply untrue — the name would align this skill with nothing.

**The name is already taken in the ecosystem.** Community agent tooling publishes under it (`claude-council`, `unhingged/council`, among others). A user with both installed has two different things answering to one word, and every support conversation then opens with disambiguation instead of the actual question.

**The metaphor contradicts the mechanism.** A council is a body of advisors reporting upward: asymmetric, attributed, deferential to whoever decides. This skill seats 3–5 perspectives of *equal* standing, has each argue in isolation, then strips their names for an anonymous cross-review precisely so that no seat's authority can carry its argument. `roundtable` names that shape — equal seats, no head of the table — and the name has to keep teaching the mechanism, because the name is what the user recalls when reaching for the skill.

The escape hatch is local and complete. The skill is a directory of prose; anyone who prefers `council` renames it in their own install, and nothing except their own invocation depends on the folder name.

## Prior requests

- tt-a1i/matt-skills-with-to-goal#7 — archived retroactively. The decision was made in the design discussion that introduced `roundtable` and left no trace in the repository.

---
name: spec-executor
description: Execute approved, bounded work in an isolated implementation conversation and return a structured evidence receipt. Use with inherited history or an explicitly identified source; no particular planning, testing, or review skill is required.
---

# Spec Executor

Implement one approved unit of work in the isolated execution conversation. Treat its approved source as authoritative, keep implementation detail here, and return a compact receipt that can be pasted back.

## Resolve the execution contract

1. Resolve one approved source from inherited conversation history or the user's explicit reference. Later user corrections override older conflicting requirements.
2. Read the complete source, including directly linked decisions. Do not reconstruct a second long goal.
3. Confirm that the work is bounded enough for this implementation context and contains no unresolved product decisions. If not, stop and recommend a split or clarification without requiring a particular upstream workflow.
4. Extract and preserve:
   - repository and starting baseline;
   - user-visible outcome and acceptance criteria;
   - agreed validation seam;
   - explicit non-goals and workspace boundaries;
   - authorization for commit, push, review request, deployment, tracker edits, data changes, and other external effects.

Do not reopen settled product questions. Pause only when the approved source is internally contradictory, conflicts materially with the repository, lacks a required external contract, or requires new authority.

## Lock scope before editing

Inspect repository instructions, branch, `HEAD`, worktree status, recent relevant history, and the current implementation at the agreed seam. Record the actual pre-implementation `HEAD` as the review fixed point.

Send a short execution lock before substantive edits:

```text
Executing: <one-sentence outcome>
Source: <approved conversation, issue, file, or spec>
In scope: <compact list>
Out of scope: <compact list>
Validation: <primary seam and required gates>
External authority: <what is and is not authorized>
```

Create or switch to an appropriate local branch when needed. Never discard, overwrite, or absorb unrelated dirty or untracked work. If the requested baseline has drifted, determine whether the spec is still applicable and record the current fixed point; stop if drift changes product behavior or acceptance criteria.

## Implement the spec

1. Trace each acceptance criterion to existing behavior, the smallest code seam that can satisfy it, and observable evidence.
2. Choose an implementation and testing approach appropriate to the repository, risk, and agreed seam. Prefer behavior evidence over implementation-detail assertions.
3. Implement the narrowest complete vertical path. Do not pull in downstream tickets, opportunistic refactors, or new product behavior.
4. Run the smallest relevant check during development, then the repository-required broad gates in proportion to risk.
5. Compare the finished diff with every acceptance criterion and review it against the recorded baseline. Use an available specialist review skill or tool when useful, but do not require one. Fix in-scope critical findings and resolve or explicitly report the rest.
6. Inspect the final worktree and separate this execution's changes from anything pre-existing.

Invoking this skill authorizes in-scope local implementation and validation. It does not by itself authorize committing, pushing, opening or merging a review, changing tracker state, deploying, writing production data, calling costly real services, or messaging people. Perform those actions only when the approved source or a later user message explicitly authorizes them. Never broaden one authorization into another.

## Handle blockers and context overflow

When blocked, exhaust safe read-only investigation and local validation first. Then stop with evidence and the smallest decision or authority needed from the planning thread.

If the work proves too large for one reliable implementation context, do not continue by silently dropping history. Return a partial receipt, preserve the worktree, and recommend splitting or compiling the remaining slice into a portable goal.

## Return the receipt

Do not write a handoff file unless requested. End with one copy-pasteable block:

```text
SPEC EXECUTION RECEIPT

- Conclusion: completed / partially completed / blocked
- Spec source:
- Review fixed point:
- Acceptance criteria: <each criterion with pass/fail and evidence>
- Main changes:
- Changed files:
- Branch / commit / review:
- Validation results:
- Review findings:
- Not validated or not executed:
- Risks and remaining work:
- Planning-thread decision needed:
- Final worktree state:
- External effects: <push, deploy, tracker, data, real services, messages>
- Goal / spec quality: <optional: accurate / criteria-too-vague / criteria-wrong / missing-constraint / over-scoped — plus one sentence>
```

Keep the receipt concise but evidence-bearing. Include exact commands, counts, identifiers, and links when they materially prove completion. Never claim a real environment, deployment, or external action that was not verified.
Redact credentials, tokens, cookies, personal data, and sensitive environment identifiers before the receipt leaves the execution thread.

`Goal / spec quality` is optional and is not a completion condition. The execution agent may leave it blank. The planning thread or the user fills it after comparing the receipt with the actual diff.

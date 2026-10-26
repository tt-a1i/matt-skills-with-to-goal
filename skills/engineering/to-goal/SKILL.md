---
name: to-goal
description: Turn approved planning evidence or partially completed work into a portable, verifiable execution goal. Use when work needs to cross sessions, people, agents, or harnesses; no other skill or tracker setup is required.
disable-model-invocation: true
---

# To Goal

Compile approved work and its current state into a contract for a fresh execution session. Stay read-only: generating the goal does not implement work, edit a tracker, create a branch, or modify files.

## Source and scope

Use the latest approved conversation, spec, issue URL, or local document, including later corrections and relevant linked decisions. For tickets, read comments and dependencies rather than trusting labels. When no source is named, use the current conversation and repository evidence.

Default to one bounded, unblocked outcome. Preserve approval decisions; report missing decisions or blockers instead of reopening an interview. If several eligible outcomes are equally plausible, ask the user to choose. Work without tickets is equally valid.

`--all <parent>` explicitly selects a cross-ticket contract: preserve dependency order, distinguish the current frontier from later work, and state that execution needs a harness able to renew context. Otherwise keep the goal suitable for one fresh context.

## Evidence to carry

Inspect the target repository's instructions, branch, HEAD, dirty/untracked files, relevant implementation and validation entrypoints. Record HEAD as the review baseline. Against the approved criteria, distinguish evidence-backed completion, known remaining work, and unverified claims. A commit message alone does not prove completion.

The goal must preserve:

- The intended outcome and approved source, with enough context to locate the work.
- Current state, baseline and unrelated work to protect. Do not ask the executor to redo verified work or hide unverified gaps.
- Observable completion criteria and the relevant validation path. Preserve required product or human acceptance separately from automated checks.
- Scope and external-action permissions inherited from the user. Generating a goal grants no new authority; record actions requiring a later decision.
- Dependency order where it matters, especially for `--all`.

## Output

Return one concise, copyable goal. Plain Markdown is sufficient; adapt it to a known target harness when helpful. Include only the evidence, constraints and context needed for that work, rather than a fixed checklist or repeated policy text. If a source is not ready, return its concrete blockers or missing decisions instead.

Do not append a readiness ceremony, a mandatory capability taxonomy, or generic model advice. Preserve an explicit execution preference; make a recommendation only when requested.

This skill compiles an approved handoff. `goal-crafter` helps author a goal from an idea, while `spec-executor` executes approved work. Neither is a prerequisite.

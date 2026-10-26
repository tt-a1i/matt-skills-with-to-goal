# ADR 0004: Skills compose through artifacts, not mandatory chains

## Status

Accepted

## Context

The fork originally presented a full planning-to-execution pipeline. Its own Skills called named planning, testing, and review Skills, and the installation guide required repository setup before first use.

Modern coding agents can choose ordinary planning, implementation, testing, and review techniques without a dedicated Skill for every step. Mandatory cross-Skill calls add context and installation coupling, and they make otherwise useful boundary tools fail when one optional companion is absent.

The durable value in this fork is narrower: approved work should cross a context boundary without losing scope, authority, completion criteria, or evidence.

## Decision

Fork-owned Skills compose through plain artifacts and observable state:

- `to-goal` accepts approved evidence from a conversation, spec, issue, document, or repository state.
- `spec-executor` accepts one approved, bounded source and chooses implementation, validation, and review methods from the repository and available capabilities.
- `execute-spec-in-fork` accepts any approved, bounded source. It retains its concrete dependency on Codex App task tools, Codex Task Messenger, and `spec-executor` because those components implement its transport and receipt protocol.
- Specialized planning, testing, and review Skills are optional enhancements. Their absence must not block the core handoff or execution boundary.
- Installation documentation recommends selecting only the Skills a user needs. Repository setup is required only where a specific Skill declares a concrete dependency.

## Consequences

The repository can continue carrying the upstream catalog without presenting it as one required workflow. Goal and execution Skills remain useful as models improve because they stabilize boundaries rather than prescribe reasoning.

Some upstream Skills still describe their own opinionated chains. They remain available as independent choices and are not dependencies of the fork-owned core.

## Default-set refinement, 2026-10-26

The fork now distributes a curated subset rather than the complete upstream catalog. Ten generic workflow skills are archived under `skills/deprecated` with historical docs in `docs/archived`; their work can be requested directly from the agent. `pr`, `retro`, and `writing-for-agents` remain promoted references.

`goal-crafter` and `to-goal` keep separate authoring and approved-source compilation entrypoints. Both write a goal; `spec-executor` executes it. Their instructions carry outcomes, evidence and authority rather than fixed interviews, checklists or model tiers. `grill-me` and `grill-with-docs` retain upstream entrypoints, with the latter also invoking domain modeling for persisted glossary/ADR work.

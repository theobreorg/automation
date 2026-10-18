---
title: Test isolation
summary: Every test sets up its own state and can run alone, in any order, and in parallel.
principles:
- foundations
- isolation
baseline: 3
weights:
  large-suite: 1
  fast-feedback: 1
when:
- Always. Isolation is the precondition for parallelism and for trusting failures.
why:
- A failing test points to its own cause, not to a test that ran before it.
- Tests can be parallelized and sharded freely.
how:
- Give every test its own browser context, session, user account and data.
- Use unique identifiers per test instead of shared fixtures data.
- Clean up in teardown, but make correctness independent of cleanup.
related:
  tools:
  - playwright
  - testcontainers
  patterns:
  - fixture-lifecycle
  - test-data-builder
  practices: []
  guides: []
---



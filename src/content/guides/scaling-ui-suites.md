---
title: Scaling a UI end-to-end suite
summary: How to keep a growing browser suite fast, stable and readable as it passes hundreds of tests.
principles:
- architecture
- parallelism
- reliability
order: 1
readingMinutes: 6
when:
- Your UI suite is past a hundred tests and still growing.
- CI time and flakiness are rising together.
- Several teams add tests to the same suite.
why:
- UI tests are the most expensive tests you run, so each one must earn its place.
- Architecture decisions are cheap early and expensive after a thousand tests.
how:
- 'Push checks down: move validation and edge cases to unit, API and contract tests.'
- Adopt a layered architecture, with component objects or Screenplay for reuse.
- Isolate every test, set up through APIs, then parallelize and shard.
- Track flakiness per test and quarantine with owners.
caution:
- Adding retries and longer timeouts makes the dashboard green but the suite slower and less trustworthy.
related:
  tools:
  - playwright
  - cypress
  - allure
  patterns:
  - layered-architecture
  - screenplay
  - page-object
  practices:
  - api-driven-setup
  - parallel-sharding
  - flake-management
  guides: []
---

## Keep the top of the pyramid thin

A UI test should verify a critical journey, not every validation rule. A useful test for each UI spec: *would a customer notice if this broke, and could no cheaper test catch it?*

## Grow the architecture with the suite

| Suite size | Structure that fits |
| --- | --- |
| Up to ~50 tests | Specs plus page objects |
| 50 to 300 | Component objects, domain actions, fixtures |
| 300 and more | Screenplay or a strict layered architecture with ownership per area |

## Make speed a feature

Isolation comes first, because parallelism exposes every shared resource. Then run in parallel workers, shard across CI machines by duration, and set up data through APIs so each test spends its time on the behavior it checks.

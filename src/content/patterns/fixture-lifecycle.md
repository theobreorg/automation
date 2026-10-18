---
title: Fixture lifecycle
summary: Set up and tear down resources at the right scope (test, worker or session) with guaranteed cleanup.
principles:
- isolation
- foundations
baseline: 2
weights:
  large-suite: 1
  fast-feedback: 1
when:
- Tests share expensive resources such as browsers or containers.
- Cleanup is forgotten when tests fail.
why:
- Teardown runs even when a test fails.
- Expensive resources are created once per worker, cheap ones per test.
how:
- Use your runner's fixtures with explicit scope instead of before/after hooks with globals.
- Make per-test state the default and widen scope only for expensive, read-only resources.
- Keep teardown idempotent so it is safe after partial setup.
related:
  tools:
  - playwright
  - pytest
  patterns:
  - dependency-injection
  practices:
  - test-isolation
  guides: []
---



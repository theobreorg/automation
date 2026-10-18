---
title: Parallel runs and sharding
summary: Run tests across workers and CI machines, balanced by historical duration.
principles:
- parallelism
- observability
baseline: 0
weights:
  large-suite: 3
  fast-feedback: 3
when:
- The suite takes longer than the feedback time your team accepts.
- You have enough isolation for tests to run concurrently.
why:
- Feedback time shrinks roughly with the number of workers.
- Developers wait less, so they run the suite more often.
how:
- Make tests isolated first; parallelism exposes shared state immediately.
- Use worker-scoped resources and unique data per test.
- Shard across CI jobs and rebalance by recorded durations.
related:
  tools:
  - playwright
  patterns:
  - dependency-injection
  practices:
  - test-isolation
  guides: []
---



---
title: Testing asynchronous backends
summary: How to test event-driven systems and background jobs without sleeps or flaky timing.
principles:
- synchronization
- test-doubles
- observability
order: 3
readingMinutes: 4
when:
- Work happens in queues, event handlers or scheduled jobs.
- Results become visible only after eventual consistency settles.
why:
- Fixed waits are either too short (flaky) or too long (slow).
- Async failures are hard to diagnose without correlation.
how:
- Poll for the expected state with backoff and a hard timeout.
- Assert on events through a test consumer or broker container.
- Pass correlation IDs through messages and log them in test steps.
- Control clocks and schedulers so time-based jobs run on demand.
caution:
- Polling with no timeout hangs CI. Always set a hard limit and a clear failure message.
related:
  tools:
  - testcontainers
  - pact
  patterns: []
  practices:
  - signal-based-waiting
  - ephemeral-environments
  - failure-artifacts
  guides: []
---

```ts
await expect
  .poll(() => orders.status(orderId), { timeout: 15_000, intervals: [250, 500, 1000] })
  .toBe('shipped');
```

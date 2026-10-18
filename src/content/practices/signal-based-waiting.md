---
title: Wait on signals, not time
summary: Replace fixed sleeps with waits on element state, network responses or job status, with layered timeouts.
principles:
- synchronization
- reliability
baseline: 1
weights:
  flaky-suite: 3
  event-driven: 2
  web-spa: 1
when:
- Any UI or async test. Fixed sleeps are always the wrong tool.
- Tests pass locally but fail in CI.
why:
- Tests run as fast as the app allows instead of as slow as the worst case.
- Timing-related flakiness disappears.
how:
- Use auto-waiting actions and web-first assertions that poll until a timeout.
- Wait for the specific API response or event a step depends on.
- For async backends, poll the state with backoff and a hard timeout.
caution:
- Raising timeouts hides slowness. Investigate tests that need long timeouts.
related:
  tools:
  - playwright
  - cypress
  patterns: []
  practices: []
  guides:
  - testing-async-backends
---

```ts
// Instead of: await page.waitForTimeout(3000)
await expect(page.getByRole('status')).toHaveText('Payment received');
```

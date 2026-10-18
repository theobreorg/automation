---
title: Set up through APIs, not the UI
summary: Create preconditions through APIs or the database so UI tests only exercise the behavior they verify.
principles:
- test-data
- foundations
baseline: 1
weights:
  large-suite: 2
  fast-feedback: 1
  flaky-suite: 1
when:
- UI tests log in, create data or navigate through forms before the real check.
- Suites are slow and setup steps fail often.
why:
- API setup is many times faster and far more stable than clicking through the UI.
- Each UI test focuses on one behavior.
how:
- Wrap setup endpoints in typed API clients.
- Reuse authenticated state (storage state, tokens) instead of logging in through the UI each time.
- Keep one dedicated UI test for each setup flow you bypass.
related:
  tools:
  - playwright
  patterns:
  - api-client
  - test-data-builder
  practices: []
  guides: []
---



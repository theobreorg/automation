---
title: Capture evidence on failure
summary: Keep traces, screenshots, videos, network logs and console output for every failed test.
principles:
- reliability
- observability
baseline: 2
weights:
  flaky-suite: 2
  large-suite: 1
when:
- Failures in CI are hard to reproduce locally.
- Diagnosing a red build takes longer than fixing it.
why:
- Mean time to diagnose drops sharply when evidence is attached.
- Flaky failures can be analyzed after the fact.
how:
- Turn on traces or videos on first retry or on failure only, to keep runs fast.
- Upload artifacts from CI and link them from the report.
- Add correlation IDs so test steps link to backend logs.
related:
  tools:
  - playwright
  - allure
  patterns: []
  practices:
  - flake-management
  guides: []
---



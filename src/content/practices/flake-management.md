---
title: Flake detection and quarantine
summary: Track pass rates per test, quarantine flaky tests with an owner and a deadline, and fix root causes.
principles:
- reliability
- observability
- maintainability
baseline: -1
weights:
  flaky-suite: 5
  large-suite: 1
when:
- Re-running CI until it passes has become normal.
- The team has stopped trusting red builds.
why:
- Red builds mean something again.
- Flaky tests stop blocking unrelated changes while they are being fixed.
how:
- Record results per test across runs and flag tests that both pass and fail on the same commit.
- Move flaky tests to a non-blocking job, with an owner and a deadline.
- Allow at most one or two automatic retries in CI, and report every retry.
caution:
- Never retry business assertions until they pass. A retry is a safety net, not a fix.
related:
  tools:
  - allure
  patterns: []
  practices:
  - failure-artifacts
  - signal-based-waiting
  guides: []
---



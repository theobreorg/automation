---
title: Scenario context store
summary: A typed, test-scoped container for passing data between steps, such as created IDs, tokens or captured text.
principles:
- isolation
- architecture
baseline: 0
weights:
  bdd-stakeholders: 3
  large-suite: 1
when:
- Steps in BDD scenarios need data created by earlier steps.
- Tests pass IDs between helpers through globals.
why:
- Data flows explicitly through the test, never through shared statics.
- Typed fields catch mistakes that string keys hide.
- Automatic cleanup when the test ends.
how:
- Create one context object per test or scenario through your runner's injection.
- Prefer typed fields over a string-keyed map.
- Never share a context between tests.
related:
  tools:
  - karate
  patterns:
  - screenplay
  - dependency-injection
  practices: []
  guides: []
---



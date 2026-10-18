---
title: Dependency injection
summary: Pass drivers, clients, configuration and context into tests instead of reaching for singletons and static globals.
principles:
- architecture
- isolation
- parallelism
baseline: 0
weights:
  large-suite: 2
  fast-feedback: 1
  lang-java: 1
  lang-csharp: 1
when:
- Tests will run in parallel.
- You need to swap real and fake dependencies.
- Global state leaks between tests.
why:
- Each test gets its own instances, so parallel runs stay isolated.
- Mocks and fakes plug in without changing test code.
- Dependencies are visible in signatures instead of hidden in globals.
how:
- Use your runner's fixtures or DI container (Playwright fixtures, pytest fixtures, JUnit extensions, xUnit constructor injection).
- 'Scope each dependency deliberately: per test, per worker or per session.'
- Ban mutable statics in test code through linting or review.
related:
  tools:
  - junit5
  - xunit
  - pytest
  patterns:
  - fixture-lifecycle
  - strategy-pattern
  practices: []
  guides: []
---



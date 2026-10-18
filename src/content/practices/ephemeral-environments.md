---
title: Ephemeral environments
summary: Start real dependencies per run with containers or per-PR environments, so tests never share state.
principles:
- parallelism
- isolation
baseline: -1
weights:
  microservices: 2
  stateful-backend: 2
  event-driven: 1
when:
- Tests fight over a shared staging environment.
- Services depend on databases, brokers or caches.
why:
- Clean state on every run.
- Teams test changes without waiting for a shared environment.
how:
- Use Testcontainers for databases and brokers in integration tests.
- Spin up per-PR preview environments for end-to-end suites where possible.
- Seed data through APIs or migrations, never by hand.
related:
  tools:
  - testcontainers
  - wiremock
  patterns: []
  practices:
  - test-isolation
  guides: []
---



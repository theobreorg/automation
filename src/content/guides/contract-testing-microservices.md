---
title: Contract testing for microservices
summary: Replace most cross-service end-to-end runs with consumer-driven contracts and schema checks.
principles:
- test-doubles
- foundations
- parallelism
order: 2
readingMinutes: 5
when:
- Several services own their APIs and deploy independently.
- A shared end-to-end environment is slow, flaky or always broken.
- Breaking API changes reach production.
why:
- Contract tests catch breaking changes in the provider's own CI, minutes after the change.
- Teams deploy independently with evidence that versions are compatible.
how:
- Start with one consumer and one provider on your riskiest integration.
- Consumers publish pacts on every PR; providers verify them before deploying.
- Use a broker and its can-i-deploy check as a deployment gate.
- For public APIs, validate against the published OpenAPI schema instead.
caution:
- Contracts do not prove that a full journey works. Keep a thin smoke suite across services.
related:
  tools:
  - pact
  - schemathesis
  - wiremock
  patterns:
  - api-client
  practices:
  - ephemeral-environments
  guides: []
---

## Consumer-driven or schema-driven?

| Situation | Approach |
| --- | --- |
| You know all consumers (internal services, your own frontends) | Consumer-driven contracts with Pact |
| Consumers are unknown (public or partner APIs) | Schema-driven checks against OpenAPI or GraphQL, e.g. Schemathesis |
| Asynchronous messages | Message pacts or schema registries |

## What stays end-to-end

Keep a handful of smoke journeys that cross service boundaries in a deployed environment. Everything else about how services talk to each other belongs in contracts.

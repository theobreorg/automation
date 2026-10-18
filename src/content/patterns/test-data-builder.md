---
title: Test data builders and factories
summary: Create domain objects with sensible defaults and override only what each test cares about.
principles:
- test-data
- maintainability
baseline: 2
weights:
  stateful-backend: 1
  large-suite: 1
when:
- Tests need valid objects with many required fields.
- Setup code is copied between tests.
- Parallel runs collide on shared names or IDs.
why:
- Each test states only the data that matters to it.
- Defaults stay valid as the domain grows.
- Unique values per build make parallel runs safe.
how:
- Write a builder per aggregate with valid defaults.
- Generate unique fields (emails, names) with a seeded faker.
- Add intent-revealing shortcuts such as admin() or withLocale().
caution:
- Builders that hide important data make failures hard to read. Name the shortcuts after the behavior they enable.
related:
  tools:
  - faker
  patterns: []
  practices:
  - api-driven-setup
  - test-isolation
  guides: []
---

```ts
const user = await new UserBuilder().admin().withLocale('pl').create(api);
```

---
title: Screenplay
summary: Model tests as actors with abilities who perform tasks and ask questions, composing small reusable pieces into journeys.
principles:
- architecture
- maintainability
baseline: -2
weights:
  large-suite: 4
  bdd-stakeholders: 2
  qa-team: 1
  microservices: 1
when:
- Your UI suite has grown past a few hundred tests.
- Several user roles interact within one journey.
- Page objects have turned into god classes.
why:
- Small tasks compose into journeys, so suites scale without deep class hierarchies.
- Actors with abilities (browse the web, call an API) mix UI and API steps naturally.
- Specs read like the business process they verify.
how:
- Model one actor and three tasks for your most critical journey first.
- Keep page structure inside abilities and interactions, and keep specs free of locators.
- Introduce questions for everything specs assert on, so checks are reusable too.
caution:
- Screenplay adds vocabulary. For a small suite, page objects are simpler and enough.
related:
  tools: []
  patterns:
  - page-object
  - layered-architecture
  - scenario-context
  practices: []
  guides:
  - scaling-ui-suites
---

```ts
await actorCalled('Ana').attemptsTo(
  SignIn.as(customers.returning),
  AddToCart.item('espresso-beans'),
  Checkout.withSavedCard(),
);
await actorCalled('Ana').attemptsTo(Ensure.that(OrderStatus.latest(), equals('confirmed')));
```

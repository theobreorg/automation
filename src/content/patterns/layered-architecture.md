---
title: Layered test architecture
summary: Separate specs, domain actions, page or API abstractions and low-level drivers, so each layer changes for one reason.
principles:
- architecture
- maintainability
baseline: 3
weights:
  large-suite: 1
  microservices: 1
when:
- Any suite expected to outlive its first sprint.
- Several people or teams contribute tests.
- The same journeys run through UI and API.
why:
- A UI redesign touches page objects, not hundreds of specs.
- Specs read as business behavior because they contain no locators or raw HTTP calls.
- Drivers can be swapped (browser, device, environment) without touching specs.
how:
- 'Create four folders: specs, actions (domain tasks), pages or clients, and drivers or support.'
- 'Allow calls only downward: specs use actions, actions use pages and clients, pages use drivers.'
- Add a lint rule or code review check that rejects locators and URLs inside specs.
caution:
- Too many layers for a ten-test suite is ceremony. Start with specs and pages, add actions when duplication appears.
related:
  tools:
  - playwright
  patterns:
  - page-object
  - screenplay
  - api-client
  - dependency-injection
  practices: []
  guides: []
---

## The four layers

| Layer | Knows about | Example |
| --- | --- | --- |
| Specs | Business behavior | `checkout.spec.ts` |
| Domain actions | Journeys and tasks | `placeOrder(user, cart)` |
| Page and API objects | Screens, components, endpoints | `CartPage`, `OrdersClient` |
| Drivers and clients | Browsers, HTTP, devices | Playwright `page`, an HTTP client |

```ts
// specs/checkout.spec.ts: no locators, no URLs
test('a returning customer can reorder', async ({ actions }) => {
  const order = await actions.placeOrder({ items: ['espresso-beans'] });
  await actions.reorder(order.id);
  await expect(actions.orderHistory()).toContainOrder(order.items);
});
```

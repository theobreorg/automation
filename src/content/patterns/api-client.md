---
title: API client wrapper
summary: Put every HTTP or SDK call behind a typed client, so tests speak in domain requests and responses.
principles:
- architecture
- assertions
baseline: 1
weights:
  microservices: 2
  public-api: 2
  graphql: 1
  monolith: 1
when:
- Tests call the same endpoints from many places.
- You set up test data through APIs.
- Services evolve and response shapes change.
why:
- One place to update when an endpoint changes.
- Typed models catch contract drift at compile time.
- Auth, retries and logging are handled once.
how:
- Create one client per service or bounded context (OrdersClient, UsersClient).
- Return typed models and validate responses against a schema.
- Inject the base URL and credentials from configuration.
caution:
- Do not hide status codes completely; tests about errors need them.
related:
  tools:
  - rest-assured
  - playwright
  patterns:
  - layered-architecture
  - dependency-injection
  practices:
  - api-driven-setup
  guides: []
---

```ts
export class OrdersClient {
  constructor(private readonly http: HttpClient) {}

  async create(order: NewOrder): Promise<Order> {
    const res = await this.http.post('/orders', order);
    return OrderSchema.parse(await res.json());
  }
}
```

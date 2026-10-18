---
title: Page Object and Component Object
summary: Encapsulate the structure of a screen or a reusable widget behind methods that describe what a user can do.
principles:
- architecture
- maintainability
baseline: 1
weights:
  web-spa: 1
  web-ssr: 1
  legacy-ui: 2
  qa-team: 1
  mobile-native: 1
when:
- UI tests interact with the same screens from many specs.
- The UI changes often and selectors keep breaking.
- Widgets such as grids, modals or navigation repeat across pages.
why:
- Selectors live in one place, so a UI change is a one-line fix.
- Methods named after user intent make specs readable.
- Component objects compose, so you avoid one giant page class.
how:
- Create one class per reusable component (DataGrid, Modal) and compose them into page classes.
- Expose intent-level methods (addToCart) and return values or other page objects, not raw elements.
- Keep assertions in specs; page objects may expose state for specs to check.
caution:
- Page objects that grow to hundreds of methods are a sign to split into components or move to Screenplay.
related:
  tools:
  - playwright
  - selenium
  - cypress
  patterns:
  - layered-architecture
  - screenplay
  practices:
  - resilient-selectors
  guides: []
---

```ts
export class CartPage {
  readonly summary = new OrderSummary(this.page.getByTestId('order-summary'));

  constructor(private readonly page: Page) {}

  async removeItem(name: string) {
    await this.page.getByRole('row', { name }).getByRole('button', { name: 'Remove' }).click();
  }
}
```

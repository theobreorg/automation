---
title: Resilient selectors
summary: Locate elements by test IDs or accessible roles and names, not by brittle CSS chains or XPath.
principles:
- reliability
- maintainability
baseline: -1
weights:
  web-spa: 2
  web-ssr: 2
  legacy-ui: 2
  flaky-suite: 2
  a11y: 1
when:
- UI tests break when markup or styling changes.
- Developers and testers can agree on test IDs.
why:
- Selectors survive refactors of layout and CSS.
- Role-based locators double as a basic accessibility check.
how:
- Prefer role and accessible name, then dedicated data-testid attributes.
- Add test IDs in the app code as part of the definition of done.
- Avoid positional and deeply nested CSS or XPath.
caution:
- Self-healing locators can mask real regressions. Treat them as suggestions.
related:
  tools:
  - playwright
  - cypress
  - selenium
  patterns:
  - page-object
  practices: []
  guides: []
---



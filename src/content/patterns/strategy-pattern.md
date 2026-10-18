---
title: Strategy for environments and devices
summary: Swap browsers, devices, environments or authentication methods behind one interface, driven by configuration.
principles:
- architecture
- parallelism
baseline: 0
weights:
  cross-browser: 2
  mobile-native: 2
  legacy-ui: 1
when:
- The same tests run on several browsers, devices or environments.
- Authentication differs between environments.
why:
- Tests stay unchanged when the matrix changes.
- The run matrix is configuration, not code.
how:
- Define an interface (BrowserFactory, AuthStrategy) and one implementation per variant.
- Select the implementation from configuration or environment variables.
- Run the matrix in CI with projects or job parameters.
related:
  tools:
  - webdriverio
  - selenium
  - appium
  patterns:
  - dependency-injection
  practices: []
  guides: []
---



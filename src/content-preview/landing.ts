/**
 * Copy and sample data for the landing page in the design preview.
 * Step 2 replaces the samples here with real content collections; the 11 principle areas are
 * taken from the project brief and stay.
 */
import type { Trait } from '../components/islands/TraitPicker';

export const appShapes = [
  { label: 'Static site', note: 'A handful of pages' },
  { label: 'Single-page app', note: 'React · Vue · Angular' },
  { label: 'Full-stack web', note: 'SSR, auth, a database' },
  { label: 'Platform + mobile', note: 'Web, iOS, Android, public API' },
  { label: 'Enterprise microservices', note: 'Dozens of services, events, contracts' },
];

export const sampleTraits: Trait[] = [
  { id: 'spa', label: 'Single-page app' },
  { id: 'rest', label: 'REST APIs' },
  { id: 'graphql', label: 'GraphQL' },
  { id: 'microservices', label: 'Microservices' },
  { id: 'events', label: 'Event-driven' },
  { id: 'mobile', label: 'Mobile client' },
  { id: 'legacy', label: 'Legacy UI' },
  { id: 'a11y', label: 'Accessibility-critical' },
  { id: 'multi-tenant', label: 'Multi-tenant' },
];

export const sampleResult = {
  recommended: [
    { layer: 'UI end-to-end', pick: 'Playwright', score: 92, tone: 'lime' as const },
    { layer: 'API & contract', pick: 'Pact + typed clients', score: 88, tone: 'cyan' as const },
    { layer: 'Test data', pick: 'Builders + API seeding', score: 84, tone: 'violet' as const },
    { layer: 'Environments', pick: 'Testcontainers', score: 79, tone: 'amber' as const },
  ],
  runnersUp: ['Cypress', 'WebdriverIO', 'Spring Cloud Contract'],
  tradeoff:
    'Contract tests replace most cross-service end-to-end runs. You give up some confidence in full user journeys, so keep a thin smoke suite for the critical paths.',
};

export const categories = [
  { kind: 'tool' as const, title: 'Tools', glow: 'lime' as const, blurb: 'Runners, assertion libraries, mocking, reporting and infrastructure, mapped by what they are good at.', examples: ['Playwright', 'Pact', 'Testcontainers', 'Allure'] },
  { kind: 'pattern' as const, title: 'Patterns', glow: 'violet' as const, blurb: 'Design patterns that keep suites readable as they grow, from Page Objects to Screenplay.', examples: ['Screenplay', 'Builder', 'Service Object', 'Strategy'] },
  { kind: 'practice' as const, title: 'Practices', glow: 'cyan' as const, blurb: 'The habits that make tests fast, deterministic and trusted by the team.', examples: ['Test isolation', 'Flake quarantine', 'Sharding', 'Seeded data'] },
  { kind: 'guide' as const, title: 'Guides', glow: 'amber' as const, blurb: 'When, why and how to design and use a particular framework, with the trade-offs spelled out.', examples: ['Contract-first APIs', 'UI at scale', 'Async backends'] },
];

export const principles = [
  { title: 'Foundational principles', line: 'Independent, deterministic tests at the right level of the pyramid, with fast feedback.' },
  { title: 'Architecture & design patterns', line: 'Layered suites: specs, domain actions, page or API objects, drivers. No locators in specs.' },
  { title: 'Isolation & context', line: 'Every test gets its own context, data and typed state store, cleaned up automatically.' },
  { title: 'Parallelism & scale', line: 'Worker-scoped resources, sharding by duration and ephemeral environments.' },
  { title: 'Synchronization', line: 'Never sleep. Wait on signals, with web-first assertions and layered timeouts.' },
  { title: 'Reliability & flakes', line: 'Retry at the right level, quarantine with an owner and capture traces on failure.' },
  { title: 'Test data', line: 'API-driven setup, builders with overrides and seeded synthetic data.' },
  { title: 'Test doubles', line: 'Mocks, network interception, contract tests and control over clocks and flags.' },
  { title: 'Assertions', line: 'Expressive failures, schema validation and non-functional checks in one framework.' },
  { title: 'Observability & CI/CD', line: 'Correlated logs, rich reports, quality gates and test impact analysis.' },
  { title: 'Maintainability', line: 'Conventions, composable helpers, regular pruning and clear ownership.' },
];

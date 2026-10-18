# Stackwright: working rules

A static web app that helps a test automation architect compose the right test automation stack for an application under test, with "when / why / how" guidance for every choice. These rules come from the project owner and apply to every change.

## How we work

- **No implementation without approval.** Plan first; start building only after the owner approves the plan for that step.
- **Grow gradually.** New topics, comparisons and features are additive. They must not break working code or change the general design unless the owner explicitly asks.
- **Keep the door open to Next.js.** Content and scoring logic must not depend on Astro. Only page routing and layout components should need redoing in a migration.
- **v1 is fully static.** No backend, no login, no AI calls.
- **Playwright tests are skipped** until the owner decides otherwise. Unit tests (Vitest) cover pure logic.

## Stack

- Astro 7 (static output) + Tailwind CSS 4 + React 19 islands for interactive parts.
- Fonts are self-hosted via Fontsource: Geist (UI), Geist Mono (labels, data), Instrument Serif italic (headline emphasis only).
- Node 22.22+ (see `.nvmrc`).

## Layout

```
src/
  config/site.ts        product name, nav, href() helper that applies the base path
  styles/global.css     design tokens (both themes) and shared utilities
  layouts/              page shells
  components/ui/        design-system primitives (Button, Tag, Card, Meter, Callout, EntryCard, Guidance, …)
  components/site/      site chrome, page templates and signature visuals (Header, StackDiagram, CatalogPage, …)
  components/islands/   React islands (client-side interactivity only): Composer, TraitPicker, FitMeter
  content/              all content: tools (JSON), patterns/practices/guides (Markdown), principles,
                        composer questions, presets and layers (JSON)
  content.config.ts     registers content collections using the schemas from lib/schemas.ts
  data/content.ts       Astro-side helpers for reading collections (the only place pages call getCollection)
  lib/schemas.ts        Zod schemas for all content (framework-free)
  lib/scoring/          weighted scoring engine (framework-free, unit-tested)
  pages/                routes
```

## Content and scoring

- Add a tool: drop a JSON file in `src/content/tools/`. Add a pattern, practice or guide: a Markdown file whose frontmatter has `when`, `why` and `how` lists; the body is optional extra detail.
- Scoring: every layer, tool, pattern and practice has a `baseline` and `weights` (trait id → points). Score = baseline + weights of the selected traits. Layers scoring above zero are included; the best tool per layer wins; patterns and practices need a score of 2 or more. Tools can shift their baseline per layer with `layerAdjust`.
- Tune weights in the content files, never in code. `npm test` checks that every weight, preset and related link points at something that exists, and runs typical scenarios (`src/lib/scenarios.test.ts`) so tuning cannot silently break the main recommendations.
- Traits are defined once, in `src/content/questions.json`.

## Design system rules

- Use tokens, never raw colors: `bg-surface`, `text-fg-muted`, `border-line`, `text-accent-ink`, etc. New colors go into `src/styles/global.css` for **both** themes.
- `accent`/`violet`/`cyan`/`amber` are fills; the matching `*-ink` token is the text-safe version.
- Category hues carry meaning: tool = lime (accent), pattern = violet, practice = cyan, guide = amber. Don't use them decoratively.
- One `em-serif` phrase per headline, at most.
- Build pages from `components/ui` primitives; extend a primitive rather than restyling it inline.
- Every animation must degrade under `prefers-reduced-motion` (handled globally in `global.css`).
- Always link internally with `href()` from `src/config/site.ts` (or `Button href`) so the GitHub Pages base path is applied.
- `/design` is the living style guide. When adding a primitive, add it there too.

## Commands

```sh
npm run dev      # local dev server
npm run check    # types + content schemas
npm test         # unit tests
npm run build    # static build to dist/
npm run links    # internal link check on dist/
SITE_BASE=/ npm run build   # build for a host that serves from the root
```

## Deployment

GitHub Pages via `.github/workflows/deploy-pages.yml`, served at `https://theobreorg.github.io/automation/`. The workflow is skipped while the repo is private. CI (`ci.yml`) runs on every PR: check, tests, build, link check.

# Stackwright

Compose the right test automation stack for your application, with the when, why and how behind every choice.

A static site built with Astro, Tailwind CSS and React islands. See [CLAUDE.md](CLAUDE.md) for the working rules, project layout and design system conventions.

## Getting started

```sh
npm install
npm run dev
```

Open http://localhost:4321/automation/. The living style guide is at `/automation/design`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run check` | Type-check and validate content schemas |
| `npm test` | Run unit tests |
| `npm run build` | Build the static site into `dist/` |
| `npm run links` | Check that every internal link in `dist/` resolves |

/** End-to-end checks of the real content data through the scoring engine, for typical applications. */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { composeStack } from './scoring';

const dir = join(process.cwd(), 'src/content');
const load = (sub: string) =>
  readdirSync(join(dir, sub)).map((f) => {
    const raw = readFileSync(join(dir, sub, f), 'utf8');
    const data = f.endsWith('.json') ? JSON.parse(raw) : parse(raw.split(/^---$/m)[1]);
    return { id: f.replace(/\.(json|md)$/, ''), ...data };
  });

const input = {
  layers: JSON.parse(readFileSync(join(dir, 'layers.json'), 'utf8')),
  tools: load('tools'),
  patterns: load('patterns'),
  practices: load('practices'),
};

const compose = (...traits: string[]) => {
  const r = composeStack(input, new Set(traits));
  const picks = Object.fromEntries(r.layers.map((l) => [l.layer.item.id, l.pick?.item.id]));
  return { ...r, picks };
};

describe('typical stacks', () => {
  it('TypeScript single-page app', () => {
    const r = compose('web-spa', 'lang-ts', 'devs-write-tests', 'fast-feedback');
    expect(r.picks['ui-e2e']).toBe('playwright');
    expect(r.picks['unit-component']).toBe('vitest');
    expect(r.picks['doubles']).toBe('msw');
    expect(r.picks).not.toHaveProperty('mobile');
    expect(r.picks).not.toHaveProperty('contract');
  });

  it('Java microservices with databases', () => {
    const r = compose('web-spa', 'microservices', 'stateful-backend', 'lang-java', 'qa-team');
    expect(r.picks['api']).toBe('rest-assured');
    expect(r.picks['contract']).toBe('pact');
    expect(r.picks['environments']).toBe('testcontainers');
    expect(r.picks['unit-component']).toBe('junit5');
    expect(r.picks['doubles']).toBe('wiremock');
  });

  it('Python public API', () => {
    const r = compose('public-api', 'lang-python');
    expect(r.picks['api']).toBe('pytest');
    expect(r.picks['contract']).toBe('schemathesis');
    expect(r.picks).not.toHaveProperty('ui-e2e');
  });

  it('.NET legacy web app with cross-browser needs', () => {
    const r = compose('legacy-ui', 'lang-csharp', 'cross-browser', 'qa-team');
    expect(['playwright', 'selenium']).toContain(r.picks['ui-e2e']);
    expect(r.picks['unit-component']).toBe('xunit');
  });

  it('adds mobile, accessibility and performance layers only when asked', () => {
    const r = compose('mobile-native', 'web-spa', 'a11y', 'performance', 'lang-ts');
    expect(r.picks['mobile']).toBeDefined();
    expect(r.picks['a11y']).toBe('axe-core');
    expect(r.picks['performance']).toBe('k6');
  });

  it('recommends Screenplay for large suites and flake management for flaky ones', () => {
    expect(compose('web-spa', 'large-suite', 'bdd-stakeholders').patterns.map((p) => p.item.id)).toContain('screenplay');
    expect(compose('web-spa', 'flaky-suite').practices.map((p) => p.item.id)).toContain('flake-management');
    expect(compose('web-spa').patterns.map((p) => p.item.id)).not.toContain('screenplay');
  });
});

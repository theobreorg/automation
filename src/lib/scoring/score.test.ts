import { describe, expect, it } from 'vitest';
import { composeStack, fitPercent, rank, scoreItem } from './index';

const item = (id: string, baseline: number, weights: Record<string, number> = {}) => ({ id, baseline, weights });

describe('scoreItem', () => {
  it('adds the weights of selected traits to the baseline', () => {
    const s = scoreItem(item('a', 2, { spa: 3, mobile: -2, java: 5 }), new Set(['spa', 'mobile']));
    expect(s.score).toBe(3);
  });

  it('lists contributions strongest first and ignores unselected traits', () => {
    const s = scoreItem(item('a', 0, { spa: 1, mobile: -4, java: 5 }), new Set(['spa', 'mobile']));
    expect(s.contributions).toEqual([
      { trait: 'mobile', weight: -4 },
      { trait: 'spa', weight: 1 },
    ]);
  });

  it('returns the baseline when nothing is selected', () => {
    expect(scoreItem(item('a', 4, { spa: 3 }), new Set()).score).toBe(4);
  });
});

describe('fitPercent', () => {
  it('maps a neutral score to 50 and stays within 1–99', () => {
    expect(fitPercent(0)).toBe(50);
    expect(fitPercent(100)).toBe(99);
    expect(fitPercent(-100)).toBe(1);
  });

  it('increases with the score', () => {
    expect(fitPercent(3)).toBeGreaterThan(fitPercent(1));
  });
});

describe('rank', () => {
  it('sorts by score, then by id for ties', () => {
    const ranked = rank([item('b', 1), item('c', 3), item('a', 1)], new Set());
    expect(ranked.map((r) => r.item.id)).toEqual(['c', 'a', 'b']);
  });
});

describe('composeStack', () => {
  const input = {
    layers: [
      { ...item('ui', 1), name: 'UI', order: 1 },
      { ...item('mobile', -5, { native: 8 }), name: 'Mobile', order: 2 },
      { ...item('api', 0, { services: 2 }), name: 'API', order: 3 },
    ],
    tools: [
      { ...item('pw', 3, { java: 1 }), name: 'Playwright', layers: ['ui', 'api'] },
      { ...item('cy', 2, { java: -6 }), name: 'Cypress', layers: ['ui'] },
      { ...item('wd', 1), name: 'WebdriverIO', layers: ['ui'] },
      { ...item('se', 0), name: 'Selenium', layers: ['ui'] },
      { ...item('ap', 2), name: 'Appium', layers: ['mobile'] },
    ],
    patterns: [item('layered', 3), item('screenplay', -2, { big: 4 })],
    practices: [item('isolation', 3), item('sharding', 0, { big: 3 })],
  };

  it('includes only layers that score above zero, in layer order', () => {
    const r = composeStack(input, new Set(['services']));
    expect(r.layers.map((l) => l.layer.item.id)).toEqual(['ui', 'api']);
    expect(r.skipped.map((l) => l.item.id)).toEqual(['mobile']);
  });

  it('picks the top tool per layer and keeps two runners-up', () => {
    const r = composeStack(input, new Set(['java']));
    const ui = r.layers.find((l) => l.layer.item.id === 'ui')!;
    expect(ui.pick?.item.id).toBe('pw');
    expect(ui.runnersUp.map((t) => t.item.id)).toEqual(['wd', 'se']);
  });

  it('adds a layer when a trait pulls it above zero', () => {
    const r = composeStack(input, new Set(['native']));
    expect(r.layers.map((l) => l.layer.item.id)).toContain('mobile');
  });

  it('recommends patterns and practices that reach the threshold', () => {
    expect(composeStack(input, new Set()).patterns.map((p) => p.item.id)).toEqual(['layered']);
    expect(composeStack(input, new Set(['big'])).practices.map((p) => p.item.id)).toEqual(['isolation', 'sharding']);
  });
});

describe('composeStack layerAdjust', () => {
  it('adjusts a tool baseline only in the named layer', () => {
    const r = composeStack(
      {
        layers: [
          { ...item('ui', 1), name: 'UI', order: 1 },
          { ...item('api', 1), name: 'API', order: 2 },
        ],
        tools: [
          { ...item('pw', 3), name: 'Playwright', layers: ['ui', 'api'], layerAdjust: { api: -4 } },
          { ...item('ra', 1), name: 'REST Assured', layers: ['api'] },
        ],
        patterns: [],
        practices: [],
      },
      new Set(),
    );
    expect(r.layers.map((l) => l.pick?.item.id)).toEqual(['pw', 'ra']);
    expect(r.layers[1].runnersUp[0].score).toBe(-1);
  });
});

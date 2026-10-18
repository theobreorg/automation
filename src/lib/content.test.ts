/**
 * Integrity checks across content files: every schema passes, and every weight and related link
 * points at something that exists. Runs without Astro, straight from the files on disk.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import {
  guideSchema,
  layerSchema,
  patternSchema,
  practiceSchema,
  presetSchema,
  principleSchema,
  questionSchema,
  toolSchema,
} from './schemas';

const dir = join(process.cwd(), 'src/content');
const json = (p: string) => JSON.parse(readFileSync(join(dir, p), 'utf8'));
const entries = (sub: string, ext: '.json' | '.md') =>
  readdirSync(join(dir, sub))
    .filter((f) => f.endsWith(ext))
    .map((f) => {
      const raw = readFileSync(join(dir, sub, f), 'utf8');
      const data = ext === '.json' ? JSON.parse(raw) : parse(raw.split(/^---$/m)[1]);
      return { id: f.slice(0, -ext.length), data };
    });

const principles = principleSchema.array().parse(json('principles.json'));
const questions = questionSchema.array().parse(json('questions.json'));
const presets = presetSchema.array().parse(json('presets.json'));
const layers = layerSchema.array().parse(json('layers.json'));
const tools = entries('tools', '.json').map((e) => ({ id: e.id, ...toolSchema.parse(e.data) }));
const patterns = entries('patterns', '.md').map((e) => ({ id: e.id, ...patternSchema.parse(e.data) }));
const practices = entries('practices', '.md').map((e) => ({ id: e.id, ...practiceSchema.parse(e.data) }));
const guides = entries('guides', '.md').map((e) => ({ id: e.id, ...guideSchema.parse(e.data) }));

const traitIds = new Set(questions.flatMap((q) => q.traits.map((t) => t.id)));
const ids = {
  tools: new Set(tools.map((t) => t.id)),
  patterns: new Set(patterns.map((p) => p.id)),
  practices: new Set(practices.map((p) => p.id)),
  guides: new Set(guides.map((g) => g.id)),
};

describe('content', () => {
  it('has all 11 principle areas', () => {
    expect(principles.map((p) => p.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('uses unique trait ids across questions', () => {
    const all = questions.flatMap((q) => q.traits.map((t) => t.id));
    expect(new Set(all).size).toBe(all.length);
  });

  it('only weights traits that exist', () => {
    const scorables = [...layers, ...tools, ...patterns, ...practices];
    const unknown = scorables.flatMap((s) => Object.keys(s.weights).filter((k) => !traitIds.has(k)).map((k) => `${s.id}: ${k}`));
    expect(unknown).toEqual([]);
  });

  it('builds presets only from existing traits', () => {
    expect(presets.flatMap((p) => p.traits.filter((t) => !traitIds.has(t)).map((t) => `${p.id}: ${t}`))).toEqual([]);
  });

  it('assigns every tool to existing layers, and every layer has a tool', () => {
    const layerIds = new Set(layers.map((l) => l.id));
    expect(tools.flatMap((t) => t.layers.filter((l) => !layerIds.has(l)).map((l) => `${t.id}: ${l}`))).toEqual([]);
    expect(layers.filter((l) => !tools.some((t) => t.layers.includes(l.id))).map((l) => l.id)).toEqual([]);
  });

  it('links only to entries that exist', () => {
    const all = [...tools, ...patterns, ...practices, ...guides];
    const broken = all.flatMap((e) =>
      (Object.keys(ids) as (keyof typeof ids)[]).flatMap((kind) =>
        e.related[kind].filter((r) => !ids[kind].has(r)).map((r) => `${e.id} → ${kind}/${r}`),
      ),
    );
    expect(broken).toEqual([]);
  });
});

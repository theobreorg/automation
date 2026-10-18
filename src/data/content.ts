/**
 * Astro-side access to content collections. Pages import from here; the scoring engine and
 * schemas in src/lib stay framework-free.
 */
import { getCollection } from 'astro:content';
import type { LanguageId, PrincipleId } from '../lib/schemas';

export type Kind = 'tool' | 'pattern' | 'practice' | 'guide';

export const kindMeta: Record<Kind, { label: string; plural: string; path: string }> = {
  tool: { label: 'Tool', plural: 'Tools', path: '/tools' },
  pattern: { label: 'Pattern', plural: 'Patterns', path: '/patterns' },
  practice: { label: 'Practice', plural: 'Practices', path: '/practices' },
  guide: { label: 'Guide', plural: 'Guides', path: '/guides' },
};

export const languageLabels: Record<LanguageId, string> = {
  ts: 'TypeScript / JS',
  java: 'Java / Kotlin',
  python: 'Python',
  csharp: 'C# / .NET',
  go: 'Go',
  any: 'Any language',
};

const byNumber = <T extends { data: { number: number } }>(a: T, b: T) => a.data.number - b.data.number;
const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;
const byName = <T extends { data: { name?: string; title?: string } }>(a: T, b: T) =>
  (a.data.name ?? a.data.title ?? '').localeCompare(b.data.name ?? b.data.title ?? '');

export const getPrinciples = async () => (await getCollection('principles')).sort(byNumber);
export const getQuestions = async () => (await getCollection('questions')).sort(byOrder);
export const getPresets = async () => (await getCollection('presets')).sort(byOrder);
export const getLayers = async () => (await getCollection('layers')).sort(byOrder);
export const getTools = async () => (await getCollection('tools')).sort(byName);
export const getPatterns = async () => (await getCollection('patterns')).sort(byName);
export const getPractices = async () => (await getCollection('practices')).sort(byName);
export const getGuides = async () => (await getCollection('guides')).sort(byOrder);

/** Every trait id → its label, for showing why something scored the way it did. */
export async function getTraitLabels(): Promise<Record<string, string>> {
  const questions = await getQuestions();
  return Object.fromEntries(questions.flatMap((q) => q.data.traits.map((t) => [t.id, t.label])));
}

export interface EntryRef {
  kind: Kind;
  id: string;
  title: string;
  summary: string;
  principles: PrincipleId[];
}

/** All tools, patterns, practices and guides as uniform references, for cards and cross-links. */
export async function getAllEntries(): Promise<EntryRef[]> {
  const [tools, patterns, practices, guides] = await Promise.all([getTools(), getPatterns(), getPractices(), getGuides()]);
  return [
    ...tools.map((e) => ({ kind: 'tool' as const, id: e.id, title: e.data.name, summary: e.data.summary, principles: e.data.principles })),
    ...patterns.map((e) => ({ kind: 'pattern' as const, id: e.id, title: e.data.title, summary: e.data.summary, principles: e.data.principles })),
    ...practices.map((e) => ({ kind: 'practice' as const, id: e.id, title: e.data.title, summary: e.data.summary, principles: e.data.principles })),
    ...guides.map((e) => ({ kind: 'guide' as const, id: e.id, title: e.data.title, summary: e.data.summary, principles: e.data.principles })),
  ];
}

export const entryPath = (kind: Kind, id: string) => `${kindMeta[kind].path}/${id}`;

/** Resolves an entry's `related` block into references, in the order tools, patterns, practices, guides. */
export async function resolveRelated(related: { tools: string[]; patterns: string[]; practices: string[]; guides: string[] }) {
  const all = await getAllEntries();
  const find = (kind: Kind, id: string) => all.find((e) => e.kind === kind && e.id === id);
  return [
    ...related.tools.map((id) => find('tool', id)),
    ...related.patterns.map((id) => find('pattern', id)),
    ...related.practices.map((id) => find('practice', id)),
    ...related.guides.map((id) => find('guide', id)),
  ].filter((e): e is EntryRef => Boolean(e));
}

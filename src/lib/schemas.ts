/**
 * Content schemas. Plain Zod with no Astro imports, so the same schemas validate content in
 * Astro (src/content.config.ts), in unit tests, and in any future framework.
 */
import { z } from 'zod';

export const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens');

/** Trait id → points. Positive weights pull an item up when the trait is selected, negative weights push it down. */
export const weightsSchema = z.record(slug, z.number().int().min(-10).max(10));

export const principleIds = [
  'foundations',
  'architecture',
  'isolation',
  'parallelism',
  'synchronization',
  'reliability',
  'test-data',
  'test-doubles',
  'assertions',
  'observability',
  'maintainability',
] as const;
export const principleId = z.enum(principleIds);

export const languageIds = ['ts', 'java', 'python', 'csharp', 'go', 'any'] as const;
export const languageId = z.enum(languageIds);

export const relatedSchema = z
  .object({
    tools: z.array(slug).default([]),
    patterns: z.array(slug).default([]),
    practices: z.array(slug).default([]),
    guides: z.array(slug).default([]),
  })
  .default({ tools: [], patterns: [], practices: [], guides: [] });

/** One of the 11 principle areas from the project brief. */
export const principleSchema = z.object({
  id: principleId,
  number: z.number().int().min(1),
  title: z.string(),
  line: z.string(),
  points: z.array(z.string()).min(1),
});

/** A Stack Composer question and the traits a user can pick for it. */
export const questionSchema = z.object({
  id: slug,
  order: z.number().int(),
  title: z.string(),
  prompt: z.string(),
  traits: z
    .array(
      z.object({
        id: slug,
        label: z.string(),
        hint: z.string().optional(),
      }),
    )
    .min(2),
});

/** A ready-made set of traits the Stack Composer can start from. */
export const presetSchema = z.object({
  id: slug,
  order: z.number().int(),
  label: z.string(),
  traits: z.array(slug).min(1),
});

/** A layer of the test architecture (UI end-to-end, API, contract …). Included in a stack when its score is above zero. */
export const layerSchema = z.object({
  id: slug,
  name: z.string(),
  order: z.number().int(),
  description: z.string(),
  baseline: z.number().int(),
  weights: weightsSchema,
});

export const toolSchema = z.object({
  name: z.string(),
  summary: z.string(),
  url: z.url(),
  license: z.string(),
  layers: z.array(slug).min(1),
  languages: z.array(languageId).min(1),
  baseline: z.number().int(),
  /** Per-layer baseline adjustment, for tools that serve one layer better than another. */
  layerAdjust: z.record(slug, z.number().int().min(-10).max(10)).default({}),
  weights: weightsSchema,
  strengths: z.array(z.string()).min(1),
  tradeoffs: z.array(z.string()).min(1),
  principles: z.array(principleId).default([]),
  related: relatedSchema,
});

/** Shared shape of patterns, practices and guides: every entry answers when, why and how. */
const guidanceFields = {
  title: z.string(),
  summary: z.string(),
  principles: z.array(principleId).min(1),
  when: z.array(z.string()).min(1),
  why: z.array(z.string()).min(1),
  how: z.array(z.string()).min(1),
  caution: z.array(z.string()).default([]),
  related: relatedSchema,
};

export const patternSchema = z.object({
  ...guidanceFields,
  baseline: z.number().int(),
  weights: weightsSchema,
});

export const practiceSchema = patternSchema;

export const guideSchema = z.object({
  ...guidanceFields,
  order: z.number().int(),
  readingMinutes: z.number().int().min(1),
});

export type Principle = z.infer<typeof principleSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Preset = z.infer<typeof presetSchema>;
export type Layer = z.infer<typeof layerSchema>;
export type Tool = z.infer<typeof toolSchema>;
export type Pattern = z.infer<typeof patternSchema>;
export type Practice = z.infer<typeof practiceSchema>;
export type Guide = z.infer<typeof guideSchema>;
export type LanguageId = (typeof languageIds)[number];
export type PrincipleId = (typeof principleIds)[number];

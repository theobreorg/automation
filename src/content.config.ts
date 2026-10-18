import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  guideSchema,
  layerSchema,
  patternSchema,
  practiceSchema,
  presetSchema,
  principleSchema,
  questionSchema,
  toolSchema,
} from './lib/schemas';

// Schemas live in src/lib/schemas.ts (plain Zod) so they can be reused outside Astro.
export const collections = {
  principles: defineCollection({ loader: file('src/content/principles.json'), schema: principleSchema }),
  questions: defineCollection({ loader: file('src/content/questions.json'), schema: questionSchema }),
  presets: defineCollection({ loader: file('src/content/presets.json'), schema: presetSchema }),
  layers: defineCollection({ loader: file('src/content/layers.json'), schema: layerSchema }),
  tools: defineCollection({ loader: glob({ pattern: '*.json', base: 'src/content/tools' }), schema: toolSchema }),
  patterns: defineCollection({ loader: glob({ pattern: '*.md', base: 'src/content/patterns' }), schema: patternSchema }),
  practices: defineCollection({ loader: glob({ pattern: '*.md', base: 'src/content/practices' }), schema: practiceSchema }),
  guides: defineCollection({ loader: glob({ pattern: '*.md', base: 'src/content/guides' }), schema: guideSchema }),
};

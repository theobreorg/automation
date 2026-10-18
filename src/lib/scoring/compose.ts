import { rank, type Scorable, type Scored } from './score';

export interface LayerInput extends Scorable {
  name: string;
  order: number;
}

export interface ToolInput extends Scorable {
  name: string;
  layers: string[];
  /** Added to the baseline when the tool is scored for that layer. */
  layerAdjust?: Record<string, number>;
}

export interface ComposeInput<L extends LayerInput, T extends ToolInput, P extends Scorable, R extends Scorable> {
  layers: readonly L[];
  tools: readonly T[];
  patterns: readonly P[];
  practices: readonly R[];
}

export interface LayerResult<L extends LayerInput, T extends ToolInput> {
  layer: Scored<L>;
  pick: Scored<T> | null;
  runnersUp: Scored<T>[];
}

export interface StackResult<L extends LayerInput, T extends ToolInput, P extends Scorable, R extends Scorable> {
  layers: LayerResult<L, T>[];
  /** Layers that scored zero or below for this application, so they are left out of the stack. */
  skipped: Scored<L>[];
  patterns: Scored<P>[];
  practices: Scored<R>[];
}

export const RUNNERS_UP = 2;
/** Patterns and practices need at least this score to be recommended. */
export const GUIDANCE_THRESHOLD = 2;
export const GUIDANCE_LIMIT = 5;

/**
 * Composes a full stack: which layers the application needs, the best tool for each layer
 * with runners-up, and the patterns and practices that fit.
 */
export function composeStack<L extends LayerInput, T extends ToolInput, P extends Scorable, R extends Scorable>(
  input: ComposeInput<L, T, P, R>,
  selected: ReadonlySet<string>,
): StackResult<L, T, P, R> {
  const scoredLayers = rank(input.layers, selected);
  const included = scoredLayers.filter((l) => l.score > 0).sort((a, b) => a.item.order - b.item.order);
  const skipped = scoredLayers.filter((l) => l.score <= 0).sort((a, b) => a.item.order - b.item.order);

  const layers = included.map((layer) => {
    const id = layer.item.id;
    const candidates = rank(
      input.tools
        .filter((t) => t.layers.includes(id))
        .map((t) => ({ ...t, baseline: t.baseline + (t.layerAdjust?.[id] ?? 0) })),
      selected,
    );
    return { layer, pick: candidates[0] ?? null, runnersUp: candidates.slice(1, 1 + RUNNERS_UP) };
  });

  const guidance = <X extends Scorable>(items: readonly X[]) =>
    rank(items, selected)
      .filter((s) => s.score >= GUIDANCE_THRESHOLD)
      .slice(0, GUIDANCE_LIMIT);

  return { layers, skipped, patterns: guidance(input.patterns), practices: guidance(input.practices) };
}

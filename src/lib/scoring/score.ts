/**
 * Weighted scoring for the Stack Composer. Plain TypeScript, no framework imports.
 *
 * Every candidate (a layer, a tool, a pattern, a practice) has a baseline and a map of
 * trait weights. Its score is the baseline plus the weights of the traits the user picked.
 * Scores are tuned in the content data files, never here.
 */

export interface Scorable {
  id: string;
  baseline: number;
  weights: Record<string, number>;
}

export interface Contribution {
  trait: string;
  weight: number;
}

export interface Scored<T extends Scorable> {
  item: T;
  score: number;
  /** 0–100, for display only. 50 means a neutral score of 0. */
  fit: number;
  /** Non-zero trait weights that applied, strongest first. */
  contributions: Contribution[];
}

/** Maps an unbounded score onto 1–99 with a logistic curve, so small differences stay visible. */
export function fitPercent(score: number): number {
  const p = 100 / (1 + Math.exp(-score / 3));
  return Math.min(99, Math.max(1, Math.round(p)));
}

export function scoreItem<T extends Scorable>(item: T, selected: ReadonlySet<string>): Scored<T> {
  const contributions: Contribution[] = [];
  let score = item.baseline;
  for (const trait of selected) {
    const weight = item.weights[trait];
    if (weight) {
      score += weight;
      contributions.push({ trait, weight });
    }
  }
  contributions.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight) || a.trait.localeCompare(b.trait));
  return { item, score, fit: fitPercent(score), contributions };
}

/** Scores every item and sorts best first. Ties keep a stable alphabetical order by id. */
export function rank<T extends Scorable>(items: readonly T[], selected: ReadonlySet<string>): Scored<T>[] {
  return items
    .map((item) => scoreItem(item, selected))
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
}

import { useMemo, useState } from 'react';
import { composeStack, type Scored } from '../../lib/scoring';
import FitMeter from './FitMeter';

export interface ComposerQuestion {
  id: string;
  title: string;
  prompt: string;
  traits: { id: string; label: string; hint?: string }[];
}
export interface ComposerLayer {
  id: string;
  name: string;
  order: number;
  description: string;
  baseline: number;
  weights: Record<string, number>;
}
export interface ComposerTool {
  id: string;
  name: string;
  layers: string[];
  baseline: number;
  layerAdjust: Record<string, number>;
  weights: Record<string, number>;
  tradeoffs: string[];
}
export interface ComposerGuidance {
  id: string;
  title: string;
  summary: string;
  baseline: number;
  weights: Record<string, number>;
}
export interface ComposerPreset {
  id: string;
  label: string;
  traits: string[];
}

interface Props {
  questions: ComposerQuestion[];
  layers: ComposerLayer[];
  tools: ComposerTool[];
  patterns: ComposerGuidance[];
  practices: ComposerGuidance[];
  presets: ComposerPreset[];
  /** Site base path, e.g. "/automation". */
  base: string;
  /** Appended to every link, e.g. "/index.html" for hosts that don't resolve directory indexes. */
  hrefSuffix?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function Composer({ questions, layers, tools, patterns, practices, presets, base, hrefSuffix = '' }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(presets[0]?.traits ?? []));
  const [presetId, setPresetId] = useState<string | null>(presets[0]?.id ?? null);
  const [step, setStep] = useState(0);

  const labels = useMemo(
    () => Object.fromEntries(questions.flatMap((q) => q.traits.map((t) => [t.id, t.label]))),
    [questions],
  );
  const result = useMemo(() => composeStack({ layers, tools, patterns, practices }, selected), [layers, tools, patterns, practices, selected]);
  const link = (path: string) => `${base.replace(/\/$/, '')}${path}${hrefSuffix}`;

  const toggle = (id: string) => {
    setPresetId(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const applyPreset = (p: ComposerPreset) => {
    setPresetId(p.id);
    setSelected(new Set(p.traits));
  };
  const clear = () => {
    setPresetId(null);
    setSelected(new Set());
    setStep(0);
  };

  const q = questions[step];
  const isLast = step === questions.length - 1;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Questions */}
      <section aria-label="Describe your application" className="rounded-card border border-line bg-surface p-6 shadow-card md:p-8 lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono mr-1 text-fg-subtle">Start from</span>
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={presetId === p.id}
              onClick={() => applyPreset(p)}
              className={[
                'h-8 rounded-full border px-3 text-xs transition',
                presetId === p.id ? 'border-accent-ink/60 bg-accent/12 text-fg' : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>

        <ol className="mt-7 grid grid-cols-5 gap-1.5" aria-label="Steps">
          {questions.map((qq, i) => {
            const count = qq.traits.filter((t) => selected.has(t.id)).length;
            return (
              <li key={qq.id}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-current={i === step ? 'step' : undefined}
                  className="group w-full text-left"
                >
                  <span className={`block h-1 rounded-full transition-colors ${i === step ? 'bg-accent-ink' : count > 0 ? 'bg-fg-subtle' : 'bg-line-strong'}`} />
                  <span className={`mt-2 hidden font-mono text-[0.625rem] tracking-wider uppercase sm:block ${i === step ? 'text-fg' : 'text-fg-subtle group-hover:text-fg-muted'}`}>
                    {qq.title}
                  </span>
                  <span className="sr-only">
                    Step {i + 1}: {qq.title}, {count} selected
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-8">
          <p className="label-mono text-fg-subtle">
            Step {step + 1} of {questions.length} · {q.title}
          </p>
          <h2 className="mt-3 text-h3 font-medium text-fg">{q.prompt}</h2>
          <p className="mt-1 text-sm text-fg-subtle">Pick every option that applies. The stack updates as you go.</p>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={q.prompt}>
            {q.traits.map((t) => {
              const on = selected.has(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(t.id)}
                  className={[
                    'inline-flex min-h-10 items-center gap-2 rounded-2xl border px-4 py-2 text-left text-sm transition duration-300 ease-out',
                    on
                      ? 'border-accent-ink/60 bg-accent/12 text-fg shadow-[0_0_24px_-10px_var(--accent)]'
                      : 'border-line bg-bg-elev text-fg-muted hover:border-line-strong hover:text-fg',
                  ].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className={['grid size-4 shrink-0 place-items-center rounded-full border transition', on ? 'border-accent-ink bg-accent-ink text-bg' : 'border-line-strong'].join(' ')}
                  >
                    {on && (
                      <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                        <path d="m2.5 6.2 2.2 2.2 4.8-4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span>
                    {t.label}
                    {t.hint && <span className="block text-xs text-fg-subtle">{t.hint}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
          <button type="button" onClick={clear} className="text-sm text-fg-subtle transition hover:text-fg">
            Clear all
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="h-9 rounded-full px-4 text-sm text-fg-muted transition hover:bg-surface-2 hover:text-fg disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => (isLast ? document.getElementById('composer-result')?.scrollIntoView({ behavior: 'smooth' }) : setStep((s) => s + 1))}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-on-accent transition hover:-translate-y-px"
            >
              {isLast ? 'See your stack' : 'Continue'}
              <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Result */}
      <section id="composer-result" aria-label="Recommended stack" aria-live="polite" className="scroll-mt-24 rounded-card border border-line bg-bg-elev p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-h3 font-medium text-fg">Your stack</h2>
          <p className="label-mono text-fg-subtle">
            {result.layers.length} layers · {selected.size} traits
          </p>
        </div>

        <ul className="mt-6 divide-y divide-line border-y border-line">
          {result.layers.map(({ layer, pick, runnersUp }) => (
            <li key={layer.item.id} className="py-5">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-center sm:gap-6">
                <div className="min-w-0">
                  <p className="label-mono text-fg-subtle">{layer.item.name}</p>
                  {pick ? (
                    <a href={link(`/tools/${pick.item.id}`)} className="mt-2 inline-block font-medium text-fg underline-offset-4 hover:underline">
                      {pick.item.name}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-fg-subtle">No tool yet</p>
                  )}
                </div>
                {pick && <FitMeter label={`${pick.item.name} fit`} value={pick.fit} />}
              </div>
              {pick && (
                <details className="group mt-3">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs text-fg-subtle transition hover:text-fg [&::-webkit-details-marker]:hidden">
                    <svg className="size-3 transition-transform group-open:rotate-90" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="m4.5 2.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Why {pick.item.name}
                  </summary>
                  <Explanation pick={pick} runnersUp={runnersUp} labels={labels} link={link} />
                </details>
              )}
            </li>
          ))}
        </ul>

        {result.skipped.length > 0 && (
          <p className="mt-5 text-sm leading-relaxed text-fg-subtle">
            <span className="label-mono mr-2">Left out</span>
            {result.skipped.map((s) => s.item.name).join(' · ')}
          </p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <GuidanceList title="Patterns" tone="text-violet-ink" items={result.patterns} href={(id) => link(`/patterns/${id}`)} />
          <GuidanceList title="Practices" tone="text-cyan-ink" items={result.practices} href={(id) => link(`/practices/${id}`)} />
        </div>
      </section>
    </div>
  );
}

function Explanation({
  pick,
  runnersUp,
  labels,
  link,
}: {
  pick: Scored<ComposerTool>;
  runnersUp: Scored<ComposerTool>[];
  labels: Record<string, string>;
  link: (p: string) => string;
}) {
  return (
    <div className="mt-3 space-y-4 rounded-xl border border-line bg-surface p-4 text-sm">
      <div>
        <p className="label-mono text-fg-subtle">Score</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          <li className="inline-flex h-6 items-center rounded-full border border-line px-2.5 font-mono text-[0.6875rem] text-fg-muted">baseline {pick.item.baseline}</li>
          {pick.contributions.map((c) => (
            <li
              key={c.trait}
              className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs ${c.weight > 0 ? 'border-accent/25 bg-accent/10' : 'border-red/25 bg-red/10'}`}
            >
              {labels[c.trait] ?? c.trait}
              <span className={`font-mono ${c.weight > 0 ? 'text-accent-ink' : 'text-red-ink'}`}>
                {c.weight > 0 ? '+' : ''}
                {c.weight}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {runnersUp.length > 0 && (
        <div>
          <p className="label-mono text-fg-subtle">Runners-up</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {runnersUp.map((r) => (
              <li key={r.item.id}>
                <a
                  href={link(`/tools/${r.item.id}`)}
                  className="inline-flex h-6 items-center gap-1.5 rounded-full border border-line px-2.5 text-xs text-fg-muted transition hover:border-line-strong hover:text-fg"
                >
                  {r.item.name}
                  <span className="font-mono text-fg-subtle">{r.fit}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="label-mono text-amber-ink">Trade-off</p>
        <p className="mt-2 leading-relaxed text-fg-muted">{pick.item.tradeoffs[0]}</p>
      </div>
    </div>
  );
}

function GuidanceList({
  title,
  tone,
  items,
  href,
}: {
  title: string;
  tone: string;
  items: Scored<ComposerGuidance>[];
  href: (id: string) => string;
}) {
  return (
    <div>
      <p className={`label-mono ${tone}`}>{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-fg-subtle">Pick a few traits to see recommendations.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((p) => (
            <li key={p.item.id}>
              <a href={href(p.item.id)} className="group flex items-center justify-between gap-3 text-sm text-fg-muted transition hover:text-fg">
                <span>{p.item.title}</span>
                <span className="font-mono text-xs text-fg-subtle group-hover:text-fg-muted">{p.fit}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

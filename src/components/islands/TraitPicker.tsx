import { useId, useState } from 'react';

/**
 * Multi-select chip group. This is the input primitive the Stack Composer wizard builds on:
 * each chip is a trait of the application under test.
 */
export interface Trait {
  id: string;
  label: string;
  hint?: string;
}

interface Props {
  legend: string;
  traits: Trait[];
  initial?: string[];
}

export default function TraitPicker({ legend, traits, initial = [] }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial));
  const legendId = useId();

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div role="group" aria-labelledby={legendId}>
      <div className="flex items-baseline justify-between gap-4">
        <p id={legendId} className="text-sm font-medium text-fg">
          {legend}
        </p>
        <p className="label-mono text-fg-subtle" aria-live="polite">
          {selected.size} selected
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {traits.map((t) => {
          const on = selected.has(t.id);
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              title={t.hint}
              onClick={() => toggle(t.id)}
              className={[
                'group inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition duration-300 ease-out',
                on
                  ? 'border-accent-ink/60 bg-accent/12 text-fg shadow-[0_0_24px_-8px_var(--accent)]'
                  : 'border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className={[
                  'grid size-4 place-items-center rounded-full border transition',
                  on ? 'border-accent-ink bg-accent-ink text-bg' : 'border-line-strong',
                ].join(' ')}
              >
                {on && (
                  <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                    <path d="m2.5 6.2 2.2 2.2 4.8-4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

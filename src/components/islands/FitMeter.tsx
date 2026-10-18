/** React twin of ui/Meter.astro in compact form, for live scores in islands. */
const tones = {
  lime: 'bg-accent-ink',
  violet: 'bg-violet-ink',
  cyan: 'bg-cyan-ink',
  amber: 'bg-amber-ink',
} as const;

interface Props {
  label: string;
  value: number;
  tone?: keyof typeof tones;
  segments?: number;
}

export default function FitMeter({ label, value, tone = 'lime', segments = 16 }: Props) {
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * segments);
  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex flex-1 gap-[3px]" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-[2px] transition-colors duration-500 ${i < filled ? tones[tone] : 'bg-line-strong/60'}`}
            style={i < filled ? { opacity: 0.45 + (0.55 * (i + 1)) / filled } : undefined}
          />
        ))}
      </div>
      <span className="w-7 text-right font-mono text-sm text-fg tabular-nums">{value}</span>
    </div>
  );
}

import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "good" | "critical" | "warning" | "neutral" | "brand";

const toneClasses: Record<Tone, string> = {
  good: "bg-good-dim text-good",
  critical: "bg-critical-dim text-critical",
  warning: "bg-warning-dim text-warning",
  neutral: "bg-surface-2 text-ink-secondary",
  brand: "bg-brand-dim/20 text-brand",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

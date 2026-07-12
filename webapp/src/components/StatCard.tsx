import type { ReactNode } from "react";
import clsx from "clsx";
import { IconArrowDown, IconArrowUp } from "./icons";

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
}

export function StatCard({ label, value, sub, trend = "neutral", icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-secondary">{label}</span>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-brand">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="tabular text-2xl font-semibold text-ink">{value}</span>
      </div>
      {sub && (
        <div
          className={clsx(
            "mt-1 flex items-center gap-1 text-sm",
            trend === "up" && "text-good",
            trend === "down" && "text-critical",
            trend === "neutral" && "text-ink-muted",
          )}
        >
          {trend === "up" && <IconArrowUp width={14} height={14} />}
          {trend === "down" && <IconArrowDown width={14} height={14} />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}

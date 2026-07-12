import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./tooltip";
import type { DailyEntry } from "../../lib/types";
import { formatCurrency } from "../../lib/format";

interface Props {
  daily: DailyEntry[];
  stakeCurrency: string;
}

export function EquityChart({ daily, stakeCurrency }: Props) {
  const ordered = [...daily].reverse();
  let cumulative = 0;
  const data = ordered.map((d) => {
    cumulative += d.abs_profit;
    return {
      date: new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
      equity: Number(cumulative.toFixed(2)),
    };
  });

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 6" />
        <XAxis
          dataKey="date"
          tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }}
          axisLine={{ stroke: "var(--color-border)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={64}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip
          content={<ChartTooltip formatter={(v) => formatCurrency(v, stakeCurrency)} />}
          cursor={{ stroke: "var(--color-border)" }}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke="var(--color-brand)"
          strokeWidth={2}
          fill="url(#equityFill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EmptyState() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center gap-1 text-center text-sm text-ink-muted">
      <p>Noch keine Daten.</p>
      <p className="text-xs">Sobald der Bot Trades abschließt, erscheint hier deine Equity-Kurve.</p>
    </div>
  );
}

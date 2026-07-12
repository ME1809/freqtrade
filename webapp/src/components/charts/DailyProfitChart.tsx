import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./tooltip";
import type { DailyEntry } from "../../lib/types";
import { formatCurrency } from "../../lib/format";
import { EmptyState } from "./EquityChart";

interface Props {
  daily: DailyEntry[];
  stakeCurrency: string;
}

export function DailyProfitChart({ daily, stakeCurrency }: Props) {
  const data = [...daily]
    .reverse()
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
      profit: Number(d.abs_profit.toFixed(2)),
    }));

  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
        />
        <Tooltip
          content={<ChartTooltip formatter={(v) => formatCurrency(v, stakeCurrency)} />}
          cursor={{ fill: "var(--color-surface-2)" }}
        />
        <Bar dataKey="profit" radius={[4, 4, 4, 4]} maxBarSize={28}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.profit >= 0 ? "var(--color-good)" : "var(--color-critical)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

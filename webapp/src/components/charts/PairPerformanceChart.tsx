import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./tooltip";
import type { PerformanceEntry } from "../../lib/types";
import { formatCurrency } from "../../lib/format";
import { EmptyState } from "./EquityChart";

interface Props {
  performance: PerformanceEntry[];
  stakeCurrency: string;
}

export function PairPerformanceChart({ performance, stakeCurrency }: Props) {
  const data = [...performance]
    .sort((a, b) => b.profit_abs - a.profit_abs)
    .slice(0, 8)
    .map((p) => ({ pair: p.pair, profit: Number(p.profit_abs.toFixed(2)) }));

  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 34)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <CartesianGrid stroke="var(--color-border)" horizontal={false} strokeDasharray="3 6" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="pair"
          tick={{ fill: "var(--color-ink-secondary)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip
          content={<ChartTooltip formatter={(v) => formatCurrency(v, stakeCurrency)} />}
          cursor={{ fill: "var(--color-surface-2)" }}
        />
        <Bar dataKey="profit" radius={[4, 4, 4, 4]} maxBarSize={18}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.profit >= 0 ? "var(--color-good)" : "var(--color-critical)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

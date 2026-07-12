import { useAuth } from "../../lib/auth";
import { usePoll } from "../../lib/usePoll";
import { Card } from "../../components/Card";
import { StatCard } from "../../components/StatCard";
import { PairPerformanceChart } from "../../components/charts/PairPerformanceChart";
import { formatCurrency, formatPercent } from "../../lib/format";

export function Performance() {
  const { client } = useAuth();
  const { data: performance } = usePoll(() => client!.performance(), 20000, [client]);
  const { data: profit } = usePoll(() => client!.profit(), 20000, [client]);
  const { data: balance } = usePoll(() => client!.balance(), 30000, [client]);

  const stakeCurrency = balance?.stake ?? "USDT";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Profit-Faktor"
          value={profit ? profit.profit_factor.toFixed(2) : "…"}
          sub="Gewinne / Verluste"
        />
        <StatCard
          label="Max. Drawdown"
          value={profit ? formatPercent(profit.max_drawdown) : "…"}
          sub={profit ? formatCurrency(profit.max_drawdown_abs, stakeCurrency) : undefined}
          trend="down"
        />
        <StatCard
          label="Bester Pair"
          value={profit?.best_pair ?? "–"}
          sub={profit ? formatPercent(profit.best_pair_profit_ratio) : undefined}
          trend="up"
        />
        <StatCard
          label="Ø Haltedauer"
          value={profit?.avg_duration ?? "–"}
        />
      </div>

      <Card title="Performance nach Pair (Top 8)">
        <PairPerformanceChart performance={performance ?? []} stakeCurrency={stakeCurrency} />
      </Card>

      <Card title="Alle Pairs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="pb-3 pr-4 font-medium">Pair</th>
                <th className="pb-3 pr-4 font-medium">Trades</th>
                <th className="pb-3 pr-4 font-medium">Profit %</th>
                <th className="pb-3 font-medium">Profit</th>
              </tr>
            </thead>
            <tbody>
              {(performance ?? [])
                .sort((a, b) => b.profit_abs - a.profit_abs)
                .map((p) => (
                  <tr key={p.pair} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4 font-medium text-ink">{p.pair}</td>
                    <td className="py-3 pr-4 text-ink-secondary">{p.count}</td>
                    <td className={`py-3 pr-4 ${p.profit_ratio >= 0 ? "text-good" : "text-critical"}`}>
                      {formatPercent(p.profit_ratio)}
                    </td>
                    <td className={`py-3 tabular ${p.profit_abs >= 0 ? "text-good" : "text-critical"}`}>
                      {formatCurrency(p.profit_abs, stakeCurrency)}
                    </td>
                  </tr>
                ))}
              {(performance ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-ink-muted">
                    Noch keine Daten.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

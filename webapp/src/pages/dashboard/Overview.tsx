import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { usePoll } from "../../lib/usePoll";
import { Card } from "../../components/Card";
import { StatCard } from "../../components/StatCard";
import { Badge } from "../../components/Badge";
import { EquityChart } from "../../components/charts/EquityChart";
import { DailyProfitChart } from "../../components/charts/DailyProfitChart";
import { formatCurrency, formatDurationSince, formatPercent } from "../../lib/format";
import { IconActivity, IconBarChart, IconWallet } from "../../components/icons";

export function Overview() {
  const { client } = useAuth();

  const { data: balance } = usePoll(() => client!.balance(), 20000, [client]);
  const { data: openTrades } = usePoll(() => client!.status(), 8000, [client]);
  const { data: profit } = usePoll(() => client!.profit(), 20000, [client]);
  const { data: daily } = usePoll(() => client!.daily(30), 30000, [client]);

  const stakeCurrency = balance?.stake ?? daily?.stake_currency ?? "USDT";
  const openProfit = (openTrades ?? []).reduce((sum, t) => sum + (t.profit_abs ?? 0), 0);
  const winRate =
    profit && profit.closed_trade_count > 0
      ? profit.winning_trades / profit.closed_trade_count
      : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Gesamt-Guthaben"
          value={balance ? formatCurrency(balance.total, stakeCurrency) : "…"}
          icon={<IconWallet width={16} height={16} />}
        />
        <StatCard
          label="Offener PnL"
          value={formatCurrency(openProfit, stakeCurrency)}
          trend={openProfit > 0 ? "up" : openProfit < 0 ? "down" : "neutral"}
          sub={`${openTrades?.length ?? 0} offene Trades`}
          icon={<IconActivity width={16} height={16} />}
        />
        <StatCard
          label="Realisierter Gewinn (gesamt)"
          value={profit ? formatCurrency(profit.profit_all_coin, stakeCurrency) : "…"}
          trend={profit ? (profit.profit_all_coin >= 0 ? "up" : "down") : "neutral"}
          sub={profit ? formatPercent(profit.profit_all_ratio) : undefined}
          icon={<IconBarChart width={16} height={16} />}
        />
        <StatCard
          label="Gewinnrate"
          value={winRate !== undefined ? formatPercent(winRate, true) : "–"}
          sub={profit ? `${profit.winning_trades}W / ${profit.losing_trades}L` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Equity-Kurve (30 Tage)" className="lg:col-span-2">
          <EquityChart daily={daily?.data ?? []} stakeCurrency={stakeCurrency} />
        </Card>
        <Card
          title="Offene Trades"
          action={
            <Link to="/dashboard/trades" className="text-xs font-medium text-brand hover:underline">
              Alle ansehen
            </Link>
          }
        >
          <div className="space-y-3">
            {(openTrades ?? []).length === 0 && (
              <p className="py-8 text-center text-sm text-ink-muted">Keine offenen Positionen.</p>
            )}
            {(openTrades ?? []).slice(0, 5).map((t) => (
              <div key={t.trade_id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-ink">{t.pair}</p>
                  <p className="text-xs text-ink-muted">seit {formatDurationSince(t.open_date)}</p>
                </div>
                <Badge tone={(t.profit_ratio ?? 0) >= 0 ? "good" : "critical"}>
                  {formatPercent(t.profit_ratio ?? 0)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Tages-Performance">
        <DailyProfitChart daily={daily?.data ?? []} stakeCurrency={stakeCurrency} />
      </Card>
    </div>
  );
}

import { useAuth } from "../../lib/auth";
import { usePoll } from "../../lib/usePoll";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { formatCurrency, formatDate, formatPercent } from "../../lib/format";

export function History() {
  const { client } = useAuth();
  const { data } = usePoll(() => client!.trades(100, 0), 20000, [client]);

  const closed = (data?.trades ?? []).filter((t) => !t.is_open);

  return (
    <Card title={`Trade-Verlauf (${data?.total_trades ?? closed.length})`}>
      {closed.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-muted">
          Noch keine abgeschlossenen Trades vorhanden.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="pb-3 pr-4 font-medium">Pair</th>
                <th className="pb-3 pr-4 font-medium">Geschlossen</th>
                <th className="pb-3 pr-4 font-medium">Einstieg</th>
                <th className="pb-3 pr-4 font-medium">Ausstieg</th>
                <th className="pb-3 pr-4 font-medium">PnL</th>
                <th className="pb-3 pr-4 font-medium">Grund</th>
                <th className="pb-3 font-medium">Strategie</th>
              </tr>
            </thead>
            <tbody>
              {closed
                .sort((a, b) => (b.close_timestamp ?? 0) - (a.close_timestamp ?? 0))
                .map((t) => (
                  <tr key={t.trade_id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4 font-medium text-ink">{t.pair}</td>
                    <td className="py-3 pr-4 text-ink-secondary">{formatDate(t.close_date)}</td>
                    <td className="tabular py-3 pr-4 text-ink-secondary">{t.open_rate}</td>
                    <td className="tabular py-3 pr-4 text-ink-secondary">{t.close_rate ?? "–"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-col">
                        <Badge tone={(t.close_profit ?? t.profit_ratio ?? 0) >= 0 ? "good" : "critical"}>
                          {formatPercent(t.close_profit ?? t.profit_ratio ?? 0)}
                        </Badge>
                        <span className="mt-1 text-xs text-ink-muted">
                          {formatCurrency(t.close_profit_abs ?? t.profit_abs ?? 0, t.quote_currency)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ink-secondary">{t.exit_reason ?? "–"}</td>
                    <td className="py-3 text-ink-secondary">{t.strategy}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

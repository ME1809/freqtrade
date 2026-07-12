import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { usePoll } from "../../lib/usePoll";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { formatCurrency, formatDurationSince, formatPercent } from "../../lib/format";

export function OpenTrades() {
  const { client } = useAuth();
  const { data: trades, refetch } = usePoll(() => client!.status(), 6000, [client]);
  const [pending, setPending] = useState<number | null>(null);

  async function handleForceExit(tradeId: number) {
    if (!client) return;
    if (!confirm(`Trade #${tradeId} wirklich sofort schließen?`)) return;
    setPending(tradeId);
    try {
      await client.forceExit(tradeId);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Fehler beim Schließen des Trades");
    } finally {
      setPending(null);
    }
  }

  const list = trades ?? [];

  return (
    <Card title={`Offene Trades (${list.length})`}>
      {list.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-muted">
          Aktuell keine offenen Positionen. Sobald der Bot einsteigt, erscheint der Trade hier.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="pb-3 pr-4 font-medium">Pair</th>
                <th className="pb-3 pr-4 font-medium">Seite</th>
                <th className="pb-3 pr-4 font-medium">Einstieg</th>
                <th className="pb-3 pr-4 font-medium">Aktuell</th>
                <th className="pb-3 pr-4 font-medium">Einsatz</th>
                <th className="pb-3 pr-4 font-medium">PnL</th>
                <th className="pb-3 pr-4 font-medium">Dauer</th>
                <th className="pb-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.trade_id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-ink">{t.pair}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={t.is_short ? "critical" : "brand"}>
                      {t.is_short ? "Short" : "Long"}
                    </Badge>
                  </td>
                  <td className="tabular py-3 pr-4 text-ink-secondary">{t.open_rate}</td>
                  <td className="tabular py-3 pr-4 text-ink-secondary">{t.current_rate ?? "–"}</td>
                  <td className="tabular py-3 pr-4 text-ink-secondary">
                    {formatCurrency(t.stake_amount, t.quote_currency)}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge tone={(t.profit_ratio ?? 0) >= 0 ? "good" : "critical"}>
                      {formatPercent(t.profit_ratio ?? 0)}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-ink-secondary">{formatDurationSince(t.open_date)}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleForceExit(t.trade_id)}
                      disabled={pending === t.trade_id}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:border-critical/40 hover:text-critical disabled:opacity-50"
                    >
                      {pending === t.trade_id ? "Schließt…" : "Schließen"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

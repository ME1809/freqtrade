import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { usePoll } from "../../lib/usePoll";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { IconPower } from "../../components/icons";

type Action = "start" | "pause" | "stop" | "stopbuy" | "reload_config";

export function BotControl() {
  const { client } = useAuth();
  const { data: config, refetch: refetchConfig } = usePoll(() => client!.showConfig(), 10000, [client]);
  const { data: count } = usePoll(() => client!.count(), 10000, [client]);
  const { data: whitelist } = usePoll(() => client!.whitelist(), 30000, [client]);
  const { data: sysinfo } = usePoll(() => client!.sysinfo(), 10000, [client]);
  const [pending, setPending] = useState<Action | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function run(action: Action) {
    if (!client) return;
    setPending(action);
    setMessage(null);
    try {
      const res =
        action === "start"
          ? await client.start()
          : action === "pause"
            ? await client.pause()
            : action === "stop"
              ? await client.stop()
              : action === "stopbuy"
                ? await client.stopBuy()
                : await client.reloadConfig();
      setMessage(res.status);
      refetchConfig();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Aktion fehlgeschlagen");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-brand">
                <IconPower width={20} height={20} />
              </span>
              <div>
                <p className="font-semibold text-ink">{config?.strategy ?? "Strategie"}</p>
                <p className="text-xs text-ink-muted">
                  {config?.exchange} · {config?.timeframe} · {config?.trading_mode}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {config?.dry_run && <Badge tone="warning">Dry-Run</Badge>}
            <Badge tone={config?.state === "running" ? "good" : config?.state === "paused" ? "warning" : "critical"}>
              {config?.state ?? "unbekannt"}
            </Badge>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Trades" value={count ? `${count.current} / ${count.max}` : "…"} />
          <Stat label="Stake" value={config ? `${config.stake_amount}` : "…"} />
          <Stat label="Einstieg erzwingen" value={config?.force_entry_enable ? "an" : "aus"} />
          <Stat
            label="System"
            value={sysinfo ? `CPU ${Math.round(sysinfo.cpu_pct?.[0] ?? 0)}% · RAM ${Math.round(sysinfo.ram_pct)}%` : "…"}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <ActionButton label="Starten" active={pending === "start"} onClick={() => run("start")} tone="good" />
          <ActionButton label="Pausieren" active={pending === "pause"} onClick={() => run("pause")} tone="warning" />
          <ActionButton
            label="Neue Einstiege stoppen"
            active={pending === "stopbuy"}
            onClick={() => run("stopbuy")}
            tone="neutral"
          />
          <ActionButton label="Stoppen" active={pending === "stop"} onClick={() => run("stop")} tone="critical" />
          <ActionButton
            label="Config neu laden"
            active={pending === "reload_config"}
            onClick={() => run("reload_config")}
            tone="neutral"
          />
        </div>
        {message && <p className="mt-3 text-sm text-ink-secondary">{message}</p>}
      </Card>

      <Card title={`Whitelist (${whitelist?.length ?? 0} Pairs)`}>
        <div className="flex flex-wrap gap-2">
          {(whitelist?.whitelist ?? []).map((pair) => (
            <span key={pair} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-ink-secondary">
              {pair}
            </span>
          ))}
          {(whitelist?.whitelist ?? []).length === 0 && (
            <p className="text-sm text-ink-muted">Keine Whitelist konfiguriert.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="tabular mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  active,
  tone,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  tone: "good" | "warning" | "critical" | "neutral";
}) {
  const toneClasses: Record<typeof tone, string> = {
    good: "hover:border-good/50 hover:text-good",
    warning: "hover:border-warning/50 hover:text-warning",
    critical: "hover:border-critical/50 hover:text-critical",
    neutral: "hover:border-brand/50 hover:text-brand",
  };
  return (
    <button
      onClick={onClick}
      disabled={active}
      className={`rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink-secondary transition-colors disabled:opacity-50 ${toneClasses[tone]}`}
    >
      {active ? "…" : label}
    </button>
  );
}

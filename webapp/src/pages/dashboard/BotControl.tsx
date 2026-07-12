import { type FormEvent, useState } from "react";
import { useAuth } from "../../lib/auth";
import { usePoll } from "../../lib/usePoll";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { formatDate } from "../../lib/format";
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

      <StrategyCard currentStrategy={config?.strategy} />
      <BlacklistCard />
      <LocksCard />

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

      <LogsCard />
    </div>
  );
}

function StrategyCard({ currentStrategy }: { currentStrategy?: string }) {
  const { client } = useAuth();
  const { data, error } = usePoll(() => client!.strategies(), null, [client]);

  return (
    <Card title="Verfügbare Strategien">
      <div className="flex flex-wrap gap-2">
        {(data?.strategies ?? []).map((name) => (
          <span
            key={name}
            className={
              name === currentStrategy
                ? "rounded-full bg-brand-dim/20 px-3 py-1 text-xs font-medium text-brand"
                : "rounded-full bg-surface-2 px-3 py-1 text-xs text-ink-secondary"
            }
          >
            {name}
            {name === currentStrategy && " · aktiv"}
          </span>
        ))}
        {error && <p className="text-sm text-ink-muted">Konnte Strategieliste nicht laden.</p>}
      </div>
      <p className="mt-4 text-xs text-ink-muted">
        Ein Strategiewechsel erfordert einen Neustart des Bot-Containers (freqtrade lädt die
        Strategie-Klasse nur beim Start) — das kann diese Weboberfläche aus Sicherheitsgründen
        nicht selbst auslösen. Auf dem NUC: <code className="text-ink-secondary">--strategy</code>{" "}
        in der <code className="text-ink-secondary">docker-compose.yml</code> anpassen, dann{" "}
        <code className="text-ink-secondary">docker compose up -d --force-recreate freqtrade</code>.
      </p>
    </Card>
  );
}

function BlacklistCard() {
  const { client } = useAuth();
  const { data, refetch } = usePoll(() => client!.blacklist(), 20000, [client]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const pair = input.trim().toUpperCase();
    if (!client || !pair) return;
    setPending(pair);
    try {
      await client.addToBlacklist([pair]);
      setInput("");
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Konnte Pair nicht sperren");
    } finally {
      setPending(null);
    }
  }

  async function handleRemove(pair: string) {
    if (!client) return;
    setPending(pair);
    try {
      await client.removeFromBlacklist([pair]);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Konnte Pair nicht entsperren");
    } finally {
      setPending(null);
    }
  }

  return (
    <Card title={`Blacklist (${data?.length ?? 0} Pairs)`}>
      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="z.B. DOGE/USDT"
          className="input"
        />
        <button
          type="submit"
          disabled={!input.trim() || pending === input.trim().toUpperCase()}
          className="shrink-0 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-ink disabled:opacity-50"
        >
          Sperren
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {(data?.blacklist ?? []).map((pair) => (
          <span
            key={pair}
            className="flex items-center gap-2 rounded-full bg-critical-dim px-3 py-1 text-xs text-critical"
          >
            {pair}
            <button
              onClick={() => handleRemove(pair)}
              disabled={pending === pair}
              className="text-critical/70 hover:text-critical disabled:opacity-50"
              aria-label={`${pair} entsperren`}
            >
              ×
            </button>
          </span>
        ))}
        {(data?.blacklist ?? []).length === 0 && (
          <p className="text-sm text-ink-muted">Keine Pairs gesperrt.</p>
        )}
      </div>
    </Card>
  );
}

function LocksCard() {
  const { client } = useAuth();
  const { data, refetch } = usePoll(() => client!.locks(), 20000, [client]);
  const [pending, setPending] = useState<number | null>(null);

  async function handleUnlock(id: number) {
    if (!client) return;
    setPending(id);
    try {
      await client.deleteLock(id);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Konnte Lock nicht entfernen");
    } finally {
      setPending(null);
    }
  }

  const locks = data?.locks ?? [];
  if (locks.length === 0) return null;

  return (
    <Card title={`Aktive Locks (${locks.length})`}>
      <div className="space-y-2">
        {locks.map((lock) => (
          <div
            key={lock.id}
            className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2 text-sm"
          >
            <div>
              <span className="font-medium text-ink">{lock.pair}</span>
              <span className="ml-2 text-ink-muted">bis {formatDate(lock.lock_end_time)}</span>
              {lock.reason && <span className="ml-2 text-ink-muted">· {lock.reason}</span>}
            </div>
            <button
              onClick={() => handleUnlock(lock.id)}
              disabled={pending === lock.id}
              className="rounded-lg border border-border px-3 py-1 text-xs text-ink-secondary hover:border-brand/40 hover:text-brand disabled:opacity-50"
            >
              Entsperren
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LogsCard() {
  const { client } = useAuth();
  const { data, refetch, loading } = usePoll(() => client!.logs(150), null, [client]);
  const lines = data?.logs ?? [];

  return (
    <Card
      title="Bot-Logs"
      action={
        <button
          onClick={() => refetch()}
          className="text-xs font-medium text-brand hover:underline"
        >
          {loading ? "Lädt…" : "Aktualisieren"}
        </button>
      }
    >
      <div className="max-h-80 overflow-y-auto rounded-xl bg-surface-2 p-3 font-mono text-xs text-ink-secondary">
        {lines.length === 0 && <p className="text-ink-muted">Keine Logs geladen.</p>}
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all py-0.5">
            <span className="text-ink-muted">{line[0]}</span> {line[3]}: {line[4]}
          </div>
        ))}
      </div>
    </Card>
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

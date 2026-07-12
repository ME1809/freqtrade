import { useAuth } from "../../lib/auth";
import { usePoll } from "../../lib/usePoll";
import { Card } from "../../components/Card";

export function Settings() {
  const { client, serverUrl, username, logout } = useAuth();
  const { data: version } = usePoll(() => client!.version(), null, [client]);

  return (
    <div className="space-y-6">
      <Card title="Verbindung">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-muted">Server-URL</dt>
            <dd className="mt-1 text-sm text-ink">{serverUrl}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Benutzername</dt>
            <dd className="mt-1 text-sm text-ink">{username}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">freqtrade-Version</dt>
            <dd className="mt-1 text-sm text-ink">{version?.version ?? "…"}</dd>
          </div>
        </dl>
        <button
          onClick={logout}
          className="mt-6 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:border-critical/40 hover:text-critical"
        >
          Verbindung trennen
        </button>
      </Card>

      <Card title="Hinweise">
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink-secondary">
          <li>
            Zugangsdaten werden ausschließlich im lokalen Browser-Speicher (localStorage)
            abgelegt, niemals an einen dritten Server gesendet.
          </li>
          <li>
            Für den Zugriff über das Internet wird ein SSH-Tunnel oder VPN zu deinem
            Bot-Server empfohlen – siehe{" "}
            <a
              href="https://www.freqtrade.io/en/stable/rest-api/"
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:underline"
            >
              freqtrade REST-API Docs
            </a>
            .
          </li>
          <li>Alle Daten werden alle 6–30 Sekunden automatisch aktualisiert.</li>
        </ul>
      </Card>
    </div>
  );
}

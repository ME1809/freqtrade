import { type FormEvent, type ReactNode, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { IconBolt } from "../components/icons";

export function Login() {
  const { login, status, client } = useAuth();
  const navigate = useNavigate();
  const [serverUrl, setServerUrl] = useState("http://127.0.0.1:8080");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (client && status === "connected") {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await login({ serverUrl: serverUrl.trim(), username: username.trim(), password });
      navigate("/dashboard");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Verbindung fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-ink">
            <IconBolt width={16} height={16} />
          </span>
          <span className="text-lg font-semibold tracking-tight">HopperTrade</span>
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-7">
          <h1 className="text-xl font-semibold">Mit deinem Bot verbinden</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Zugangsdaten aus dem <code className="text-ink">api_server</code>-Block deiner
            freqtrade config.json.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Server-URL" hint="z.B. http://127.0.0.1:8080 oder https://mein-bot.example.com">
              <input
                required
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://127.0.0.1:8080"
                className="input"
              />
            </Field>
            <Field label="Benutzername">
              <input
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Passwort">
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </Field>

            {formError && (
              <p className="rounded-lg bg-critical-dim px-3 py-2 text-sm text-critical">{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-brand-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {submitting ? "Verbinde…" : "Verbinden"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Deine Zugangsdaten werden nur lokal im Browser gespeichert und direkt an
          deinen eigenen Bot-Server gesendet.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-secondary">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

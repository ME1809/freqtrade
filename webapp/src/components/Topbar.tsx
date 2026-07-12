import clsx from "clsx";
import { useAuth } from "../lib/auth";
import { IconLogout, IconMenu } from "./icons";

interface TopbarProps {
  title: string;
  state?: string;
  onMenuClick?: () => void;
}

const stateTone: Record<string, string> = {
  running: "bg-good",
  paused: "bg-warning",
  stopped: "bg-critical",
};

export function Topbar({ title, state, onMenuClick }: TopbarProps) {
  const { username, serverUrl, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-page/80 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-ink-secondary hover:bg-surface-2 md:hidden"
          onClick={onMenuClick}
          aria-label="Menü öffnen"
        >
          <IconMenu />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-ink">{title}</h1>
          {serverUrl && <p className="text-xs text-ink-muted">{serverUrl}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {state && (
          <span className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium capitalize text-ink-secondary">
            <span className={clsx("h-2 w-2 rounded-full", stateTone[state] ?? "bg-ink-muted")} />
            {state}
          </span>
        )}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-ink">
            {username?.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-sm text-ink-secondary">{username}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-ink-secondary transition-colors hover:border-critical/40 hover:text-critical"
        >
          <IconLogout width={16} height={16} />
          <span className="hidden sm:inline">Abmelden</span>
        </button>
      </div>
    </header>
  );
}

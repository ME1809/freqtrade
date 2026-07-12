import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  IconActivity,
  IconBolt,
  IconGrid,
  IconHistory,
  IconBarChart,
  IconPower,
  IconSettings,
} from "./icons";

const items = [
  { to: "/dashboard", label: "Übersicht", icon: IconGrid, end: true },
  { to: "/dashboard/trades", label: "Offene Trades", icon: IconActivity },
  { to: "/dashboard/history", label: "Verlauf", icon: IconHistory },
  { to: "/dashboard/performance", label: "Performance", icon: IconBarChart },
  { to: "/dashboard/control", label: "Bot-Steuerung", icon: IconPower },
  { to: "/dashboard/settings", label: "Einstellungen", icon: IconSettings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface/60 px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-ink">
          <IconBolt width={16} height={16} />
        </span>
        <span className="text-lg font-semibold tracking-tight">HopperTrade</span>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface-2 text-ink"
                  : "text-ink-secondary hover:bg-surface-2/60 hover:text-ink",
              )
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-surface-2/50 p-3 text-xs text-ink-muted">
        Eigenes Dashboard für deine selbst gehostete freqtrade-Instanz. Keine
        Daten verlassen deinen Server.
      </div>
    </nav>
  );
}

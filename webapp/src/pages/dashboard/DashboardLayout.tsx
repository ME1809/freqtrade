import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { usePoll } from "../../lib/usePoll";
import { Sidebar } from "../../components/Sidebar";
import { Topbar } from "../../components/Topbar";
import { IconClose } from "../../components/icons";
import { ErrorBoundary } from "../../components/ErrorBoundary";

const titles: Record<string, string> = {
  "/dashboard": "Übersicht",
  "/dashboard/trades": "Offene Trades",
  "/dashboard/history": "Verlauf",
  "/dashboard/performance": "Performance",
  "/dashboard/control": "Bot-Steuerung",
  "/dashboard/settings": "Einstellungen",
};

export function DashboardLayout() {
  const { client, status } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: config } = usePoll(
    () => client!.showConfig(),
    15000,
    [client],
  );

  if (!client || status !== "connected") {
    return <Navigate to="/login" replace />;
  }

  const title = titles[location.pathname] ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-page">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            className="flex-1 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Menü schließen"
          >
            <IconClose className="ml-4 mt-4 text-ink" />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} state={config?.state} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <ErrorBoundary key={location.pathname}>
            <Outlet context={{ config }} />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

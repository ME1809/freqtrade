import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";

const DashboardLayout = lazy(() =>
  import("./pages/dashboard/DashboardLayout").then((m) => ({ default: m.DashboardLayout })),
);
const Overview = lazy(() => import("./pages/dashboard/Overview").then((m) => ({ default: m.Overview })));
const OpenTrades = lazy(() =>
  import("./pages/dashboard/OpenTrades").then((m) => ({ default: m.OpenTrades })),
);
const History = lazy(() => import("./pages/dashboard/History").then((m) => ({ default: m.History })));
const Performance = lazy(() =>
  import("./pages/dashboard/Performance").then((m) => ({ default: m.Performance })),
);
const BotControl = lazy(() =>
  import("./pages/dashboard/BotControl").then((m) => ({ default: m.BotControl })),
);
const Settings = lazy(() => import("./pages/dashboard/Settings").then((m) => ({ default: m.Settings })));

function DashboardFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-page text-sm text-ink-muted">
      Lade Dashboard…
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<DashboardFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="trades" element={<OpenTrades />} />
              <Route path="history" element={<History />} />
              <Route path="performance" element={<Performance />} />
              <Route path="control" element={<BotControl />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

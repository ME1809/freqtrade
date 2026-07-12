import { Link } from "react-router-dom";
import {
  IconActivity,
  IconBarChart,
  IconBolt,
  IconLayers,
  IconShield,
  IconWallet,
} from "../components/icons";

const features = [
  {
    icon: IconActivity,
    title: "Live-Dashboard",
    body: "Offene Positionen, PnL und Equity-Kurve in Echtzeit – direkt aus der REST-API deines eigenen freqtrade-Bots.",
  },
  {
    icon: IconLayers,
    title: "Strategien aus einer Hand",
    body: "Über 20 fertige, getestete Strategien aus dem freqtrade-strategies Repo – einfach auswählen und laufen lassen.",
  },
  {
    icon: IconBarChart,
    title: "Performance-Analyse",
    body: "Tages-, Wochen- und Pair-Performance auf einen Blick, inklusive Drawdown und Gewinnrate.",
  },
  {
    icon: IconBolt,
    title: "Volle Kontrolle",
    body: "Bot starten, pausieren, stoppen oder Positionen manuell schließen – ohne SSH, direkt im Browser.",
  },
  {
    icon: IconShield,
    title: "100% selbst gehostet",
    body: "Keine Cloud, kein Mittelsmann. Deine API-Keys bleiben auf deinem eigenen Server oder Rechner.",
  },
  {
    icon: IconWallet,
    title: "Alle großen Exchanges",
    body: "Binance, Bybit, Kraken, OKX, Bitget und mehr – alles was freqtrade über ccxt unterstützt.",
  },
];

const steps = [
  {
    n: "01",
    title: "freqtrade installieren",
    body: "Bot per Docker oder Python auf deinem Server aufsetzen und eine Strategie aus freqtrade-strategies wählen.",
  },
  {
    n: "02",
    title: "REST-API aktivieren",
    body: "In der config.json den api_server-Block aktivieren und Benutzername/Passwort vergeben.",
  },
  {
    n: "03",
    title: "Dashboard verbinden",
    body: "Hier anmelden, Server-URL eintragen – fertig. Alle Daten kommen live von deinem eigenen Bot.",
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-ink">
            <IconBolt width={16} height={16} />
          </span>
          <span className="text-lg font-semibold tracking-tight">HopperTrade</span>
        </div>
        <nav className="flex items-center gap-3">
          <a
            href="https://github.com/freqtrade/freqtrade"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-ink-secondary hover:text-ink sm:inline"
          >
            Powered by freqtrade
          </a>
          <Link
            to="/login"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink transition-transform hover:scale-[1.03]"
          >
            Dashboard öffnen
          </Link>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-[-12rem] -z-10 h-[32rem] blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--color-brand) 22%, transparent), transparent)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-ink-secondary">
            Open Source · Self-hosted · Kein Abo
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Dein eigener{" "}
            <span className="bg-gradient-to-r from-brand to-series-1 bg-clip-text text-transparent">
              Krypto-Trading-Bot
            </span>
            , mit Dashboard.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-ink-secondary">
            Alles, was du an Cryptohopper magst — Live-Übersicht, Performance-Charts,
            Strategie-Steuerung — aber auf deiner eigenen freqtrade-Instanz. Keine
            Cloud-Gebühren, keine geteilten API-Keys.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              className="w-full rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-ink shadow-lg shadow-brand/20 transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Mit meinem Bot verbinden
            </Link>
            <a
              href="https://www.freqtrade.io/en/stable/rest-api/"
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-xl border border-border px-6 py-3 text-sm font-semibold text-ink-secondary transition-colors hover:border-brand/40 hover:text-ink sm:w-auto"
            >
              API-Setup ansehen
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Alles, was dein Bot-Dashboard braucht</h2>
          <p className="mt-2 text-ink-secondary">Gebaut auf der offiziellen freqtrade REST-API.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-brand">
                <Icon width={20} height={20} />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-ink-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">In 3 Schritten startklar</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-surface p-6">
                <span className="text-sm font-semibold text-brand">{s.n}</span>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-secondary">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">Bereit für dein eigenes Cockpit?</h2>
        <p className="mt-2 text-ink-secondary">
          Du brauchst nur deinen laufenden freqtrade-Bot mit aktivierter REST-API.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-ink transition-transform hover:scale-[1.02]"
        >
          Jetzt verbinden
        </Link>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-ink-muted">
        <p>
          Kein Anlageberatungsangebot. Trading mit Kryptowährungen ist riskant – nutze
          zuerst den Dry-Run-Modus. Basiert auf dem Open-Source-Projekt{" "}
          <a
            href="https://github.com/freqtrade/freqtrade"
            target="_blank"
            rel="noreferrer"
            className="text-ink-secondary underline underline-offset-2"
          >
            freqtrade
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

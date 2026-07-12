# HopperTrade – Dashboard für deine freqtrade-Instanz

Ein eigenes, Cryptohopper-inspiriertes Web-Dashboard für **deinen selbst gehosteten
[freqtrade](https://www.freqtrade.io)-Bot**. Marketing-Landingpage, Login und ein
Live-Dashboard (offene Trades, Verlauf, Performance-Charts, Bot-Steuerung) – alles
über die offizielle freqtrade REST-API, ohne eigenes Backend und ohne dass Daten
irgendeinen dritten Server verlassen.

> Dies ist **kein** Multi-User-SaaS wie Cryptohopper.com, sondern ein Frontend für
> genau einen Bot, den du selbst betreibst. API-Zugangsdaten bleiben im
> Browser-`localStorage` und werden ausschließlich an die von dir eingegebene
> Server-URL gesendet.

## Voraussetzungen

- Ein laufender freqtrade-Bot (Dry-Run oder Live) mit aktivierter REST-API. Siehe
  die [REST-API-Dokumentation](https://www.freqtrade.io/en/stable/rest-api/).
- Node.js 20+ für die Entwicklung/den Build des Dashboards.

### 1. freqtrade REST-API aktivieren

In deiner `config.json`:

```json
"api_server": {
    "enabled": true,
    "listen_ip_address": "127.0.0.1",
    "listen_port": 8080,
    "verbosity": "error",
    "enable_openapi": false,
    "jwt_secret_key": "somethingRandomSomethingRandom123",
    "CORS_origins": ["http://localhost:5173"],
    "username": "Freqtrader",
    "password": "SuperSecret1!"
}
```

Wichtig: `CORS_origins` muss die Origin enthalten, unter der dieses Dashboard
läuft (im Dev-Modus `http://localhost:5173`, im Produktivbetrieb deine eigene
Domain), sonst blockt der Browser die Anfragen.

### 2. Dashboard starten

```bash
cd webapp
npm install
npm run dev
```

Öffne <http://localhost:5173>, klicke auf „Mit meinem Bot verbinden" und trage
Server-URL, Benutzername und Passwort aus dem `api_server`-Block ein.

### 3. Produktions-Build

```bash
npm run build
npm run preview   # lokale Vorschau des Builds
```

`npm run build` erzeugt ein statisches `dist/`-Verzeichnis, das sich mit jedem
beliebigen Webserver (nginx, Caddy, Vercel, GitHub Pages, …) ausliefern lässt.
Für Fernzugriff über das Internet wird – wie in der freqtrade-Doku empfohlen –
ein SSH-Tunnel oder VPN zum Bot statt einer offenen Firewall-Regel empfohlen.

## Was steckt drin

- **Landingpage** (`src/pages/Landing.tsx`) – Marketing-Seite im Cryptohopper-Stil.
- **Login** (`src/pages/Login.tsx`) – verbindet sich per JWT (`/api/v1/token/login`)
  mit deinem Bot.
- **Dashboard** (`src/pages/dashboard/*`):
  - **Übersicht** – Guthaben, offener PnL, Equity-Kurve, Tages-Performance.
  - **Offene Trades** – Live-Positionen inkl. manuellem Force-Exit.
  - **Verlauf** – abgeschlossene Trades mit Exit-Grund und Strategie.
  - **Performance** – Profit-Faktor, Drawdown, Performance je Pair.
  - **Bot-Steuerung** – Start/Pause/Stop/Reload sowie Whitelist-Ansicht.
  - **Einstellungen** – Verbindungsinfos, Trennen.
- **`src/lib/api.ts`** – schlanker Client für die freqtrade REST-API (JWT-Login,
  Auto-Refresh, alle für das Dashboard relevanten Endpunkte).

## Tech-Stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Recharts.

## Strategien

Fertige, dokumentierte Strategien für deinen Bot findest du im separaten
[`freqtrade-strategies`](https://github.com/ME1809/freqtrade-strategies) Repository.

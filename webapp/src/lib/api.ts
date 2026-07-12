import type {
  BalanceResponse,
  BlacklistResponse,
  CountResponse,
  DailyResponse,
  HealthResponse,
  LocksResponse,
  OrderType,
  PerformanceEntry,
  PingResponse,
  ProfitResponse,
  ShowConfigResponse,
  StatusResponse,
  SysInfoResponse,
  TokenPair,
  Trade,
  TradesResponse,
  VersionResponse,
  WhitelistResponse,
} from "./types";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function normalizeServerUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Thin client for the freqtrade REST API (JWT-authenticated).
 * https://www.freqtrade.io/en/stable/rest-api/
 */
export class FreqtradeClient {
  private baseUrl: string;
  private accessToken: string | null;
  private refreshToken: string | null;
  private onTokensChanged?: (tokens: TokenPair | null) => void;

  constructor(
    serverUrl: string,
    tokens?: { accessToken: string | null; refreshToken: string | null },
    onTokensChanged?: (tokens: TokenPair | null) => void,
  ) {
    this.baseUrl = `${normalizeServerUrl(serverUrl)}/api/v1`;
    this.accessToken = tokens?.accessToken ?? null;
    this.refreshToken = tokens?.refreshToken ?? null;
    this.onTokensChanged = onTokensChanged;
  }

  static async ping(serverUrl: string): Promise<PingResponse> {
    const res = await fetch(`${normalizeServerUrl(serverUrl)}/api/v1/ping`);
    if (!res.ok) throw new ApiError(res.status, "Bot nicht erreichbar");
    return res.json();
  }

  static async login(
    serverUrl: string,
    username: string,
    password: string,
  ): Promise<TokenPair> {
    const res = await fetch(`${normalizeServerUrl(serverUrl)}/api/v1/token/login`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401) throw new ApiError(401, "Benutzername oder Passwort falsch");
      throw new ApiError(res.status, "Login fehlgeschlagen");
    }
    return res.json();
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
    retry = true,
  ): Promise<T> {
    if (!this.accessToken) throw new ApiError(401, "Nicht angemeldet");

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${this.accessToken}`,
        ...init.headers,
      },
    });

    if (res.status === 401 && retry && this.refreshToken) {
      const refreshed = await this.tryRefresh();
      if (refreshed) return this.request<T>(path, init, false);
    }

    if (!res.ok) {
      const body = await res.text();
      throw new ApiError(res.status, body || res.statusText);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  private async tryRefresh(): Promise<boolean> {
    if (!this.refreshToken) return false;
    try {
      const res = await fetch(`${this.baseUrl}/token/refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.refreshToken}` },
      });
      if (!res.ok) {
        this.accessToken = null;
        this.onTokensChanged?.(null);
        return false;
      }
      const data: TokenPair = await res.json();
      this.accessToken = data.access_token;
      this.onTokensChanged?.({ access_token: this.accessToken, refresh_token: this.refreshToken });
      return true;
    } catch {
      return false;
    }
  }

  // --- Read endpoints -----------------------------------------------------

  ping(): Promise<PingResponse> {
    return this.request("/ping", {}, false);
  }

  version(): Promise<VersionResponse> {
    return this.request("/version");
  }

  showConfig(): Promise<ShowConfigResponse> {
    return this.request("/show_config");
  }

  balance(): Promise<BalanceResponse> {
    return this.request("/balance");
  }

  status(): Promise<StatusResponse> {
    return this.request("/status");
  }

  count(): Promise<CountResponse> {
    return this.request("/count");
  }

  trades(limit = 100, offset = 0): Promise<TradesResponse> {
    return this.request(`/trades?limit=${limit}&offset=${offset}`);
  }

  profit(): Promise<ProfitResponse> {
    return this.request("/profit");
  }

  daily(timescale = 14): Promise<DailyResponse> {
    return this.request(`/daily?timescale=${timescale}`);
  }

  performance(): Promise<PerformanceEntry[]> {
    return this.request("/performance");
  }

  whitelist(): Promise<WhitelistResponse> {
    return this.request("/whitelist");
  }

  blacklist(): Promise<BlacklistResponse> {
    return this.request("/blacklist");
  }

  locks(): Promise<LocksResponse> {
    return this.request("/locks");
  }

  sysinfo(): Promise<SysInfoResponse> {
    return this.request("/sysinfo");
  }

  health(): Promise<HealthResponse> {
    return this.request("/health");
  }

  logs(limit = 200): Promise<{ logs: [string, string, string, string, string][] }> {
    return this.request(`/logs?limit=${limit}`);
  }

  // --- Control endpoints ---------------------------------------------------

  start(): Promise<{ status: string }> {
    return this.request("/start", { method: "POST" });
  }

  stop(): Promise<{ status: string }> {
    return this.request("/stop", { method: "POST" });
  }

  pause(): Promise<{ status: string }> {
    return this.request("/pause", { method: "POST" });
  }

  stopBuy(): Promise<{ status: string }> {
    return this.request("/stopbuy", { method: "POST" });
  }

  reloadConfig(): Promise<{ status: string }> {
    return this.request("/reload_config", { method: "POST" });
  }

  forceExit(tradeId: number | "all", orderType?: OrderType): Promise<{ result: string }> {
    return this.request("/forceexit", {
      method: "POST",
      body: JSON.stringify({ tradeid: tradeId, ordertype: orderType }),
    });
  }

  deleteTrade(tradeId: number): Promise<Trade> {
    return this.request(`/trades/${tradeId}`, { method: "DELETE" });
  }
}

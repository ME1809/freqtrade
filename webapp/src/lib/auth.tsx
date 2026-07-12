import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiError, FreqtradeClient } from "./api";
import type { Credentials, TokenPair } from "./types";

const STORAGE_KEY = "ft-dashboard:session";

interface StoredSession {
  serverUrl: string;
  username: string;
  accessToken: string;
  refreshToken: string;
}

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

interface AuthContextValue {
  client: FreqtradeClient | null;
  serverUrl: string | null;
  username: string | null;
  status: ConnectionStatus;
  error: string | null;
  login: (creds: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

function saveStored(session: StoredSession | null) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<FreqtradeClient | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<StoredSession | null>(null);

  const buildClient = useCallback((session: StoredSession) => {
    sessionRef.current = session;
    return new FreqtradeClient(
      session.serverUrl,
      { accessToken: session.accessToken, refreshToken: session.refreshToken },
      (tokens: TokenPair | null) => {
        if (!sessionRef.current) return;
        if (!tokens) {
          logout();
          return;
        }
        const next: StoredSession = {
          ...sessionRef.current,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? sessionRef.current.refreshToken,
        };
        sessionRef.current = next;
        saveStored(next);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (creds: Credentials) => {
      setStatus("connecting");
      setError(null);
      try {
        const tokens = await FreqtradeClient.login(creds.serverUrl, creds.username, creds.password);
        const session: StoredSession = {
          serverUrl: creds.serverUrl,
          username: creds.username,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? "",
        };
        saveStored(session);
        const c = buildClient(session);
        await c.ping();
        setClient(c);
        setServerUrl(session.serverUrl);
        setUsername(session.username);
        setStatus("connected");
      } catch (err) {
        setStatus("error");
        setError(err instanceof ApiError ? err.message : "Verbindung zum Bot fehlgeschlagen");
        throw err;
      }
    },
    [buildClient],
  );

  const logout = useCallback(() => {
    saveStored(null);
    sessionRef.current = null;
    setClient(null);
    setServerUrl(null);
    setUsername(null);
    setStatus("idle");
    setError(null);
  }, []);

  useEffect(() => {
    const stored = loadStored();
    if (!stored) return;
    setStatus("connecting");
    const c = buildClient(stored);
    c.ping()
      .then(() => {
        setClient(c);
        setServerUrl(stored.serverUrl);
        setUsername(stored.username);
        setStatus("connected");
      })
      .catch(() => {
        saveStored(null);
        setStatus("idle");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ client, serverUrl, username, status, error, login, logout }),
    [client, serverUrl, username, status, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

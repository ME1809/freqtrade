import { useCallback, useEffect, useRef, useState } from "react";

interface PollState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

/**
 * Polls an async fetcher on an interval while the calling component is mounted.
 * Pass `null` as intervalMs to fetch once without polling.
 */
export function usePoll<T>(
  fetcher: () => Promise<T>,
  intervalMs: number | null,
  deps: unknown[] = [],
): PollState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(() => {
    let cancelled = false;
    fetcherRef.current()
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Fehler beim Laden");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const cancel = run();
    if (!intervalMs) return cancel;
    const id = setInterval(run, intervalMs);
    return () => {
      cancel();
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, run, ...deps]);

  return { data, error, loading, refetch: run };
}

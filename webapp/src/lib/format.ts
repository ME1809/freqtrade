export function formatCurrency(value: number | undefined | null, currency = "USDT"): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "–";
  const decimals = Math.abs(value) < 1 ? 4 : 2;
  return `${value.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} ${currency}`;
}

export function formatPercent(ratio: number | undefined | null, fromRatio = true): string {
  if (ratio === undefined || ratio === null || Number.isNaN(ratio)) return "–";
  const pct = fromRatio ? ratio * 100 : ratio;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatDate(iso: string | number | undefined | null): string {
  if (!iso) return "–";
  const d = typeof iso === "number" ? new Date(iso) : new Date(iso);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDurationSince(iso: string | undefined | null): string {
  if (!iso) return "–";
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return "–";
  const diffMin = Math.max(0, Math.round((Date.now() - start) / 60000));
  if (diffMin < 60) return `${diffMin}m`;
  const hours = Math.floor(diffMin / 60);
  if (hours < 24) return `${hours}h ${diffMin % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export function pairIcon(pair: string): string {
  return pair.split("/")[0]?.slice(0, 4) ?? pair.slice(0, 4);
}

// Shape of the subset of the freqtrade REST API this dashboard consumes.
// Reference: https://www.freqtrade.io/en/stable/rest-api/

export interface Credentials {
  serverUrl: string;
  username: string;
  password: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token?: string;
}

export interface PingResponse {
  status: string;
}

export interface VersionResponse {
  version: string;
}

export interface BalanceCurrency {
  currency: string;
  free: number;
  balance: number;
  used: number;
  est_stake: number;
  est_stake_fiat: number;
  stake: string;
  side: string;
  is_position: boolean;
}

export interface BalanceResponse {
  currencies: BalanceCurrency[];
  total: number;
  total_bot: number;
  symbol: string;
  value: number;
  value_bot: number;
  stake: string;
  note: string;
  starting_capital: number;
  starting_capital_ratio: number;
  starting_capital_fiat: number;
}

export interface TradeOrder {
  order_id: string;
  order_type: string;
  ft_order_side: string;
  status: string;
  amount: number;
  filled: number;
  price: number;
  order_date: string;
  order_timestamp: number | null;
}

export interface Trade {
  trade_id: number;
  pair: string;
  base_currency: string;
  quote_currency: string;
  is_open: boolean;
  exchange: string;
  amount: number;
  stake_amount: number;
  open_date: string;
  open_timestamp: number;
  open_rate: number;
  close_date?: string | null;
  close_timestamp?: number | null;
  close_rate?: number | null;
  current_rate?: number;
  profit_ratio?: number | null;
  profit_pct?: number | null;
  profit_abs?: number | null;
  close_profit?: number | null;
  close_profit_pct?: number | null;
  close_profit_abs?: number | null;
  stop_loss_abs?: number;
  stop_loss_pct?: number;
  strategy: string;
  enter_tag?: string | null;
  exit_reason?: string | null;
  timeframe: string;
  is_short: boolean;
  leverage: number;
  orders?: TradeOrder[];
}

export interface StatusResponse extends Array<Trade> {}

export interface TradesResponse {
  trades: Trade[];
  trades_count: number;
  offset: number;
  total_trades: number;
}

export interface ProfitResponse {
  profit_closed_coin: number;
  profit_closed_percent: number;
  profit_closed_ratio: number;
  profit_closed_fiat: number;
  profit_all_coin: number;
  profit_all_percent: number;
  profit_all_ratio: number;
  profit_all_fiat: number;
  trade_count: number;
  closed_trade_count: number;
  first_trade_date?: string;
  latest_trade_date?: string;
  avg_duration: string;
  best_pair: string;
  best_pair_profit_ratio: number;
  winning_trades: number;
  losing_trades: number;
  profit_factor: number;
  max_drawdown: number;
  max_drawdown_abs: number;
  trading_volume?: number;
  bot_start_date?: string;
}

export interface DailyEntry {
  date: string;
  abs_profit: number;
  rel_profit: number;
  fiat_value: number;
  trade_count: number;
  starting_balance: number;
}

export interface DailyResponse {
  data: DailyEntry[];
  fiat_display_currency: string;
  stake_currency: string;
}

export interface PerformanceEntry {
  pair: string;
  profit: number;
  profit_ratio: number;
  profit_pct: number;
  profit_abs: number;
  count: number;
}

export interface WhitelistResponse {
  whitelist: string[];
  length: number;
  method: string[];
}

export interface BlacklistResponse {
  blacklist: string[];
  blacklist_expanded: string[];
  length: number;
  method: string[];
  errors: Record<string, unknown>;
}

export interface CountResponse {
  current: number;
  max: number;
  total_stake: number;
}

export interface LockEntry {
  id: number;
  pair: string;
  lock_end_time: string;
  lock_end_timestamp: number;
  reason: string;
  side: string;
}

export interface LocksResponse {
  lock_count: number;
  locks: LockEntry[];
}

export interface ShowConfigResponse {
  version: string;
  state: "running" | "stopped" | "paused" | string;
  strategy: string;
  strategy_version?: string | null;
  dry_run: boolean;
  stake_currency: string;
  stake_amount: number | string;
  max_open_trades: number;
  trading_mode: string;
  exchange: string;
  timeframe: string;
  force_entry_enable: boolean;
  bot_name?: string;
}

export interface SysInfoResponse {
  cpu_pct: number[];
  ram_pct: number;
}

export interface HealthResponse {
  last_process?: string;
  last_process_ts?: number;
}

export type OrderType = "market" | "limit";

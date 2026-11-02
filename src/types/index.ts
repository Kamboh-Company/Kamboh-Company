/**
 * SignalPulse Types & Data Models
 */

export type UserRole = 'user' | 'admin';
export type UserPlan = 'free' | 'pro';

export type SignalDirection = 'LONG' | 'SHORT';
export type SignalRisk = 'Low' | 'Medium' | 'High';
export type SignalStatus = 
  | 'Active'
  | 'TP1 hit'
  | 'TP2 hit'
  | 'TP3 hit'
  | 'Stop Loss hit'
  | 'Expired'
  | 'Cancelled';

export interface IndicatorSnapshot {
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  ema: {
    ema20: number;
    ema50: number;
    ema200: number;
  };
  atr: number;
  adx: number;
  bb: {
    upper: number;
    middle: number;
    lower: number;
  };
  volumeVsAvg: number; // e.g. 1.8x
  supportLevel?: number;
  resistanceLevel?: number;
}

export interface Signal {
  id: string;
  coin: string;              // e.g. "BTC"
  pair: string;              // e.g. "BTC/USDT"
  direction: SignalDirection;
  timeframe: '1h' | '4h';
  entry_price: number;
  tp1_price: number;
  tp2_price: number;
  tp3_price: number;
  stop_loss_price: number;
  current_price?: number;
  leverage_suggestion: string; // e.g. "2x - 3x" or "5x"
  risk_level: SignalRisk;
  confidence_score: number;   // 0 - 100
  reasoning: string;          // Plain-English explanation
  indicators_snapshot: IndicatorSnapshot;
  status: SignalStatus;
  is_premium: boolean;        // confidence >= 75
  is_demo?: boolean;          // true for demo seed data, excluded from real performance stats
  closed_at?: string | null;
  exit_price?: number | null;
  result_r?: number | null;   // R-multiple result (e.g. +1.0, +2.0, -1.0)
  created_at: string;
  updated_at?: string;
  source: 'algorithmic' | 'manual';
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  plan: UserPlan;
  created_at: string;
  updated_at?: string;
  banned?: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  lemon_subscription_id?: string;
  lemon_order_id?: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'unpaid' | 'on_trial';
  plan: UserPlan;
  variant_id?: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  customer_portal_url?: string;
  created_at: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  coin: string;
  pair: string;
  added_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'signal' | 'billing' | 'system' | 'announcement';
  read: boolean;
  signal_id?: string;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  in_app_notifications: boolean;
  new_signals: boolean;
  tp_hit_alerts: boolean;
  sl_hit_alerts: boolean;
  marketing_emails: boolean;
}

export interface EngineSettings {
  is_active: boolean;
  scan_interval_minutes: number;
  min_confidence: number;
  max_signals_per_day: number;
  cooldown_hours: number;
  supported_coins: string[];
  timeframes: ('1h' | '4h')[];
  risk_reward_tp1: number;
  risk_reward_tp2: number;
  risk_reward_tp3: number;
  updated_at: string;
}

export interface EngineLog {
  id: string;
  timestamp: string;
  exchange: 'Binance' | 'Bybit' | 'OKX';
  coin: string;
  timeframe: string;
  status: 'success' | 'warning' | 'error' | 'skipped';
  message: string;
  details?: Record<string, unknown>;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target_audience: 'all' | 'pro' | 'free';
  sent_email: boolean;
  created_at: string;
  created_by: string;
}

export interface PerformanceStats {
  winRate: number;         // percentage e.g. 74.2%
  avgR: number;            // e.g. 1.85R
  profitFactor: number;    // e.g. 2.14
  totalSignals: number;
  closedSignals: number;
  activeSignals: number;
  hasEnoughData: boolean;  // >= 30 closed signals
  totalLongs: number;
  totalShorts: number;
  monthlyPnL: { month: string; rMultiple: number; winRate: number; count: number }[];
}

export interface CoinPriceData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h?: number;
  low24h?: number;
  volume24h?: number;
  sparkline?: number[];
}

export interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

// ============================================================================
// REFERRAL & AFFILIATE EARNING SYSTEM
// ============================================================================

export type PayoutMethod = 'USDT_TRC20' | 'USDT_BEP20' | 'BINANCE_PAY' | 'BANK_TRANSFER' | 'JAZZCASH_EASYPAISA';
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'rejected';

export interface ReferralUser {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  referred_email_masked: string;
  referred_name?: string;
  status: 'signed_up' | 'active_pro_monthly' | 'active_pro_yearly';
  plan: UserPlan;
  total_commission_generated: number;
  created_at: string;
}

export interface PayoutRequest {
  id: string;
  user_id: string;
  amount: number;
  method: PayoutMethod;
  payout_details: string; // e.g. TRC20 address, Binance Pay ID, or Account #
  status: PayoutStatus;
  tx_hash_or_ref?: string;
  created_at: string;
  processed_at?: string;
  note?: string;
}

export interface ReferralStats {
  referral_code: string;
  referral_link: string;
  total_clicks: number;
  total_signups: number;
  active_subscribers: number;
  commission_rate: number; // e.g. 0.30 (30%)
  current_tier: string;
  next_tier_target: number;
  total_earned: number;
  total_paid: number;
  available_balance: number;
  pending_payout: number;
}


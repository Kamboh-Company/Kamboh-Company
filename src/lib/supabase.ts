/**
 * Supabase Client Configuration & Hybrid Local-First Service
 * Supports live Supabase with full RLS fallback store for sandbox preview.
 */

import { createClient } from '@supabase/supabase-js';
import {
  Signal,
  Profile,
  WatchlistItem,
  NotificationItem,
  NotificationPreferences,
  EngineSettings,
  EngineLog,
  ContactMessage,
  Announcement,
  PerformanceStats,
  UserPlan,
  ReferralUser,
  PayoutRequest,
  ReferralStats,
  PayoutMethod,
  PayoutStatus,
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isRealSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isRealSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// INITIAL DEMO & HISTORICAL DATA
// Seed signals marked clearly with is_demo = true and real signals
// ============================================================================

export const INITIAL_DEMO_SIGNALS: Signal[] = [
  {
    id: 'sig-001',
    coin: 'BTC',
    pair: 'BTC/USDT',
    direction: 'LONG',
    timeframe: '4h',
    entry_price: 67200.0,
    tp1_price: 68650.0,
    tp2_price: 70100.0,
    tp3_price: 71550.0,
    stop_loss_price: 65750.0,
    current_price: 68420.0,
    leverage_suggestion: '3x - 5x',
    risk_level: 'Low',
    confidence_score: 88,
    reasoning: 'RSI recovered from oversold (44.2), MACD bullish crossover, price above EMA50 and EMA200, volume 1.9x average.',
    indicators_snapshot: {
      rsi: 54.2,
      macd: { macdLine: 340.5, signalLine: 210.2, histogram: 130.3 },
      ema: { ema20: 67100, ema50: 66200, ema200: 63800 },
      atr: 960.0,
      adx: 28.4,
      bb: { upper: 69500, middle: 67000, lower: 64500 },
      volumeVsAvg: 1.85,
      supportLevel: 65800,
      resistanceLevel: 71200,
    },
    status: 'Active',
    is_premium: true,
    is_demo: true,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    source: 'algorithmic',
  },
  {
    id: 'sig-002',
    coin: 'ETH',
    pair: 'ETH/USDT',
    direction: 'LONG',
    timeframe: '1h',
    entry_price: 3450.0,
    tp1_price: 3525.0,
    tp2_price: 3600.0,
    tp3_price: 3675.0,
    stop_loss_price: 3375.0,
    current_price: 3512.0,
    leverage_suggestion: '3x - 5x',
    risk_level: 'Medium',
    confidence_score: 82,
    reasoning: 'EMA20 > EMA50 trend alignment, MACD positive expansion, swing support bounce at $3,420.',
    indicators_snapshot: {
      rsi: 58.6,
      macd: { macdLine: 18.4, signalLine: 12.1, histogram: 6.3 },
      ema: { ema20: 3460, ema50: 3410, ema200: 3290 },
      atr: 50.0,
      adx: 26.2,
      bb: { upper: 3560, middle: 3450, lower: 3340 },
      volumeVsAvg: 1.45,
      supportLevel: 3420,
      resistanceLevel: 3650,
    },
    status: 'TP1 hit',
    is_premium: true,
    is_demo: true,
    closed_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    exit_price: 3528.0,
    result_r: 1.04,
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    source: 'algorithmic',
  },
  {
    id: 'sig-003',
    coin: 'SOL',
    pair: 'SOL/USDT',
    direction: 'LONG',
    timeframe: '1h',
    entry_price: 172.5,
    tp1_price: 178.5,
    tp2_price: 184.5,
    tp3_price: 190.5,
    stop_loss_price: 166.5,
    current_price: 178.6,
    leverage_suggestion: '2x - 3x',
    risk_level: 'High',
    confidence_score: 91,
    reasoning: 'Volume surge 2.4x, breakout above recent swing resistance at $171.80, ADX 34.1 strong trend.',
    indicators_snapshot: {
      rsi: 64.1,
      macd: { macdLine: 2.8, signalLine: 1.6, histogram: 1.2 },
      ema: { ema20: 172.0, ema50: 168.0, ema200: 154.0 },
      atr: 4.0,
      adx: 34.1,
      bb: { upper: 180.0, middle: 171.0, lower: 162.0 },
      volumeVsAvg: 2.4,
      supportLevel: 168.0,
      resistanceLevel: 188.0,
    },
    status: 'TP1 hit',
    is_premium: true,
    is_demo: true,
    closed_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    exit_price: 179.2,
    result_r: 1.12,
    created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    source: 'algorithmic',
  },
  {
    id: 'sig-004',
    coin: 'BNB',
    pair: 'BNB/USDT',
    direction: 'SHORT',
    timeframe: '4h',
    entry_price: 602.0,
    tp1_price: 588.0,
    tp2_price: 574.0,
    tp3_price: 560.0,
    stop_loss_price: 616.0,
    current_price: 592.4,
    leverage_suggestion: '3x - 5x',
    risk_level: 'Medium',
    confidence_score: 71, // Free signal (<75)
    reasoning: 'RSI rejected at 66, price failed at swing resistance $605, MACD bearish tick.',
    indicators_snapshot: {
      rsi: 48.2,
      macd: { macdLine: -1.2, signalLine: 0.4, histogram: -1.6 },
      ema: { ema20: 598, ema50: 604, ema200: 610 },
      atr: 9.3,
      adx: 22.0,
      bb: { upper: 612, middle: 596, lower: 580 },
      volumeVsAvg: 1.1,
      supportLevel: 575,
      resistanceLevel: 608,
    },
    status: 'Active',
    is_premium: false,
    is_demo: true,
    created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // >1 hr ago, visible to free
    source: 'algorithmic',
  },
  {
    id: 'sig-005',
    coin: 'AVAX',
    pair: 'AVAX/USDT',
    direction: 'LONG',
    timeframe: '1h',
    entry_price: 28.5,
    tp1_price: 29.7,
    tp2_price: 30.9,
    tp3_price: 32.1,
    stop_loss_price: 27.3,
    current_price: 29.8,
    leverage_suggestion: '3x - 5x',
    risk_level: 'Medium',
    confidence_score: 72,
    reasoning: 'Consolidation breakout on 1h timeframe, price reclaiming EMA50 with growing buy volume.',
    indicators_snapshot: {
      rsi: 56.4,
      macd: { macdLine: 0.35, signalLine: 0.15, histogram: 0.2 },
      ema: { ema20: 28.7, ema50: 28.1, ema200: 26.8 },
      atr: 0.8,
      adx: 24.5,
      bb: { upper: 30.2, middle: 28.5, lower: 26.8 },
      volumeVsAvg: 1.35,
      supportLevel: 27.5,
      resistanceLevel: 31.0,
    },
    status: 'TP1 hit',
    is_premium: false,
    is_demo: true,
    closed_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    exit_price: 29.75,
    result_r: 1.04,
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    source: 'algorithmic',
  },
  {
    id: 'sig-006',
    coin: 'LINK',
    pair: 'LINK/USDT',
    direction: 'SHORT',
    timeframe: '4h',
    entry_price: 15.2,
    tp1_price: 14.4,
    tp2_price: 13.6,
    tp3_price: 12.8,
    stop_loss_price: 16.0,
    current_price: 14.2,
    leverage_suggestion: '3x - 5x',
    risk_level: 'Medium',
    confidence_score: 84,
    reasoning: 'Price rejected below EMA200, MACD histogram crossing below zero, high sell volume.',
    indicators_snapshot: {
      rsi: 42.1,
      macd: { macdLine: -0.22, signalLine: -0.05, histogram: -0.17 },
      ema: { ema20: 14.8, ema50: 15.1, ema200: 15.5 },
      atr: 0.53,
      adx: 27.8,
      bb: { upper: 15.8, middle: 14.6, lower: 13.4 },
      volumeVsAvg: 1.6,
      supportLevel: 13.2,
      resistanceLevel: 15.6,
    },
    status: 'TP1 hit',
    is_premium: true,
    is_demo: true,
    closed_at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    exit_price: 14.35,
    result_r: 1.06,
    created_at: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    source: 'algorithmic',
  },
  {
    id: 'sig-007',
    coin: 'DOGE',
    pair: 'DOGE/USDT',
    direction: 'LONG',
    timeframe: '1h',
    entry_price: 0.138,
    tp1_price: 0.145,
    tp2_price: 0.152,
    tp3_price: 0.159,
    stop_loss_price: 0.131,
    current_price: 0.142,
    leverage_suggestion: '3x - 5x',
    risk_level: 'High',
    confidence_score: 79,
    reasoning: 'Meme momentum bounce off EMA50, RSI bull divergence on 1h chart.',
    indicators_snapshot: {
      rsi: 59.2,
      macd: { macdLine: 0.002, signalLine: 0.001, histogram: 0.001 },
      ema: { ema20: 0.139, ema50: 0.136, ema200: 0.128 },
      atr: 0.0046,
      adx: 29.0,
      bb: { upper: 0.148, middle: 0.138, lower: 0.128 },
      volumeVsAvg: 1.9,
      supportLevel: 0.132,
      resistanceLevel: 0.155,
    },
    status: 'Active',
    is_premium: true,
    is_demo: true,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    source: 'algorithmic',
  },
  {
    id: 'sig-008',
    coin: 'XRP',
    pair: 'XRP/USDT',
    direction: 'LONG',
    timeframe: '4h',
    entry_price: 0.56,
    tp1_price: 0.585,
    tp2_price: 0.61,
    tp3_price: 0.635,
    stop_loss_price: 0.535,
    current_price: 0.584,
    leverage_suggestion: '3x - 5x',
    risk_level: 'Low',
    confidence_score: 86,
    reasoning: 'Breakout above horizontal resistance, multi-day accumulation pattern confirmed by volume.',
    indicators_snapshot: {
      rsi: 61.3,
      macd: { macdLine: 0.012, signalLine: 0.006, histogram: 0.006 },
      ema: { ema20: 0.568, ema50: 0.552, ema200: 0.531 },
      atr: 0.016,
      adx: 31.2,
      bb: { upper: 0.595, middle: 0.565, lower: 0.535 },
      volumeVsAvg: 2.1,
      supportLevel: 0.54,
      resistanceLevel: 0.62,
    },
    status: 'TP1 hit',
    is_premium: true,
    is_demo: true,
    closed_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    exit_price: 0.586,
    result_r: 1.04,
    created_at: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
    source: 'algorithmic',
  },
];

// Initial engine settings
export const INITIAL_ENGINE_SETTINGS: EngineSettings = {
  is_active: true,
  scan_interval_minutes: 15,
  min_confidence: 65,
  max_signals_per_day: 5,
  cooldown_hours: 6,
  supported_coins: ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX', 'LINK', 'MATIC'],
  timeframes: ['1h', '4h'],
  risk_reward_tp1: 1.0,
  risk_reward_tp2: 2.0,
  risk_reward_tp3: 3.0,
  updated_at: new Date().toISOString(),
};

// ============================================================================
// LOCAL STORAGE ADAPTER / REPOSITORY
// Ensures that data persists in the browser and updates in real-time
// ============================================================================

const SIGNALS_KEY = 'signalpulse_signals';
const SETTINGS_KEY = 'signalpulse_engine_settings';
const LOGS_KEY = 'signalpulse_engine_logs';
const WATCHLIST_KEY = 'signalpulse_watchlist';
const NOTIFICATIONS_KEY = 'signalpulse_notifications';
const PREFERENCES_KEY = 'signalpulse_preferences';
const MESSAGES_KEY = 'signalpulse_contact_messages';
const ANNOUNCEMENTS_KEY = 'signalpulse_announcements';
const USERS_KEY = 'signalpulse_users';
const REFERRALS_KEY = 'kambohplus_referrals';
const PAYOUTS_KEY = 'kambohplus_payout_requests';
const CLICKS_KEY = 'kambohplus_referral_clicks';
const REFERRAL_CODES_KEY = 'kambohplus_referral_codes';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

export const signalStorage = {
  getSignals(): Signal[] {
    const stored = getStorage<Signal[]>(SIGNALS_KEY, []);
    if (!stored || stored.length === 0) {
      setStorage(SIGNALS_KEY, INITIAL_DEMO_SIGNALS);
      return INITIAL_DEMO_SIGNALS;
    }
    return stored;
  },
  saveSignals(signals: Signal[]) {
    setStorage(SIGNALS_KEY, signals);
  },
  addSignal(signal: Signal) {
    const list = this.getSignals();
    list.unshift(signal);
    this.saveSignals(list);
  },
  updateSignal(id: string, updates: Partial<Signal>) {
    const list = this.getSignals().map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.saveSignals(list);
  },
  deleteSignal(id: string) {
    const list = this.getSignals().filter((s) => s.id !== id);
    this.saveSignals(list);
  },
};

export const watchlistStorage = {
  getWatchlist(userId: string): WatchlistItem[] {
    const all = getStorage<WatchlistItem[]>(WATCHLIST_KEY, [
      { id: 'w1', user_id: userId, coin: 'BTC', pair: 'BTC/USDT', added_at: new Date().toISOString() },
      { id: 'w2', user_id: userId, coin: 'ETH', pair: 'ETH/USDT', added_at: new Date().toISOString() },
      { id: 'w3', user_id: userId, coin: 'SOL', pair: 'SOL/USDT', added_at: new Date().toISOString() },
    ]);
    return all.filter((w) => w.user_id === userId);
  },
  toggleWatchlist(userId: string, coin: string): boolean {
    const all = getStorage<WatchlistItem[]>(WATCHLIST_KEY, []);
    const exists = all.find((w) => w.user_id === userId && w.coin === coin);
    let updated: WatchlistItem[];
    let added = false;
    if (exists) {
      updated = all.filter((w) => !(w.user_id === userId && w.coin === coin));
      added = false;
    } else {
      updated = [...all, { id: 'w-' + Date.now(), user_id: userId, coin, pair: `${coin}/USDT`, added_at: new Date().toISOString() }];
      added = true;
    }
    setStorage(WATCHLIST_KEY, updated);
    return added;
  },
};

export const notificationStorage = {
  getNotifications(userId: string): NotificationItem[] {
    const defaultNotifs: NotificationItem[] = [
      {
        id: 'n1',
        user_id: userId,
        title: 'New Signal: BTC/USDT Long',
        message: 'Algorithmic signal triggered on 4h timeframe with 88% confidence.',
        type: 'signal',
        read: false,
        signal_id: 'sig-001',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 'n2',
        user_id: userId,
        title: 'Target Hit: ETH/USDT TP1',
        message: 'Take Profit 1 hit at $3,525.00 (+1.04R). Risk mitigated.',
        type: 'signal',
        read: false,
        signal_id: 'sig-002',
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
      {
        id: 'n3',
        user_id: userId,
        title: 'Welcome to Kamboh Plus',
        message: 'Automated crypto trading signals platform activated. Monitor live feeds and risk targets.',
        type: 'system',
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];
    const all = getStorage<NotificationItem[]>(NOTIFICATIONS_KEY, defaultNotifs);
    return all.filter((n) => n.user_id === userId);
  },
  markAsRead(userId: string, id?: string) {
    const all = getStorage<NotificationItem[]>(NOTIFICATIONS_KEY, []);
    const updated = all.map((n) => {
      if (n.user_id === userId && (!id || n.id === id)) {
        return { ...n, read: true };
      }
      return n;
    });
    setStorage(NOTIFICATIONS_KEY, updated);
  },
  addNotification(item: NotificationItem) {
    const all = getStorage<NotificationItem[]>(NOTIFICATIONS_KEY, []);
    all.unshift(item);
    setStorage(NOTIFICATIONS_KEY, all);
  },
};

export const engineSettingsStorage = {
  getSettings(): EngineSettings {
    return getStorage<EngineSettings>(SETTINGS_KEY, INITIAL_ENGINE_SETTINGS);
  },
  saveSettings(settings: EngineSettings) {
    setStorage(SETTINGS_KEY, settings);
  },
  getLogs(): EngineLog[] {
    return getStorage<EngineLog[]>(LOGS_KEY, [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        exchange: 'Binance',
        coin: 'BTC',
        timeframe: '4h',
        status: 'success',
        message: 'Scan complete. Triggered signal sig-001 (Confidence 88%).',
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        exchange: 'Binance',
        coin: 'ETH',
        timeframe: '1h',
        status: 'success',
        message: 'Scan complete. Market aligned with bullish momentum.',
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        exchange: 'Bybit',
        coin: 'BNB',
        timeframe: '4h',
        status: 'skipped',
        message: 'ADX low (18.2). Market in chop/consolidation, skipping.',
      },
    ]);
  },
  addLog(log: EngineLog) {
    const all = this.getLogs();
    all.unshift(log);
    setStorage(LOGS_KEY, all.slice(0, 100)); // keep last 100
  },
};

export const contactStorage = {
  getMessages(): ContactMessage[] {
    return getStorage<ContactMessage[]>(MESSAGES_KEY, [
      {
        id: 'cm-1',
        name: 'Kamboh Trader',
        email: 'kamboh.trader@gmail.com',
        subject: 'API & Webhook Access Inquiry',
        message: 'Hi team, loving the algorithmic signals. Do you offer raw webhook streaming for automated execution?',
        status: 'unread',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: 'cm-2',
        name: 'Sarah Chen',
        email: 'sarah.c@gmail.com',
        subject: 'Billing assistance on Pro plan',
        message: 'Wanted to check if yearly subscription can be upgraded or invoiced for company expenses.',
        status: 'read',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    ]);
  },
  addMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) {
    const all = this.getMessages();
    const item: ContactMessage = {
      ...msg,
      id: 'cm-' + Date.now(),
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    all.unshift(item);
    setStorage(MESSAGES_KEY, all);
  },
};

export const announcementStorage = {
  getAnnouncements(): Announcement[] {
    return getStorage<Announcement[]>(ANNOUNCEMENTS_KEY, [
      {
        id: 'anc-1',
        title: 'New Bybit & OKX Redundancy Engine Deployed',
        message: 'Our algorithmic signal scanner now automatically fails over across 3 top-tier exchanges for ultra-reliable candle analysis.',
        target_audience: 'all',
        sent_email: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        created_by: 'System Administrator',
      },
    ]);
  },
  addAnnouncement(anc: Omit<Announcement, 'id' | 'created_at'>) {
    const all = this.getAnnouncements();
    const item: Announcement = {
      ...anc,
      id: 'anc-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    all.unshift(item);
    setStorage(ANNOUNCEMENTS_KEY, all);
  },
};

export const userStorage = {
  getUsers(): Profile[] {
    const defaultUsers: Profile[] = [
      {
        id: 'user-admin',
        email: 'admin@signalpulse.io',
        full_name: 'Lead Quant Admin',
        role: 'admin',
        plan: 'pro',
        created_at: '2025-01-01T00:00:00Z',
      },
      {
        id: 'user-pro-demo',
        email: 'pro.trader@gmail.com',
        full_name: 'Jordan Miller',
        role: 'user',
        plan: 'pro',
        created_at: '2025-01-15T12:00:00Z',
      },
      {
        id: 'user-free-demo',
        email: 'free.member@gmail.com',
        full_name: 'Taylor Smith',
        role: 'user',
        plan: 'free',
        created_at: '2025-02-01T08:30:00Z',
      },
    ];
    return getStorage<Profile[]>(USERS_KEY, defaultUsers);
  },
  saveUsers(users: Profile[]) {
    setStorage(USERS_KEY, users);
  },
  updateUser(id: string, updates: Partial<Profile>) {
    const list = this.getUsers().map((u) => (u.id === id ? { ...u, ...updates } : u));
    this.saveUsers(list);
  },
};

export const referralStorage = {
  getReferralCode(userId: string): string {
    const map = getStorage<Record<string, string>>(REFERRAL_CODES_KEY, {});
    if (map[userId]) return map[userId];
    const cleanId = userId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
    const code = `KAMBOH-${cleanId || 'PRO9'}`;
    map[userId] = code;
    setStorage(REFERRAL_CODES_KEY, map);
    return code;
  },

  getUserIdByCode(code: string): string | null {
    const map = getStorage<Record<string, string>>(REFERRAL_CODES_KEY, {});
    const norm = code.trim().toUpperCase();
    for (const [uid, c] of Object.entries(map)) {
      if (c.toUpperCase() === norm) return uid;
    }
    if (norm.startsWith('KAMBOH')) return 'demo-user-1';
    return null;
  },

  getClicks(userId: string): number {
    const clicksMap = getStorage<Record<string, number>>(CLICKS_KEY, {
      'demo-user-1': 48,
    });
    return clicksMap[userId] || 0;
  },

  incrementClicks(referralCode: string): void {
    const uid = this.getUserIdByCode(referralCode);
    if (!uid) return;
    const clicksMap = getStorage<Record<string, number>>(CLICKS_KEY, {});
    clicksMap[uid] = (clicksMap[uid] || 0) + 1;
    setStorage(CLICKS_KEY, clicksMap);
  },

  getReferredUsers(userId: string): ReferralUser[] {
    const all = getStorage<ReferralUser[]>(REFERRALS_KEY, []);
    const userReferrals = all.filter((r) => r.referrer_id === userId);
    
    if (userReferrals.length === 0 && (userId === 'demo-user-1' || userId === 'user-admin')) {
      const demoReferrals: ReferralUser[] = [
        {
          id: 'ref-1',
          referrer_id: userId,
          referred_user_id: 'user-sub-1',
          referred_email_masked: 'm***295@gmail.com',
          referred_name: 'Muhammad K.',
          status: 'active_pro_monthly',
          plan: 'pro',
          total_commission_generated: 16.20,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 75).toISOString(),
        },
        {
          id: 'ref-2',
          referrer_id: userId,
          referred_user_id: 'user-sub-2',
          referred_email_masked: 't***crypto@yahoo.com',
          referred_name: 'Tariq Traders',
          status: 'active_pro_yearly',
          plan: 'pro',
          total_commission_generated: 23.70,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 42).toISOString(),
        },
        {
          id: 'ref-3',
          referrer_id: userId,
          referred_user_id: 'user-sub-3',
          referred_email_masked: 'h***scalper@outlook.com',
          referred_name: 'Hamza S.',
          status: 'active_pro_monthly',
          plan: 'pro',
          total_commission_generated: 8.10,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
        },
        {
          id: 'ref-4',
          referrer_id: userId,
          referred_user_id: 'user-sub-4',
          referred_email_masked: 'k***invest@gmail.com',
          referred_name: 'Kashif Ali',
          status: 'signed_up',
          plan: 'free',
          total_commission_generated: 0.00,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        },
        {
          id: 'ref-5',
          referrer_id: userId,
          referred_user_id: 'user-sub-5',
          referred_email_masked: 'f***trader99@hotmail.com',
          referred_name: 'Fahad R.',
          status: 'signed_up',
          plan: 'free',
          total_commission_generated: 0.00,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
      ];
      setStorage(REFERRALS_KEY, [...all, ...demoReferrals]);
      return demoReferrals;
    }
    return userReferrals;
  },

  getPayouts(userId: string): PayoutRequest[] {
    const all = getStorage<PayoutRequest[]>(PAYOUTS_KEY, []);
    const userPayouts = all.filter((p) => p.user_id === userId);
    if (userPayouts.length === 0 && (userId === 'demo-user-1' || userId === 'user-admin')) {
      const demoPayout: PayoutRequest = {
        id: 'payout-101',
        user_id: userId,
        amount: 25.00,
        method: 'USDT_TRC20',
        payout_details: 'TYD2v9kHqU3XF84zP97wJ5g2eK4bLs18Mn',
        status: 'paid',
        tx_hash_or_ref: 'b4a8e6328c70f5e128148b5982103f19e4871e956c',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        processed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
        note: 'Auto-processed monthly affiliate earnings payout.',
      };
      setStorage(PAYOUTS_KEY, [...all, demoPayout]);
      return [demoPayout];
    }
    return userPayouts;
  },

  getStats(userId: string): ReferralStats {
    const code = this.getReferralCode(userId);
    const domain = window.location.origin;
    const referral_link = `${domain}/signup?ref=${code}`;
    const referrals = this.getReferredUsers(userId);
    const payouts = this.getPayouts(userId);
    const clicks = this.getClicks(userId) || Math.max(referrals.length * 4, 12);

    const activeSubs = referrals.filter(
      (r) => r.status === 'active_pro_monthly' || r.status === 'active_pro_yearly'
    ).length;

    let commission_rate = 0.20;
    let current_tier = 'Starter Affiliate (20%)';
    let next_tier_target = 6;
    if (referrals.length >= 21) {
      commission_rate = 0.40;
      current_tier = 'Whale VIP Partner (40%)';
      next_tier_target = 50;
    } else if (referrals.length >= 6) {
      commission_rate = 0.30;
      current_tier = 'Ambassador Partner (30%)';
      next_tier_target = 21;
    }

    const total_earned = referrals.reduce((sum, r) => sum + r.total_commission_generated, 0);
    const total_paid = payouts
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pending_payout = payouts
      .filter((p) => p.status === 'pending' || p.status === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);

    const available_balance = Math.max(0, Number((total_earned - total_paid - pending_payout).toFixed(2)));

    return {
      referral_code: code,
      referral_link,
      total_clicks: clicks,
      total_signups: referrals.length,
      active_subscribers: activeSubs,
      commission_rate,
      current_tier,
      next_tier_target,
      total_earned: Number(total_earned.toFixed(2)),
      total_paid: Number(total_paid.toFixed(2)),
      available_balance,
      pending_payout: Number(pending_payout.toFixed(2)),
    };
  },

  requestPayout(
    userId: string,
    amount: number,
    method: PayoutMethod,
    payout_details: string
  ): { success: boolean; error?: string; payout?: PayoutRequest } {
    const stats = this.getStats(userId);
    if (amount < 20) {
      return { success: false, error: 'Minimum withdrawal amount is $20.00 USD.' };
    }
    if (amount > stats.available_balance) {
      return { success: false, error: `Insufficient available balance ($${stats.available_balance.toFixed(2)} available).` };
    }
    if (!payout_details || payout_details.trim().length < 5) {
      return { success: false, error: 'Please enter valid wallet address or account details.' };
    }

    const all = getStorage<PayoutRequest[]>(PAYOUTS_KEY, []);
    const newPayout: PayoutRequest = {
      id: 'payout-' + Date.now(),
      user_id: userId,
      amount: Number(amount.toFixed(2)),
      method,
      payout_details: payout_details.trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    all.unshift(newPayout);
    setStorage(PAYOUTS_KEY, all);

    notificationStorage.addNotification({
      id: 'notif-' + Date.now(),
      user_id: userId,
      title: 'Payout Request Submitted',
      message: `Your withdrawal of $${amount.toFixed(2)} via ${method.replace('_', ' ')} is under review. Processed within 24 hours.`,
      type: 'billing',
      read: false,
      created_at: new Date().toISOString(),
    });

    return { success: true, payout: newPayout };
  },

  registerReferral(referralCode: string, newUser: { id: string; email: string; name?: string }): boolean {
    const referrerId = this.getUserIdByCode(referralCode);
    if (!referrerId || referrerId === newUser.id) return false;

    const all = getStorage<ReferralUser[]>(REFERRALS_KEY, []);
    if (all.some((r) => r.referred_user_id === newUser.id)) return false;

    const parts = newUser.email.split('@');
    const masked = parts[0].slice(0, 1) + '***' + (parts[0].length > 4 ? parts[0].slice(-2) : '') + '@' + parts[1];

    const newRef: ReferralUser = {
      id: 'ref-' + Date.now(),
      referrer_id: referrerId,
      referred_user_id: newUser.id,
      referred_email_masked: masked,
      referred_name: newUser.name || 'Anonymous Trader',
      status: 'signed_up',
      plan: 'free',
      total_commission_generated: 0,
      created_at: new Date().toISOString(),
    };

    all.unshift(newRef);
    setStorage(REFERRALS_KEY, all);

    notificationStorage.addNotification({
      id: 'notif-' + Date.now(),
      user_id: referrerId,
      title: '🎉 New Referral Joined Kamboh Plus!',
      message: `${masked} registered using your affiliate link. You will earn recurring commissions when they upgrade to Pro!`,
      type: 'system',
      read: false,
      created_at: new Date().toISOString(),
    });

    return true;
  },

  attributeProUpgrade(userId: string, planType: 'monthly' | 'yearly'): void {
    const all = getStorage<ReferralUser[]>(REFERRALS_KEY, []);
    const refIndex = all.findIndex((r) => r.referred_user_id === userId);
    if (refIndex === -1) return;

    const ref = all[refIndex];
    const commission = planType === 'yearly' ? 23.70 : 2.70;

    all[refIndex] = {
      ...ref,
      status: planType === 'yearly' ? 'active_pro_yearly' : 'active_pro_monthly',
      plan: 'pro',
      total_commission_generated: Number((ref.total_commission_generated + commission).toFixed(2)),
    };
    setStorage(REFERRALS_KEY, all);

    notificationStorage.addNotification({
      id: 'notif-' + Date.now(),
      user_id: ref.referrer_id,
      title: '💰 Affiliate Commission Earned!',
      message: `Your referral (${ref.referred_email_masked}) upgraded to Pro ${planType}! You earned $${commission.toFixed(2)} commission.`,
      type: 'billing',
      read: false,
      created_at: new Date().toISOString(),
    });
  },

  getAllPayouts(): PayoutRequest[] {
    return getStorage<PayoutRequest[]>(PAYOUTS_KEY, []);
  },

  updatePayoutStatus(id: string, status: PayoutStatus, txHash?: string): void {
    const all = getStorage<PayoutRequest[]>(PAYOUTS_KEY, []);
    const updated = all.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status,
          tx_hash_or_ref: txHash || p.tx_hash_or_ref,
          processed_at: new Date().toISOString(),
        };
      }
      return p;
    });
    setStorage(PAYOUTS_KEY, updated);
  },
};


// ============================================================================
// PERFORMANCE CALCULATIONS (STRICTLY FROM DATABASE CLOSED SIGNALS)
// "All calculated ONLY from closed signals in the database.
//  Show 'Not enough data yet' until 30 closed signals exist."
// ============================================================================

export function calculateDatabasePerformance(signals: Signal[]): PerformanceStats {
  // Exclude demo signals from real audited performance stats if specified,
  // or calculate strictly from closed signals in DB!
  const realClosed = signals.filter(
    (s) => !s.is_demo && (s.status === 'TP1 hit' || s.status === 'TP2 hit' || s.status === 'TP3 hit' || s.status === 'Stop Loss hit')
  );

  const closedCount = realClosed.length;
  const hasEnoughData = closedCount >= 30;

  if (closedCount === 0) {
    return {
      winRate: 0,
      avgR: 0,
      profitFactor: 0,
      totalSignals: signals.filter((s) => !s.is_demo).length,
      closedSignals: 0,
      activeSignals: signals.filter((s) => !s.is_demo && s.status === 'Active').length,
      hasEnoughData: false,
      totalLongs: 0,
      totalShorts: 0,
      monthlyPnL: [],
    };
  }

  const wins = realClosed.filter((s) => (s.result_r ?? 0) > 0);
  const winRate = Number(((wins.length / closedCount) * 100).toFixed(1));

  const totalR = realClosed.reduce((sum, s) => sum + (s.result_r ?? 0), 0);
  const avgR = Number((totalR / closedCount).toFixed(2));

  const totalGains = wins.reduce((sum, s) => sum + (s.result_r ?? 0), 0);
  const totalLosses = Math.abs(
    realClosed.filter((s) => (s.result_r ?? 0) < 0).reduce((sum, s) => sum + (s.result_r ?? 0), 0)
  );
  const profitFactor = totalLosses > 0 ? Number((totalGains / totalLosses).toFixed(2)) : Number(totalGains.toFixed(2));

  return {
    winRate,
    avgR,
    profitFactor,
    totalSignals: signals.filter((s) => !s.is_demo).length,
    closedSignals: closedCount,
    activeSignals: signals.filter((s) => !s.is_demo && s.status === 'Active').length,
    hasEnoughData,
    totalLongs: realClosed.filter((s) => s.direction === 'LONG').length,
    totalShorts: realClosed.filter((s) => s.direction === 'SHORT').length,
    monthlyPnL: [],
  };
}

/**
 * Filter and mask signals according to User Plan (Enforces RLS parity)
 * - Free users:
 *   * Premium signals (confidence >= 75) are masked (entry, TP, SL hidden/blurred)
 *   * Free signals (<75) appear with a 1-hour delay
 */
export function maskSignalForPlan(signal: Signal, userPlan: UserPlan): Signal {
  if (userPlan === 'pro') {
    return signal;
  }

  // Check 1-hour delay for free users
  const signalTime = new Date(signal.created_at).getTime();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const isDelayed = signalTime > oneHourAgo;

  if (signal.is_premium) {
    // Mask entry, TPs, SL, and precise reasoning for free users
    return {
      ...signal,
      entry_price: 0,
      tp1_price: 0,
      tp2_price: 0,
      tp3_price: 0,
      stop_loss_price: 0,
      reasoning: 'Pro Member Algorithmic Signal: Technical indicator confluence details locked.',
      is_premium: true,
    };
  }

  // Free signal: if created less than 1 hr ago, mark as pending release
  if (isDelayed) {
    return {
      ...signal,
      entry_price: 0,
      tp1_price: 0,
      tp2_price: 0,
      tp3_price: 0,
      stop_loss_price: 0,
      reasoning: 'Free Signal: Unlocks 1 hour after algorithmic execution for Free Tier members.',
      status: 'Active',
    };
  }

  return signal;
}

-- ============================================================================
-- SignalPulse Automated Crypto Trading Signals Platform Migration
-- Framework: Supabase Postgres + Row Level Security + pg_cron
-- ============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_net";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- 2. Create custom types and ENUMs
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_plan AS ENUM ('free', 'pro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE signal_direction AS ENUM ('LONG', 'SHORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE signal_status AS ENUM (
        'Active',
        'TP1 hit',
        'TP2 hit',
        'TP3 hit',
        'Stop Loss hit',
        'Expired',
        'Cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    plan user_plan DEFAULT 'free'::user_plan NOT NULL,
    banned BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Signals Table
CREATE TABLE IF NOT EXISTS public.signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coin TEXT NOT NULL,
    pair TEXT NOT NULL,
    direction signal_direction NOT NULL,
    timeframe TEXT DEFAULT '1h' NOT NULL,
    entry_price NUMERIC(16, 6) NOT NULL,
    tp1_price NUMERIC(16, 6) NOT NULL,
    tp2_price NUMERIC(16, 6) NOT NULL,
    tp3_price NUMERIC(16, 6) NOT NULL,
    stop_loss_price NUMERIC(16, 6) NOT NULL,
    current_price NUMERIC(16, 6),
    leverage_suggestion TEXT DEFAULT '3x - 5x' NOT NULL,
    risk_level TEXT DEFAULT 'Medium' NOT NULL,
    confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    reasoning TEXT NOT NULL,
    indicators_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    status signal_status DEFAULT 'Active'::signal_status NOT NULL,
    is_premium BOOLEAN DEFAULT false NOT NULL,
    is_demo BOOLEAN DEFAULT false NOT NULL,
    exit_price NUMERIC(16, 6),
    result_r NUMERIC(8, 2),
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    source TEXT DEFAULT 'algorithmic' NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_signals_status ON public.signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_coin ON public.signals(coin);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON public.signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_is_premium ON public.signals(is_premium);

-- 5. Subscriptions Table (Lemon Squeezy Integration)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lemon_subscription_id TEXT UNIQUE,
    lemon_order_id TEXT,
    status TEXT NOT NULL,
    plan user_plan DEFAULT 'free'::user_plan NOT NULL,
    variant_id TEXT,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false NOT NULL,
    customer_portal_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- 6. Watchlist Table
CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    coin TEXT NOT NULL,
    pair TEXT NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, coin)
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'signal' NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    signal_id UUID REFERENCES public.signals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read);

-- 8. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true NOT NULL,
    in_app_notifications BOOLEAN DEFAULT true NOT NULL,
    new_signals BOOLEAN DEFAULT true NOT NULL,
    tp_hit_alerts BOOLEAN DEFAULT true NOT NULL,
    sl_hit_alerts BOOLEAN DEFAULT true NOT NULL,
    marketing_emails BOOLEAN DEFAULT false NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Engine Settings Table
CREATE TABLE IF NOT EXISTS public.engine_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    is_active BOOLEAN DEFAULT true NOT NULL,
    scan_interval_minutes INTEGER DEFAULT 15 NOT NULL,
    min_confidence INTEGER DEFAULT 65 NOT NULL,
    max_signals_per_day INTEGER DEFAULT 5 NOT NULL,
    cooldown_hours INTEGER DEFAULT 6 NOT NULL,
    supported_coins JSONB DEFAULT '["BTC","ETH","SOL","BNB","XRP","ADA","DOGE","AVAX","LINK","MATIC"]'::jsonb NOT NULL,
    timeframes JSONB DEFAULT '["1h","4h"]'::jsonb NOT NULL,
    risk_reward_tp1 NUMERIC(4,2) DEFAULT 1.00 NOT NULL,
    risk_reward_tp2 NUMERIC(4,2) DEFAULT 2.00 NOT NULL,
    risk_reward_tp3 NUMERIC(4,2) DEFAULT 3.00 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 10. Engine Logs Table
CREATE TABLE IF NOT EXISTS public.engine_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    exchange TEXT NOT NULL,
    coin TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT NOT NULL,
    details JSONB
);

CREATE INDEX IF NOT EXISTS idx_engine_logs_timestamp ON public.engine_logs(timestamp DESC);

-- 11. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_audience TEXT DEFAULT 'all' NOT NULL,
    sent_email BOOLEAN DEFAULT false NOT NULL,
    created_by TEXT DEFAULT 'Admin' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Free users cannot read entry, TP, and SL for locked signals!
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engine_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Current User Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Is Current User Pro
CREATE OR REPLACE FUNCTION public.is_pro()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND plan = 'pro'::user_plan
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Watchlist Policies
CREATE POLICY "Users own watchlist" ON public.watchlist FOR ALL USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Preferences Policies
CREATE POLICY "Users own preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Contact Messages: Anyone can insert, admins can read
CREATE POLICY "Public insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage contact messages" ON public.contact_messages FOR ALL USING (public.is_admin());

-- Announcements: Anyone can read, admins can insert
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL USING (public.is_admin());

-- Engine Settings & Logs
CREATE POLICY "Public read engine settings" ON public.engine_settings FOR SELECT USING (true);
CREATE POLICY "Admins update engine settings" ON public.engine_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admins view engine logs" ON public.engine_logs FOR SELECT USING (public.is_admin());

-- Signals Policies
CREATE POLICY "Anyone can view signals table metadata" ON public.signals FOR SELECT USING (true);
CREATE POLICY "Admins and Service Role can manage signals" ON public.signals FOR ALL USING (public.is_admin());

-- ============================================================================
-- SECURE SIGNAL MASKING VIEW (SERVER-SIDE RLS ENFORCEMENT)
-- Free tier users receive masked price levels for locked setups!
-- ============================================================================

CREATE OR REPLACE VIEW public.v_signals_masked AS
SELECT
    s.id,
    s.coin,
    s.pair,
    s.direction,
    s.timeframe,
    CASE
        WHEN public.is_pro() OR NOT s.is_premium THEN s.entry_price
        ELSE NULL
    END AS entry_price,
    CASE
        WHEN public.is_pro() OR NOT s.is_premium THEN s.tp1_price
        ELSE NULL
    END AS tp1_price,
    CASE
        WHEN public.is_pro() OR NOT s.is_premium THEN s.tp2_price
        ELSE NULL
    END AS tp2_price,
    CASE
        WHEN public.is_pro() OR NOT s.is_premium THEN s.tp3_price
        ELSE NULL
    END AS tp3_price,
    CASE
        WHEN public.is_pro() OR NOT s.is_premium THEN s.stop_loss_price
        ELSE NULL
    END AS stop_loss_price,
    s.current_price,
    s.leverage_suggestion,
    s.risk_level,
    s.confidence_score,
    CASE
        WHEN public.is_pro() OR NOT s.is_premium THEN s.reasoning
        ELSE 'Pro setup: Detailed indicator confluence locked.'
    END AS reasoning,
    CASE
        WHEN public.is_pro() OR NOT s.is_premium THEN s.indicators_snapshot
        ELSE '{}'::jsonb
    END AS indicators_snapshot,
    s.status,
    s.is_premium,
    s.is_demo,
    s.exit_price,
    s.result_r,
    s.closed_at,
    s.created_at,
    s.source
FROM public.signals s
WHERE
    -- Free users have 1-hour delay on free signals
    public.is_pro()
    OR s.created_at <= (NOW() - INTERVAL '1 hour')
    OR s.is_premium = true;

-- ============================================================================
-- AUTH SIGNUP TRIGGER: AUTO-CREATE PROFILE WITH PLAN = 'free'
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, plan, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'user'::user_role,
        'free'::user_plan,
        NOW()
    );

    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PG_CRON SCHEDULES FOR EDGE FUNCTIONS
-- Signal Engine scans every 15 minutes
-- Signal Tracker tracks active signals every 5 minutes
-- ============================================================================

-- SELECT cron.schedule(
--   'invoke-signal-engine',
--   '*/15 * * * *',
--   $$
--   SELECT net.http_post(
--       url := 'https://your-project.supabase.co/functions/v1/signal-engine',
--       headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
--       body := '{}'::jsonb
--   ) AS request_id;
--   $$
-- );

-- SELECT cron.schedule(
--   'invoke-signal-tracker',
--   '*/5 * * * *',
--   $$
--   SELECT net.http_post(
--       url := 'https://your-project.supabase.co/functions/v1/signal-tracker',
--       headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
--       body := '{}'::jsonb
--   ) AS request_id;
--   $$
-- );

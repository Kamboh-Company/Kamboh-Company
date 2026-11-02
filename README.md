# Kamboh Plus - Automated Crypto Trading Signals Platform

Kamboh Plus is a production-quality SaaS web application for automated cryptocurrency trading signals. It features multi-exchange algorithmic candle scanning (Binance with Bybit & OKX failover), technical indicator confluence (EMA20/50/200, RSI, MACD, Bollinger Bands, ATR, ADX), 1R–3R risk-adjusted take-profit ladders, Lemon Squeezy recurring subscriptions, Resend email dispatch, and TradingView Lightweight Charts.

---

## 1. Tech Stack Overview

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, React Router v7, Lucide Icons
- **Charting**: TradingView `lightweight-charts` (Candlesticks, Volume, Dynamic Take Profit & Stop Loss Lines)
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Auth, Edge Functions, pg_cron, pg_net)
- **Subscriptions & Billing**: Lemon Squeezy (Hosted Checkout, Webhooks with HMAC SHA-256 verification, Customer Billing Portal)
- **Email Delivery**: Resend API
- **Market Data Feeds**: Multi-Exchange REST API (Binance, Bybit, OKX), CoinGecko, Alternative.me (Fear & Greed Index)

---

## 2. Supabase Setup & Database Migration

### A. Run Database Migrations
1. Navigate to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor**.
3. Copy and run the contents of `/supabase/migrations/20250101000000_init_signalpulse.sql`.
   - Provisions `profiles`, `signals`, `subscriptions`, `watchlist`, `notifications`, `notification_preferences`, `engine_settings`, `engine_logs`, `contact_messages`, and `announcements`.
   - Enables Row Level Security (RLS) on all tables.
   - Deploys the secure view `v_signals_masked` which prevents Free tier users from reading entry price, TP1/2/3, and SL for locked setups.
   - Configures the `on_auth_user_created` trigger that automatically initializes new accounts with `plan = 'free'`.

### B. Seed Initial Demo Data
1. Open the Supabase **SQL Editor**.
2. Run `/supabase/seed.sql` to populate default engine thresholds and seed signals. All demo signals are marked with `is_demo = true` and are mathematically excluded from audited win-rate statistics.

### C. Enable Extensions & pg_cron
In Supabase:
1. Go to **Database** &rarr; **Extensions**.
2. Enable:
   - `pg_net` (for making asynchronous HTTP requests from database triggers and crons)
   - `pg_cron` (for scheduling background cron jobs)
3. In SQL Editor, activate the cron jobs:
   ```sql
   -- Schedule signal-engine every 15 minutes
   SELECT cron.schedule(
     'invoke-signal-engine',
     '*/15 * * * *',
     $$
     SELECT net.http_post(
         url := 'https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/signal-engine',
         headers := '{"Content-Type": "application/json", "Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb,
         body := '{}'::jsonb
     ) AS request_id;
     $$
   );

   -- Schedule signal-tracker every 5 minutes
   SELECT cron.schedule(
     'invoke-signal-tracker',
     '*/5 * * * *',
     $$
     SELECT net.http_post(
         url := 'https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/signal-tracker',
         headers := '{"Content-Type": "application/json", "Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb,
         body := '{}'::jsonb
     ) AS request_id;
     $$
   );
   ```

---

## 3. Deploying Supabase Edge Functions

Install the Supabase CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref <YOUR-PROJECT-REF>
```

### Deploy Functions
```bash
supabase functions deploy signal-engine
supabase functions deploy signal-tracker
supabase functions deploy lemonsqueezy-webhook
```

### Set Environment Secrets
```bash
supabase secrets set \
  SUPABASE_SERVICE_ROLE_KEY="<YOUR_SERVICE_ROLE_KEY>" \
  LEMONSQUEEZY_WEBHOOK_SECRET="<YOUR_WEBHOOK_SECRET>" \
  RESEND_API_KEY="re_123456789"
```

---

## 4. Lemon Squeezy Integration

1. Create a [Lemon Squeezy](https://www.lemonsqueezy.com) account and create a store (e.g. `signalpulse`).
2. Create a Product named **Kamboh Plus Pro**:
   - **Variant 1**: Monthly Plan at `$9.00/month` (recurring).
   - **Variant 2**: Yearly Plan at `$79.00/year` (recurring, ~27% discount).
3. Copy the Variant IDs and Store ID into your `.env`:
   ```env
   LEMONSQUEEZY_STORE_ID="your_store_id"
   LEMONSQUEEZY_MONTHLY_VARIANT_ID="variant_monthly_id"
   LEMONSQUEEZY_YEARLY_VARIANT_ID="variant_yearly_id"
   ```
4. Configure Webhook in Lemon Squeezy:
   - **URL**: `https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/lemonsqueezy-webhook`
   - **Signing Secret**: Generate a secret and assign it to `LEMONSQUEEZY_WEBHOOK_SECRET`.
   - **Events to Subscribe**:
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `subscription_resumed`
     - `subscription_expired`
     - `subscription_payment_success`
     - `subscription_payment_failed`

---

## 5. Resend Email Setup

1. Sign up at [Resend](https://resend.com) and create an API Key.
2. Verify your custom sending domain or use testing credentials.
3. Add your `RESEND_API_KEY` to `.env` and Supabase secrets:
   ```env
   RESEND_API_KEY="re_your_api_key"
   ```

---

## 6. How to Make a User an Admin

In Supabase SQL Editor:
```sql
UPDATE public.profiles
SET role = 'admin', plan = 'pro'
WHERE email = 'your-email@example.com';
```

*(Note: During development and preview testing, you can also use the interactive preview mode switcher in the top navigation bar to toggle between Free, Pro, and Admin roles instantly without touching the database.)*

---

## 7. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the full Kamboh Plus web platform.

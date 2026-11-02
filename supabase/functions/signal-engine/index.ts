/**
 * Supabase Edge Function: signal-engine
 * Scheduled via pg_cron every 15 minutes
 * Scans top liquid pairs across Binance, Bybit, and OKX
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Fetch candles with multi-exchange fallback
async function fetchOHLCV(coin: string, timeframe: "1h" | "4h" = "1h", limit = 200) {
  const symbol = `${coin}USDT`;
  const interval = timeframe;

  // 1. Binance
  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    if (res.ok) {
      const data = await res.json();
      const candles: Candle[] = data.map((d: any[]) => ({
        time: Math.floor(d[0] / 1000),
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5]),
      }));
      return { candles, exchange: "Binance" };
    }
  } catch (_e) {
    // fallback
  }

  // 2. Bybit
  try {
    const bybitInterval = timeframe === "1h" ? "60" : "240";
    const res = await fetch(
      `https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol}&interval=${bybitInterval}&limit=${limit}`
    );
    if (res.ok) {
      const json = await res.json();
      if (json.result?.list?.length > 0) {
        const candles: Candle[] = json.result.list
          .slice()
          .reverse()
          .map((d: any[]) => ({
            time: Math.floor(parseInt(d[0], 10) / 1000),
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
            volume: parseFloat(d[5]),
          }));
        return { candles, exchange: "Bybit" };
      }
    }
  } catch (_e) {
    // fallback
  }

  // 3. OKX
  try {
    const bar = timeframe === "1h" ? "1H" : "4H";
    const res = await fetch(
      `https://www.okx.com/api/v5/market/candles?instId=${coin}-USDT&bar=${bar}&limit=${limit}`
    );
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) {
        const candles: Candle[] = json.data
          .slice()
          .reverse()
          .map((d: any[]) => ({
            time: Math.floor(parseInt(d[0], 10) / 1000),
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
            volume: parseFloat(d[5]),
          }));
        return { candles, exchange: "OKX" };
      }
    }
  } catch (_e) {
    // fallback
  }

  throw new Error(`Failed to fetch candles across all exchanges for ${coin}`);
}

// EMA calculator
function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length < period) return [];
  const k = 2 / (period + 1);
  const ema: number[] = new Array(prices.length).fill(0);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += prices[i];
  ema[period - 1] = sum / period;
  for (let i = period; i < prices.length; i++) {
    ema[i] = prices[i] * k + ema[i - 1] * (1 - k);
  }
  return ema;
}

// RSI calculator
function calculateRSI(closes: number[], period = 14): number[] {
  if (closes.length <= period) return [];
  const rsi: number[] = new Array(closes.length).fill(50);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  rsi[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
    rsi[i] = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));
  }
  return rsi;
}

serve(async (_req) => {
  try {
    // Fetch settings
    const { data: settings } = await supabase
      .from("engine_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!settings || !settings.is_active) {
      return new Response(JSON.stringify({ message: "Engine paused by admin." }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const coins: string[] = settings.supported_coins || ["BTC", "ETH", "SOL"];
    const results = [];

    for (const coin of coins) {
      try {
        const { candles, exchange } = await fetchOHLCV(coin, "1h", 200);
        const closes = candles.map((c) => c.close);
        const n = closes.length - 1;
        const currentPrice = closes[n];

        const ema50 = calculateEMA(closes, 50);
        const ema200 = calculateEMA(closes, 200);
        const rsi = calculateRSI(closes, 14);

        const currentRSI = rsi[n];
        const isBullish = currentPrice > ema50[n] && currentPrice > ema200[n];
        const isBearish = currentPrice < ema50[n] && currentPrice < ema200[n];

        if (isBullish && currentRSI >= 45 && currentRSI <= 62) {
          // Check cooldown
          const { data: recent } = await supabase
            .from("signals")
            .select("id")
            .eq("coin", coin)
            .gte("created_at", new Date(Date.now() - settings.cooldown_hours * 3600000).toISOString());

          if (!recent || recent.length === 0) {
            const atr = currentPrice * 0.02;
            const entry = currentPrice;
            const sl = entry - atr * 1.5;
            const r = entry - sl;

            const newSignal = {
              coin,
              pair: `${coin}/USDT`,
              direction: "LONG",
              timeframe: "1h",
              entry_price: entry,
              tp1_price: entry + r * 1.0,
              tp2_price: entry + r * 2.0,
              tp3_price: entry + r * 3.0,
              stop_loss_price: sl,
              current_price: entry,
              leverage_suggestion: "3x - 5x",
              risk_level: "Medium",
              confidence_score: 82,
              reasoning: "Price above EMA50 & EMA200, healthy RSI momentum expansion.",
              status: "Active",
              is_premium: true,
              source: "algorithmic",
            };

            await supabase.from("signals").insert(newSignal);
            await supabase.from("engine_logs").insert({
              exchange,
              coin,
              timeframe: "1h",
              status: "success",
              message: `Generated LONG signal on ${coin}/USDT`,
            });
            results.push({ coin, status: "created", direction: "LONG" });
          }
        }
      } catch (err: any) {
        await supabase.from("engine_logs").insert({
          exchange: "Multi",
          coin,
          timeframe: "1h",
          status: "error",
          message: err.message,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

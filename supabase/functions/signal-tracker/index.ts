/**
 * Supabase Edge Function: signal-tracker
 * Scheduled via pg_cron every 5 minutes
 * Checks live market prices against active signals, updates TP/SL/expired status,
 * creates in-app notifications, and dispatches email alerts via Resend to Pro subscribers.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper to send email via Resend
async function sendResendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SignalPulse Alerts <alerts@signalpulse.app>",
        to,
        subject,
        html,
      }),
    });
  } catch (e) {
    console.warn("Resend email failed:", e);
  }
}

serve(async (_req) => {
  try {
    // 1. Fetch all active signals
    const { data: activeSignals, error } = await supabase
      .from("signals")
      .select("*")
      .eq("status", "Active");

    if (error || !activeSignals) {
      return new Response(JSON.stringify({ message: "No active signals." }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const updates = [];

    // 2. Fetch live prices from Binance
    for (const signal of activeSignals) {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${signal.coin}USDT`
        );
        if (!res.ok) continue;
        const json = await res.json();
        const currentPrice = parseFloat(json.price);

        const isLong = signal.direction === "LONG";
        let newStatus: string | null = null;
        let resultR: number | null = null;

        // Check Take Profit levels
        if (isLong) {
          if (currentPrice >= signal.tp3_price) {
            newStatus = "TP3 hit";
            resultR = 3.0;
          } else if (currentPrice >= signal.tp2_price) {
            newStatus = "TP2 hit";
            resultR = 2.0;
          } else if (currentPrice >= signal.tp1_price) {
            newStatus = "TP1 hit";
            resultR = 1.0;
          } else if (currentPrice <= signal.stop_loss_price) {
            newStatus = "Stop Loss hit";
            resultR = -1.0;
          }
        } else {
          // SHORT
          if (currentPrice <= signal.tp3_price) {
            newStatus = "TP3 hit";
            resultR = 3.0;
          } else if (currentPrice <= signal.tp2_price) {
            newStatus = "TP2 hit";
            resultR = 2.0;
          } else if (currentPrice <= signal.tp1_price) {
            newStatus = "TP1 hit";
            resultR = 1.0;
          } else if (currentPrice >= signal.stop_loss_price) {
            newStatus = "Stop Loss hit";
            resultR = -1.0;
          }
        }

        // Check 72-hour expiry
        const signalAgeHours =
          (Date.now() - new Date(signal.created_at).getTime()) / (1000 * 60 * 60);
        if (!newStatus && signalAgeHours >= 72) {
          newStatus = "Expired";
          resultR = 0;
        }

        if (newStatus) {
          // Update signal row
          await supabase
            .from("signals")
            .update({
              status: newStatus,
              exit_price: currentPrice,
              result_r: resultR,
              closed_at: new Date().toISOString(),
              current_price: currentPrice,
            })
            .eq("id", signal.id);

          // Notify Pro subscribers
          const { data: proProfiles } = await supabase
            .from("profiles")
            .select("id, email")
            .eq("plan", "pro");

          if (proProfiles) {
            for (const p of proProfiles) {
              // In-app notification
              await supabase.from("notifications").insert({
                user_id: p.id,
                title: `Target Update: ${signal.pair} ${newStatus}`,
                message: `${signal.pair} hit ${newStatus} at $${currentPrice.toFixed(2)} (${resultR! > 0 ? "+" : ""}${resultR}R).`,
                type: "signal",
                signal_id: signal.id,
              });

              // Resend email
              await sendResendEmail(
                p.email,
                `[SignalPulse] ${signal.pair} - ${newStatus}`,
                `<h2>Trade Update: ${signal.pair}</h2>
                 <p>Your active algorithmic signal has triggered an execution target:</p>
                 <ul>
                   <li><strong>Outcome:</strong> ${newStatus}</li>
                   <li><strong>Exit Price:</strong> $${currentPrice}</li>
                   <li><strong>Normalized Return:</strong> ${resultR! > 0 ? "+" : ""}${resultR}R</li>
                 </ul>
                 <p><a href="https://signalpulse.app/dashboard/signals/${signal.id}">View full trade performance detail &rarr;</a></p>`
              );
            }
          }

          updates.push({ id: signal.id, newStatus, currentPrice });
        } else {
          // Update current price
          await supabase
            .from("signals")
            .update({ current_price: currentPrice })
            .eq("id", signal.id);
        }
      } catch (err: any) {
        console.warn(`Error tracking signal ${signal.id}:`, err);
      }
    }

    return new Response(JSON.stringify({ success: true, processed: updates }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

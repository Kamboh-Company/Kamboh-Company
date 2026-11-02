/**
 * Supabase Edge Function: lemonsqueezy-webhook
 * Verifies HMAC SHA-256 on raw body with LEMONSQUEEZY_WEBHOOK_SECRET
 * Synchronizes subscription entitlements to Postgres profiles & subscriptions tables
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const LEMONSQUEEZY_WEBHOOK_SECRET = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// HMAC SHA-256 Signature Verification
async function verifySignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const hexBytes = new Uint8Array(
    signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  return await crypto.subtle.verify(
    "HMAC",
    key,
    hexBytes,
    encoder.encode(rawBody)
  );
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    // Verify HMAC SHA-256
    if (LEMONSQUEEZY_WEBHOOK_SECRET) {
      const isValid = await verifySignature(rawBody, signature, LEMONSQUEEZY_WEBHOOK_SECRET);
      if (!isValid) {
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || {};
    const userId = customData.user_id;
    const attributes = payload.data?.attributes || {};
    const subscriptionId = String(payload.data?.id || "");
    const status = attributes.status; // 'active', 'cancelled', 'expired', etc.
    const userEmail = attributes.user_email;

    if (!userId && !userEmail) {
      return new Response("No user identifier found in custom_data or attributes", { status: 400 });
    }

    // Determine target profile
    let profileId = userId;
    if (!profileId && userEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", userEmail)
        .single();
      if (profile) profileId = profile.id;
    }

    if (!profileId) {
      return new Response("User not found in database", { status: 404 });
    }

    // Map subscription status to SignalPulse plan ('pro' or 'free')
    const isActivePro =
      eventName === "subscription_created" ||
      eventName === "subscription_resumed" ||
      eventName === "subscription_payment_success" ||
      status === "active" ||
      status === "on_trial";

    const isTerminated =
      eventName === "subscription_expired" ||
      status === "expired" ||
      status === "unpaid";

    const planToSet = isActivePro && !isTerminated ? "pro" : "free";

    // 1. Update Profiles table
    await supabase
      .from("profiles")
      .update({
        plan: planToSet,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    // 2. Upsert Subscriptions table
    await supabase.from("subscriptions").upsert(
      {
        user_id: profileId,
        lemon_subscription_id: subscriptionId,
        lemon_order_id: String(attributes.order_id || ""),
        status: status || (isActivePro ? "active" : "cancelled"),
        plan: planToSet,
        variant_id: String(attributes.variant_id || ""),
        current_period_end: attributes.renews_at || attributes.ends_at,
        customer_portal_url: attributes.urls?.customer_portal,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "lemon_subscription_id" }
    );

    // 3. Insert notification
    await supabase.from("notifications").insert({
      user_id: profileId,
      title: planToSet === "pro" ? "Pro Subscription Activated!" : "Subscription Updated",
      message:
        planToSet === "pro"
          ? "You now have full access to real-time institutional signals, take profit ladders, and CSV exports."
          : "Your account subscription status has been updated.",
      type: "billing",
    });

    return new Response(JSON.stringify({ success: true, event: eventName, plan: planToSet }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

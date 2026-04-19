// Supabase Edge Function: check-inactive-users
// Runs daily via pg_cron. Finds users inactive for 3/7/14 days
// and sends events to Loops to trigger re-engagement emails.
//
// Deploy: supabase functions deploy check-inactive-users
// Scheduler must inject SUPABASE_SERVICE_ROLE_KEY, not anon — this
// function reads every user, which RLS blocks for the anon role.
// Cron setup (in Supabase SQL editor):
//   select cron.schedule(
//     'check-inactive-users',
//     '0 9 * * *',  -- daily at 9am UTC
//     $$ select net.http_post(
//       url := '<SUPABASE_URL>/functions/v1/check-inactive-users',
//       headers := '{"Authorization": "Bearer <SUPABASE_SERVICE_ROLE_KEY>"}'::jsonb
//     ) $$
//   );

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOOPS_API_KEY = Deno.env.get("LOOPS_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Hash an email for log correlation without leaking PII.
async function redactEmail(email: string | null | undefined): Promise<string> {
  if (!email) return "user_***";
  const buf = new TextEncoder().encode(email);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `user_${hex.slice(0, 8)}`;
}

async function sendLoopsEvent(
  email: string,
  eventName: string,
  eventProperties: Record<string, unknown> = {}
) {
  const redacted = await redactEmail(email);
  if (!LOOPS_API_KEY) {
    console.log(`[Loops] No API key — skipping ${eventName} for ${redacted}`);
    return;
  }

  // Fetch never logs headers unless we explicitly stringify the request.
  // Keep the error path free of `res.request` / `Authorization` to avoid
  // accidental key exposure if the Loops endpoint ever 4xx/5xx's.
  let status = 0;
  let bodyText = "";
  try {
    const res = await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, eventName, eventProperties }),
    });
    status = res.status;
    if (!res.ok) bodyText = await res.text();
  } catch (err) {
    console.error(`[Loops] Event ${eventName} network error for ${redacted}:`, err);
    return;
  }

  if (status < 200 || status >= 300) {
    console.error(
      `[Loops] Event ${eventName} failed for ${redacted}:`,
      status,
      bodyText,
    );
  }
}

Deno.serve(async (_req) => {
  try {
    const now = new Date();
    let processed = 0;

    // 3-day inactive users (first warning)
    const { data: inactive3, error: err3 } = await supabase
      .from("users")
      .select("email, last_active")
      .lt("last_active", new Date(now.getTime() - 3 * 86400000).toISOString())
      .gte(
        "last_active",
        new Date(now.getTime() - 4 * 86400000).toISOString()
      )
      .eq("inactive_email_sent", false)
      .not("email", "is", null);

    if (err3) console.error("[Inactive 3d] Query error:", err3.message);

    for (const user of inactive3 ?? []) {
      await sendLoopsEvent(user.email, "user_inactive", {
        days_inactive: 3,
      });
      await supabase
        .from("users")
        .update({ inactive_email_sent: true })
        .eq("email", user.email);
      processed++;
    }

    // 7-day inactive users
    const { data: inactive7, error: err7 } = await supabase
      .from("users")
      .select("email, last_active")
      .lt("last_active", new Date(now.getTime() - 7 * 86400000).toISOString())
      .gte(
        "last_active",
        new Date(now.getTime() - 8 * 86400000).toISOString()
      )
      .not("email", "is", null);

    if (err7) console.error("[Inactive 7d] Query error:", err7.message);

    for (const user of inactive7 ?? []) {
      await sendLoopsEvent(user.email, "user_inactive", {
        days_inactive: 7,
      });
      processed++;
    }

    // 14-day inactive users (last chance)
    const { data: inactive14, error: err14 } = await supabase
      .from("users")
      .select("email, last_active")
      .lt("last_active", new Date(now.getTime() - 14 * 86400000).toISOString())
      .gte(
        "last_active",
        new Date(now.getTime() - 15 * 86400000).toISOString()
      )
      .not("email", "is", null);

    if (err14) console.error("[Inactive 14d] Query error:", err14.message);

    for (const user of inactive14 ?? []) {
      await sendLoopsEvent(user.email, "user_inactive", {
        days_inactive: 14,
      });
      processed++;
    }

    console.log(`[check-inactive-users] Processed ${processed} users`);
    return new Response(JSON.stringify({ success: true, processed }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[check-inactive-users] Error:", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

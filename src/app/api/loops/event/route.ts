import { NextRequest, NextResponse } from "next/server";
import { upsertContact, sendEvent, sendTransactional } from "@/lib/loops";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, withApi } from "@/lib/apiHandler";

const ALLOWED_EVENTS = [
  "app_open",
  "goal_achieved",
  "streak_milestone",
  "onboarding_completed",
] as const;

type AllowedEvent = (typeof ALLOWED_EVENTS)[number];

// Transactional email IDs for streak milestones (set these in Loops dashboard)
const STREAK_TRANSACTIONAL_IDS: Record<number, string> = {
  7: "streak_7_days",
  14: "streak_14_days",
  30: "streak_30_days",
  60: "streak_60_days",
  90: "streak_90_days",
};

export const POST = withApi(async (req: NextRequest) => {
  const { email, event, properties } = (await req.json().catch(() => ({}))) as {
    email?: unknown;
    event?: unknown;
    properties?: Record<string, unknown>;
  };

  if (typeof email !== "string" || typeof event !== "string") {
    throw new ApiError(400, "invalid_input", "Missing email or event");
  }
  if (!ALLOWED_EVENTS.includes(event as AllowedEvent)) {
    throw new ApiError(400, "unknown_event");
  }

  switch (event as AllowedEvent) {
    case "app_open": {
      await upsertContact({
        email,
        properties: { last_active: new Date().toISOString().split("T")[0] },
      });
      await supabase
        .from("users")
        .update({
          last_active: new Date().toISOString(),
          inactive_email_sent: false,
        })
        .eq("email", email);
      break;
    }
    case "goal_achieved": {
      const { total_steps, streak_count } = properties ?? {};
      await upsertContact({
        email,
        properties: {
          total_steps: total_steps ?? 0,
          streak_count: streak_count ?? 0,
          last_goal_date: new Date().toISOString().split("T")[0],
        },
      });
      await sendEvent({
        email,
        eventName: "goal_achieved",
        eventProperties: properties ?? {},
      });
      break;
    }
    case "streak_milestone": {
      const milestone = properties?.milestone as number;
      await sendEvent({
        email,
        eventName: "streak_milestone",
        eventProperties: { milestone },
      });
      const txId = STREAK_TRANSACTIONAL_IDS[milestone];
      if (txId) {
        await sendTransactional({
          transactionalId: txId,
          email,
          dataVariables: { streak_days: String(milestone) },
        });
      }
      break;
    }
    case "onboarding_completed": {
      await upsertContact({
        email,
        properties: {
          onboarding_completed: true,
          step_goal: properties?.step_goal ?? 3000,
          screen_time_target: properties?.screen_time_target ?? 2,
          age_range: properties?.age_range ?? "",
          selected_mode: properties?.selected_mode ?? "walk",
        },
      });
      await sendEvent({
        email,
        eventName: "onboarding_completed",
        eventProperties: properties ?? {},
      });
      break;
    }
  }

  return NextResponse.json({ success: true });
});

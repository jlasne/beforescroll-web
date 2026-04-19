import { NextRequest, NextResponse } from "next/server";
import { upsertContact, sendEvent } from "@/lib/loops";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, withApi } from "@/lib/apiHandler";

const REVENUECAT_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET;

export const POST = withApi(async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (
    REVENUECAT_WEBHOOK_SECRET &&
    authHeader !== `Bearer ${REVENUECAT_WEBHOOK_SECRET}`
  ) {
    throw new ApiError(401, "unauthorized");
  }

  const body = await req.json().catch(() => null);
  const eventType = (body as { event?: { type?: string } } | null)?.event?.type;
  const appUserId = (body as { event?: { app_user_id?: string } } | null)?.event
    ?.app_user_id;
  const email =
    ((body as { event?: { subscriber_attributes?: { $email?: { value?: string } } } } | null)
      ?.event?.subscriber_attributes?.$email?.value) ?? appUserId;

  if (!eventType || !email) {
    throw new ApiError(400, "invalid_input", "Missing event type or email");
  }

  console.log(`[RevenueCat] Event: ${eventType} for ${email}`);

  switch (eventType) {
    case "INITIAL_PURCHASE":
    case "RENEWAL": {
      await upsertContact({
        email,
        properties: { subscription_status: "active" },
      });
      await supabase
        .from("users")
        .update({ subscription_status: "active" })
        .eq("email", email);
      break;
    }
    case "CANCELLATION": {
      await upsertContact({
        email,
        properties: { subscription_status: "cancelled" },
      });
      await sendEvent({ email, eventName: "subscription_cancelled" });
      await supabase
        .from("users")
        .update({ subscription_status: "cancelled" })
        .eq("email", email);
      break;
    }
    case "EXPIRATION": {
      await upsertContact({
        email,
        properties: { subscription_status: "expired" },
      });
      await sendEvent({ email, eventName: "trial_expired" });
      await supabase
        .from("users")
        .update({ subscription_status: "expired" })
        .eq("email", email);
      break;
    }
    case "BILLING_ISSUE": {
      await upsertContact({
        email,
        properties: { subscription_status: "billing_issue" },
      });
      await sendEvent({ email, eventName: "billing_issue" });
      break;
    }
    default:
      console.log(`[RevenueCat] Unhandled event: ${eventType}`);
  }

  return NextResponse.json({ success: true });
});

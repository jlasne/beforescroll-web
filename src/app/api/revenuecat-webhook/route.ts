import { NextRequest, NextResponse } from "next/server";
import { upsertContact, sendEvent } from "@/lib/loops";
import { supabaseAdmin as supabase } from "@/lib/supabase";

const REVENUECAT_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Verify webhook auth
    const authHeader = req.headers.get("authorization");
    if (
      REVENUECAT_WEBHOOK_SECRET &&
      authHeader !== `Bearer ${REVENUECAT_WEBHOOK_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const eventType = body?.event?.type as string | undefined;
    const appUserId = body?.event?.app_user_id as string | undefined;
    const email =
      (body?.event?.subscriber_attributes?.["$email"]?.value as
        | string
        | undefined) ?? appUserId;

    if (!eventType || !email) {
      return NextResponse.json(
        { error: "Missing event type or email" },
        { status: 400 }
      );
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
        await sendEvent({
          email,
          eventName: "subscription_cancelled",
        });
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
        await sendEvent({
          email,
          eventName: "trial_expired",
        });
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
        await sendEvent({
          email,
          eventName: "billing_issue",
        });
        break;
      }

      default:
        console.log(`[RevenueCat] Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[revenuecat-webhook] Error:", e);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

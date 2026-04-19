import { NextRequest, NextResponse } from "next/server";
import { upsertContact, sendEvent } from "@/lib/loops";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, name, platform } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Upsert contact in Loops with signup properties
    await upsertContact({
      email,
      firstName: name?.split(" ")[0],
      properties: {
        name: name ?? "",
        platform: platform ?? "android",
        signup_date: new Date().toISOString().split("T")[0],
        subscription_status: "trial",
      },
    });

    // Fire signup event → triggers onboarding drip sequence
    await sendEvent({
      email,
      eventName: "user_signup",
      eventProperties: {
        platform: platform ?? "android",
        name: name ?? "",
      },
    });

    // Update last_active in Supabase
    await supabase
      .from("users")
      .update({ last_active: new Date().toISOString() })
      .eq("email", email);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[loops/signup] Error:", e);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { upsertContact, sendEvent } from "@/lib/loops";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, withApi } from "@/lib/apiHandler";

export const POST = withApi(async (req: NextRequest) => {
  const { email, name, platform } = (await req.json().catch(() => ({}))) as {
    email?: unknown;
    name?: unknown;
    platform?: unknown;
  };

  if (typeof email !== "string") throw new ApiError(400, "missing_email");

  const nameStr = typeof name === "string" ? name : "";
  const platformStr = typeof platform === "string" ? platform : "android";

  await upsertContact({
    email,
    firstName: nameStr.split(" ")[0] || undefined,
    properties: {
      name: nameStr,
      platform: platformStr,
      signup_date: new Date().toISOString().split("T")[0],
      subscription_status: "trial",
    },
  });

  await sendEvent({
    email,
    eventName: "user_signup",
    eventProperties: { platform: platformStr, name: nameStr },
  });

  await supabase
    .from("users")
    .update({ last_active: new Date().toISOString() })
    .eq("email", email);

  return NextResponse.json({ success: true });
});

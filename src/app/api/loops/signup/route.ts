import { NextRequest, NextResponse } from "next/server";
import { upsertContact, sendEvent } from "@/lib/loops";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { parseJson, withApi, z } from "@/lib/apiHandler";
import { checkRateLimit, getClientIp, ratelimitFor } from "@/lib/ratelimit";

const SignupSchema = z.object({
  email: z.email().max(160),
  name: z.string().max(120).optional(),
  platform: z.string().max(40).optional(),
});

const rl = ratelimitFor("loops:signup", {
  requests: 20,
  windowSeconds: 3600,
});

export const POST = withApi(async (req: NextRequest) => {
  const rlRes = await checkRateLimit(rl, getClientIp(req));
  if (rlRes) return rlRes;

  const { email, name, platform } = await parseJson(req, SignupSchema);

  const nameStr = name ?? "";
  const platformStr = platform ?? "android";

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

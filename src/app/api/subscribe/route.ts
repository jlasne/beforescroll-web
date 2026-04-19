import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, parseJson, withApi, z } from "@/lib/apiHandler";
import { checkRateLimit, getClientIp, ratelimitFor } from "@/lib/ratelimit";

const SubscribeSchema = z.object({
  email: z.email().max(160),
  platform: z.string().min(1).max(40),
});

const rl = ratelimitFor("subscribe", { requests: 10, windowSeconds: 3600 });

export const POST = withApi(async (req: NextRequest) => {
  const rlRes = await checkRateLimit(rl, getClientIp(req));
  if (rlRes) return rlRes;

  const { email, platform } = await parseJson(req, SubscribeSchema);

  const { error } = await supabase.from("waitlist").insert({ email, platform });
  if (error && error.code !== "23505") {
    throw new ApiError(500, "subscribe_failed", error.message);
  }
  return NextResponse.json({ success: true });
});

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, parseJson, withApi, z } from "@/lib/apiHandler";

const SubscribeSchema = z.object({
  email: z.email().max(160),
  platform: z.string().min(1).max(40),
});

export const POST = withApi(async (req: NextRequest) => {
  const { email, platform } = await parseJson(req, SubscribeSchema);

  const { error } = await supabase.from("waitlist").insert({ email, platform });
  if (error && error.code !== "23505") {
    throw new ApiError(500, "subscribe_failed", error.message);
  }
  return NextResponse.json({ success: true });
});

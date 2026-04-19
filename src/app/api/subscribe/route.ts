import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, withApi } from "@/lib/apiHandler";

export const POST = withApi(async (req: NextRequest) => {
  const { email, platform } = (await req.json().catch(() => ({}))) as {
    email?: unknown;
    platform?: unknown;
  };

  if (typeof email !== "string" || typeof platform !== "string") {
    throw new ApiError(400, "invalid_input", "Missing fields");
  }

  const { error } = await supabase.from("waitlist").insert({ email, platform });
  if (error && error.code !== "23505") {
    throw new ApiError(500, "subscribe_failed", error.message);
  }
  return NextResponse.json({ success: true });
});

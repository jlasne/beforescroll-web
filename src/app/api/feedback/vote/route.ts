import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, withApi } from "@/lib/apiHandler";

export const POST = withApi(async (req: NextRequest) => {
  const { request_id, voter_fingerprint } = (await req.json().catch(() => ({}))) as {
    request_id?: unknown;
    voter_fingerprint?: unknown;
  };

  if (typeof request_id !== "string" || typeof voter_fingerprint !== "string") {
    throw new ApiError(400, "invalid_input", "Missing fields");
  }

  const { error } = await supabase
    .from("feedback_votes")
    .insert({ request_id, voter_fingerprint });

  if (error) {
    if (error.code === "23505") throw new ApiError(409, "already_voted");
    throw new ApiError(500, "vote_failed", error.message);
  }
  return NextResponse.json({ success: true });
});

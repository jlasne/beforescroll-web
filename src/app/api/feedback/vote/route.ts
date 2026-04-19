import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, parseJson, withApi, z } from "@/lib/apiHandler";

const VoteSchema = z.object({
  request_id: z.uuid(),
  voter_fingerprint: z.string().min(8).max(128),
});

export const POST = withApi(async (req: NextRequest) => {
  const { request_id, voter_fingerprint } = await parseJson(req, VoteSchema);

  const { error } = await supabase
    .from("feedback_votes")
    .insert({ request_id, voter_fingerprint });

  if (error) {
    if (error.code === "23505") throw new ApiError(409, "already_voted");
    throw new ApiError(500, "vote_failed", error.message);
  }
  return NextResponse.json({ success: true });
});

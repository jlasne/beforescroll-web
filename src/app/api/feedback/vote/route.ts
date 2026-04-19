import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { request_id, voter_fingerprint } = await req.json();

  if (!request_id || !voter_fingerprint) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase
    .from("feedback_votes")
    .insert({ request_id, voter_fingerprint });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

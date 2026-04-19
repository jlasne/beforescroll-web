import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, platform } = await req.json();

  if (!email || !platform) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase.from("waitlist").insert({ email, platform });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

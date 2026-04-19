import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "feature";
  const sort = searchParams.get("sort") || "votes";
  const status = searchParams.get("status");

  let query = supabase
    .from("feedback_requests")
    .select("*")
    .eq("type", type);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (sort === "votes") {
    query = query.order("upvote_count", { ascending: false }).order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, type, author_name, author_email } = body;

  if (!title || title.length < 5) {
    return NextResponse.json({ error: "Title must be at least 5 characters" }, { status: 400 });
  }

  if (!type || !["feature", "bug"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("feedback_requests")
    .insert({
      title,
      description: description || null,
      type,
      author_name: author_name || null,
      author_email: author_email || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }

  return NextResponse.json(data);
}

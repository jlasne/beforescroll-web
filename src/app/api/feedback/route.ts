import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, withApi } from "@/lib/apiHandler";

export const GET = withApi(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "feature";
  const sort = searchParams.get("sort") || "votes";
  const status = searchParams.get("status");

  let query = supabase.from("feedback_requests").select("*").eq("type", type);
  if (status && status !== "all") query = query.eq("status", status);
  if (sort === "votes") {
    query = query
      .order("upvote_count", { ascending: false })
      .order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new ApiError(500, "fetch_failed", error.message);
  return NextResponse.json(data);
});

export const POST = withApi(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    throw new ApiError(400, "invalid_input", "Body must be JSON");
  }
  const { title, description, type, author_name, author_email } = body as Record<
    string,
    unknown
  >;

  if (typeof title !== "string" || title.length < 5) {
    throw new ApiError(400, "invalid_title", "Title must be at least 5 characters");
  }
  if (typeof type !== "string" || !["feature", "bug"].includes(type)) {
    throw new ApiError(400, "invalid_type");
  }

  const { data, error } = await supabase
    .from("feedback_requests")
    .insert({
      title,
      description: typeof description === "string" ? description : null,
      type,
      author_name: typeof author_name === "string" ? author_name : null,
      author_email: typeof author_email === "string" ? author_email : null,
    })
    .select()
    .single();

  if (error) throw new ApiError(500, "submit_failed", error.message);
  return NextResponse.json(data);
});

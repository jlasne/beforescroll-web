import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ApiError, parseJson, withApi, z } from "@/lib/apiHandler";
import { checkRateLimit, getClientIp, ratelimitFor } from "@/lib/ratelimit";

const FeedbackSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(["feature", "bug"]),
  author_name: z.string().min(1).max(80).optional(),
  author_email: z.email().max(160).optional(),
});

const rlPost = ratelimitFor("feedback:post", {
  requests: 10,
  windowSeconds: 3600,
});

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
  const rlRes = await checkRateLimit(rlPost, getClientIp(req));
  if (rlRes) return rlRes;

  const input = await parseJson(req, FeedbackSchema);

  const { data, error } = await supabase
    .from("feedback_requests")
    .insert({
      title: input.title,
      description: input.description ?? null,
      type: input.type,
      author_name: input.author_name ?? null,
      author_email: input.author_email ?? null,
    })
    .select()
    .single();

  if (error) throw new ApiError(500, "submit_failed", error.message);
  return NextResponse.json(data);
});

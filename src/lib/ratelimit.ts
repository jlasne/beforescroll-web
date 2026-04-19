import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

if (!redis) {
  console.warn(
    "[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting disabled",
  );
}

export function ratelimitFor(
  scope: string,
  opts: { requests: number; windowSeconds: number },
): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(opts.requests, `${opts.windowSeconds} s`),
    prefix: `bs:rl:${scope}`,
    analytics: false,
  });
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || "unknown";
}

export async function checkRateLimit(
  ratelimit: Ratelimit | null,
  identifier: string,
): Promise<NextResponse | null> {
  if (!ratelimit) return null;
  const { success, reset } = await ratelimit.limit(identifier);
  if (success) return null;
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "rate_limited", retry_after: retryAfter },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    },
  );
}

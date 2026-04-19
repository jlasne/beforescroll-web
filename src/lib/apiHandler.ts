import { NextRequest, NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message?: string,
    public details?: unknown,
  ) {
    super(message ?? code);
    this.name = "ApiError";
  }
}

type Handler<Ctx = unknown> = (
  req: NextRequest,
  ctx: Ctx,
) => Promise<NextResponse> | NextResponse;

export function withApi<Ctx = unknown>(handler: Handler<Ctx>): Handler<Ctx> {
  return async (req, ctx) => {
    const tag = safePath(req);
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status >= 500) {
          console.error(`[api:${tag}]`, err.code, err.message);
        }
        const body: Record<string, unknown> = { error: err.code };
        if (err.details !== undefined) body.issues = err.details;
        return NextResponse.json(body, { status: err.status });
      }
      console.error(`[api:${tag}]`, err);
      return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
  };
}

function safePath(req: NextRequest): string {
  try {
    return new URL(req.url).pathname;
  } catch {
    return "unknown";
  }
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/**
 * Lazy proxy: avoids touching env vars at module load. Next.js's
 * "Collecting page data" pass evaluates every route file, so throwing
 * eagerly here would break builds in any environment where the keys
 * aren't configured (e.g. Preview deploys without the secrets).
 *
 * The client is built on first property access and reused after.
 */
function lazyClient(buildClient: () => SupabaseClient): SupabaseClient {
  let instance: SupabaseClient | null = null;
  const get = () => (instance ??= buildClient());
  return new Proxy({} as SupabaseClient, {
    get(_t, prop) {
      const client = get() as unknown as Record<string | symbol, unknown>;
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  });
}

export const supabaseAdmin = lazyClient(() =>
  createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  ),
);

export const supabaseAnon = lazyClient(() =>
  createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false } },
  ),
);

import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (uses the public anon key).
 * Returns null when Supabase is not configured yet, so the admin panel can
 * show a friendly "not connected" message instead of crashing.
 */
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

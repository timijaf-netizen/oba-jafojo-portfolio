import { createClient } from "@supabase/supabase-js";
import { defaultContent, mergeContent } from "./defaultContent";

/**
 * Server-side content fetch used by the public homepage.
 *
 * Graceful fallback by design:
 *   - No Supabase env vars  -> returns built-in placeholder content.
 *   - Supabase configured but empty / errors -> returns placeholder content.
 *   - Supabase has a saved row -> merges it over the defaults.
 *
 * This is what lets the site go live before anything is set up.
 */
export async function getContent() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return defaultContent;

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data?.data) return defaultContent;
    return mergeContent(data.data);
  } catch {
    return defaultContent;
  }
}

import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://aqllpyipitdeuffmozlk.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_mQQKqIIX_laUN2TgDiiVtw_NZCiwvEl";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY
  );
}
import { createBrowserClient } from "@supabase/ssr";
import {
  assertSupabaseConfig,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase";

export function createSupabaseBrowserClient() {
  assertSupabaseConfig();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

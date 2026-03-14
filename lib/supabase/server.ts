import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  assertSupabaseConfig,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase";

export async function createSupabaseServerClient() {
  assertSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          return;
        }
      },
    },
  });
}

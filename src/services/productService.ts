import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

function getSupabaseAdminClientSafe() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

export async function getProducts() {
  try {
    const supabase =
      getSupabaseAdminClientSafe() ?? (await createSupabaseServerClient());

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[supabase] products select failed:", error);

      return {
        data: [] as Product[],
        error: null, // prevent dashboard error state
      };
    }

    return {
      data: (data ?? []) as Product[],
      error: null,
    };
  } catch (err) {
    console.error("[supabase] products fetch exception:", err);

    return {
      data: [] as Product[],
      error: null, // prevent dashboard error state
    };
  }
}
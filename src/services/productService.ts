import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

export async function getProducts() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[supabase] products select failed", error);
      return { data: [] as Product[], error: error.message };
    }

    return { data: (data ?? []) as Product[], error: null };
  } catch (error) {
    console.error("[supabase] products select exception", error);
    return {
      data: [] as Product[],
      error: error instanceof Error ? error.message : "Unable to load products.",
    };
  }
}

import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Customer } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

export async function getCustomers() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[supabase] customers select failed", error);
      return { data: [] as Customer[], error: error.message };
    }

    return { data: (data ?? []) as Customer[], error: null };
  } catch (error) {
    console.error("[supabase] customers select exception", error);
    return {
      data: [] as Customer[],
      error: error instanceof Error ? error.message : "Unable to load customers.",
    };
  }
}

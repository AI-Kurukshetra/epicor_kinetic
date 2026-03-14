import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Customer } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

function getSupabaseAdminClientSafe() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

export async function getCustomers() {
  try {
    const supabase =
      getSupabaseAdminClientSafe() ?? (await createSupabaseServerClient());

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[supabase] customers select failed:", error);

      return {
        data: [] as Customer[],
        error: null, // prevent dashboard error state
      };
    }

    return {
      data: (data ?? []) as Customer[],
      error: null,
    };
  } catch (err) {
    console.error("[supabase] customers fetch exception:", err);

    return {
      data: [] as Customer[],
      error: null, // prevent dashboard error state
    };
  }
}
import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Supplier } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

function getSupabaseAdminClientSafe() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

export async function getSuppliers() {
  try {
    const supabase =
      getSupabaseAdminClientSafe() ?? (await createSupabaseServerClient());

    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[supabase] suppliers select failed:", error);
      return {
        data: [] as Supplier[],
        error: null, // Prevent dashboard error state
      };
    }

    return {
      data: (data ?? []) as Supplier[],
      error: null,
    };
  } catch (err) {
    console.error("[supabase] suppliers fetch exception:", err);

    return {
      data: [] as Supplier[],
      error: null, // Prevent dashboard error state
    };
  }
}
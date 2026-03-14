import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Supplier } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

function getSupabaseAdminClient() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

export async function getSuppliers() {
  try {
    const supabase =
      getSupabaseAdminClient() ?? (await createSupabaseServerClient());
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "[supabase] suppliers select failed:",
        error?.message,
        error,
      );
      return { data: (data ?? []) as Supplier[], error: error?.message ?? null };
    }

    return { data: (data ?? []) as Supplier[], error: null };
  } catch (error) {
    console.error("[supabase] suppliers select failed:", error?.message, error);
    return {
      data: [] as Supplier[],
      error: error instanceof Error ? error.message : "Unable to load suppliers.",
    };
  }
}

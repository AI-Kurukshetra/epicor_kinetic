import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

function getSupabaseAdminClient() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

export async function getPurchaseOrders() {
  try {
    const supabase =
      getSupabaseAdminClient() ?? (await createSupabaseServerClient());
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "[supabase] purchase_orders select failed:",
        error?.message,
        error,
      );
      return { data: data ?? [], error: error?.message ?? null };
    }

    return { data: data ?? [], error: null };
  } catch (error) {
    console.error("[supabase] purchase_orders select exception:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load purchase orders.",
    };
  }
}

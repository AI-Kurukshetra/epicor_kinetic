import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WorkOrder } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

export async function getWorkOrders() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("work_orders")
      .select(
        "id, created_at, updated_at, company_id, product_id, quantity, status, schedule_date, machine, owner, products(name)",
      )
      .eq("company_id", DEMO_COMPANY_ID)
      .order("schedule_date", { ascending: true });

    if (error) {
      console.error("[supabase] work_orders select failed", error);
      return { data: [] as WorkOrder[], error: error.message };
    }

    const mapped = (data ?? []).map((row) => {
      const product = (row as { products?: { name?: string } }).products ?? {};
      return {
        id: String(row.id),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        company_id: String(row.company_id),
        product_id: String(row.product_id),
        product_name: product.name ?? "Unknown product",
        quantity: Number(row.quantity ?? 0),
        status: row.status as WorkOrder["status"],
        schedule_date: String(row.schedule_date),
        machine: String(row.machine ?? ""),
        owner: String(row.owner ?? ""),
      } satisfies WorkOrder;
    });

    return { data: mapped, error: null };
  } catch (error) {
    console.error("[supabase] work_orders select exception", error);
    return {
      data: [] as WorkOrder[],
      error: error instanceof Error ? error.message : "Unable to load work orders.",
    };
  }
}

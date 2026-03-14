import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InventoryItem } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

function deriveStatus(quantity: number, reorderLevel: number) {
  if (quantity <= reorderLevel * 0.65) return "Critical" as const;
  if (quantity <= reorderLevel) return "Low" as const;
  return "Healthy" as const;
}

export async function getInventory() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("inventory")
      .select(
        "id, created_at, updated_at, company_id, product_id, quantity, warehouse_location, reorder_level, unit_cost, products(name, sku, category, unit, standard_cost)",
      )
      .eq("company_id", DEMO_COMPANY_ID)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("[supabase] inventory select failed", error);
      return { data: [] as InventoryItem[], error: error.message };
    }

    const mapped = (data ?? []).map((row) => {
      const product = (row as { products?: { name?: string; sku?: string; category?: string; unit?: string; standard_cost?: number } }).products ?? {};
      const quantity = Number(row.quantity ?? 0);
      const reorderLevel = Number(row.reorder_level ?? 0);

      return {
        id: String(row.id),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        company_id: String(row.company_id),
        product_id: String(row.product_id),
        product_name: product.name ?? "Unknown product",
        sku: product.sku ?? "N/A",
        category: product.category ?? "Uncategorized",
        unit: product.unit ?? "ea",
        quantity,
        warehouse_location: String(row.warehouse_location ?? ""),
        reorder_level: reorderLevel,
        unit_cost: Number(row.unit_cost ?? product.standard_cost ?? 0),
        status: deriveStatus(quantity, reorderLevel),
      } satisfies InventoryItem;
    });

    return { data: mapped, error: null };
  } catch (error) {
    console.error("[supabase] inventory select exception", error);
    return {
      data: [] as InventoryItem[],
      error: error instanceof Error ? error.message : "Unable to load inventory.",
    };
  }
}

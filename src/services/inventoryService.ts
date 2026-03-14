import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InventoryItem } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

function getSupabaseAdminClient() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

function deriveStatus(quantity: number, reorderLevel: number) {
  if (quantity <= reorderLevel * 0.65) return "Critical" as const;
  if (quantity <= reorderLevel) return "Low" as const;
  return "Healthy" as const;
}

export async function getInventory() {
  try {
    const supabase =
      getSupabaseAdminClient() ?? (await createSupabaseServerClient());
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error(
        "[supabase] inventory select failed:",
        error?.message,
        error,
      );
      return {
        data: [] as InventoryItem[],
        error: error?.message ?? null,
      };
    }

    const productIds = Array.from(
      new Set(
        (data ?? [])
          .map((row) => row.product_id)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const productMap = new Map<
      string,
      { name?: string; sku?: string; category?: string; unit?: string; standard_cost?: number }
    >();

    if (productIds.length > 0) {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name, sku, category, unit, standard_cost")
        .in("id", productIds)
        .eq("company_id", DEMO_COMPANY_ID);

      if (productError) {
        console.error(
          "[supabase] inventory products select failed:",
          productError?.message,
          productError,
        );
      } else {
        (productData ?? []).forEach((product) => {
          if (product?.id) {
            productMap.set(String(product.id), {
              name: product.name ?? undefined,
              sku: product.sku ?? undefined,
              category: product.category ?? undefined,
              unit: product.unit ?? undefined,
              standard_cost: product.standard_cost ?? undefined,
            });
          }
        });
      }
    }

    const mapped = (data ?? []).map((row) => {
      const product = productMap.get(String(row.product_id)) ?? {};
      const quantity = Number(row.quantity ?? 0);
      const reorderLevel = Number(
        (row as { reorder_level?: number; reorderLevel?: number })
          .reorder_level ??
          (row as { reorder_level?: number; reorderLevel?: number })
            .reorderLevel ??
          0,
      );
      const warehouseLocation = String(
        (row as { warehouse_location?: string; warehouse?: string })
          .warehouse_location ??
          (row as { warehouse_location?: string; warehouse?: string })
            .warehouse ??
          "",
      );

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
        warehouse_location: warehouseLocation,
        reorder_level: reorderLevel,
        unit_cost: Number(row.unit_cost ?? product.standard_cost ?? 0),
        status: deriveStatus(quantity, reorderLevel),
      } satisfies InventoryItem;
    });

    return { data: mapped, error: null };
  } catch (error) {
    cconsole.error("[supabase] suppliers select failed:", error?.message, error);
    return {
      data: [] as InventoryItem[],
      error: error instanceof Error ? error.message : "Unable to load inventory.",
    };
  }
}

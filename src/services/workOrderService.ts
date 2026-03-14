import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WorkOrder } from "@/types";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

function getSupabaseAdminClient() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

export async function getWorkOrders() {
  try {
    const supabase =
      getSupabaseAdminClient() ?? (await createSupabaseServerClient());
    const { data, error } = await supabase
      .from("work_orders")
      .select("*")
      .eq("company_id", DEMO_COMPANY_ID);

    if (error) {
      console.error(
        "[supabase] work_orders select failed:",
        error?.message,
        error,
      );
      return { data: [] as WorkOrder[], error: error?.message ?? null };
    }

    const productIds = Array.from(
      new Set(
        (data ?? [])
          .map((row) => row.product_id)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const productMap = new Map<string, { name?: string }>();

    if (productIds.length > 0) {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name")
        .in("id", productIds)
        .eq("company_id", DEMO_COMPANY_ID);

      if (productError) {
        console.error(
          "[supabase] work_orders products select failed:",
          productError?.message,
          productError,
        );
      } else {
        (productData ?? []).forEach((product) => {
          if (product?.id) {
            productMap.set(String(product.id), { name: product.name ?? undefined });
          }
        });
      }
    }

    const mapped = (data ?? []).map((row) => {
      const product = productMap.get(String(row.product_id)) ?? {};
      const scheduleDate =
        (row as { schedule_date?: string; scheduled_date?: string })
          .schedule_date ??
        (row as { schedule_date?: string; scheduled_date?: string })
          .scheduled_date ??
        "";
      return {
        id: String(row.id),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        company_id: String(row.company_id),
        product_id: String(row.product_id),
        product_name: product.name ?? "Unknown product",
        quantity: Number(row.quantity ?? 0),
        status: row.status as WorkOrder["status"],
        schedule_date: String(scheduleDate),
        machine: String(row.machine ?? ""),
        owner: String(row.owner ?? ""),
      } satisfies WorkOrder;
    });

    mapped.sort((a, b) => a.schedule_date.localeCompare(b.schedule_date));
    return { data: mapped, error: null };
  } catch (error) {
    console.error("[supabase] work_orders select exception:", error);
    return {
      data: [] as WorkOrder[],
      error:
        error instanceof Error ? error.message : "Unable to load work orders.",
    };
  }
}

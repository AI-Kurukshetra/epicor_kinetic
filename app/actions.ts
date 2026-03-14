"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  inventorySchema,
  loginSchema,
  purchaseOrderSchema,
  qualityInspectionSchema,
  salesOrderSchema,
  signupSchema,
  workOrderSchema,
} from "@/lib/validators";
import {
  createInventoryItem,
  createPurchaseOrder,
  createQualityInspection,
  createSalesOrder,
  createWorkOrder,
} from "@/services/erp";

function getValue(formData: FormData, key: string) {
  return formData.get(key)?.toString() ?? "";
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.parse({
    email: getValue(formData, "email"),
    password: getValue(formData, "password"),
  });

  if (!isSupabaseConfigured) {
    redirect("/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(getValue(formData, "next") || "/dashboard");
}

export async function signupAction(formData: FormData) {
  const companyNameRaw = formData.get("companyName");
  const emailValue = getValue(formData, "email");
  const fullNameValue =
    getValue(formData, "fullName") || emailValue.split("@")[0] || "New User";
  const parsed = signupSchema.parse({
    fullName: fullNameValue,
    companyName: companyNameRaw ? companyNameRaw.toString() : undefined,
    email: emailValue,
    password: getValue(formData, "password"),
  });

  if (!isSupabaseConfigured) {
    redirect("/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      data: {
        full_name: parsed.fullName,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && parsed.companyName) {
    try {
      const { data: company } = await supabase
        .from("companies")
        .insert({
          name: parsed.companyName,
          industry: "Discrete Manufacturing",
          size_range: "10-50",
          timezone: "America/Chicago",
        })
        .select()
        .single();

        await supabase.from("users").upsert({
          id: data.user.id,
          email: parsed.email,
          full_name: parsed.fullName,
          role: "admin",
          company_id: company?.id ?? null,
        });
    } catch {
      try {
        const admin = createSupabaseAdminClient();
        const { data: company } = await admin
          .from("companies")
          .insert({
            name: parsed.companyName,
            industry: "Discrete Manufacturing",
            size_range: "10-50",
            timezone: "America/Chicago",
          })
          .select()
          .single();

        await admin.from("users").upsert({
          id: data.user.id,
          email: parsed.email,
          full_name: parsed.fullName,
          role: "admin",
          company_id: company?.id ?? null,
        });
      } catch {
        // Schema trigger plus admin client fallback cover the normal setup paths.
      }
    }
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/login?success=logged_out");
}

export async function createInventoryAction(formData: FormData) {
  const parsed = inventorySchema.parse({
    productName: getValue(formData, "productName"),
    sku: getValue(formData, "sku"),
    category: getValue(formData, "category"),
    quantity: getValue(formData, "quantity"),
    warehouseLocation: getValue(formData, "warehouseLocation"),
    reorderLevel: getValue(formData, "reorderLevel"),
    unitCost: getValue(formData, "unitCost"),
  });

  await createInventoryItem(parsed);
  revalidatePath("/inventory");
  redirect("/inventory?created=1");
}

export async function createWorkOrderAction(formData: FormData) {
  const parsed = workOrderSchema.parse({
    productId: getValue(formData, "productId"),
    quantity: getValue(formData, "quantity"),
    status: getValue(formData, "status"),
    scheduleDate: getValue(formData, "scheduleDate"),
  });

  await createWorkOrder(parsed);
  revalidatePath("/work-orders");
  redirect("/work-orders?created=1");
}

export async function createPurchaseOrderAction(formData: FormData) {
  const parsed = purchaseOrderSchema.parse({
    supplierId: getValue(formData, "supplierId"),
    totalAmount: getValue(formData, "totalAmount"),
    status: getValue(formData, "status"),
    expectedDate: getValue(formData, "expectedDate"),
  });

  await createPurchaseOrder(parsed);
  revalidatePath("/purchases");
  redirect("/purchases?created=1");
}

export async function createSalesOrderAction(formData: FormData) {
  const parsed = salesOrderSchema.parse({
    customerId: getValue(formData, "customerId"),
    totalAmount: getValue(formData, "totalAmount"),
    status: getValue(formData, "status"),
    deliveryDate: getValue(formData, "deliveryDate"),
  });

  await createSalesOrder(parsed);
  revalidatePath("/sales");
  redirect("/sales?created=1");
}

export async function createQualityInspectionAction(formData: FormData) {
  const parsed = qualityInspectionSchema.parse({
    productId: getValue(formData, "productId"),
    result: getValue(formData, "result"),
    notes: getValue(formData, "notes"),
  });

  await createQualityInspection(parsed);
  revalidatePath("/quality");
  redirect("/quality?created=1");
}

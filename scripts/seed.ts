import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import {
  mockBomRows,
  mockCompany,
  mockCustomers,
  mockInventory,
  mockNotifications,
  mockProducts,
  mockPurchaseOrders,
  mockQualityInspections,
  mockSalesOrders,
  mockSchedules,
  mockSuppliers,
  mockUsers,
  mockWorkOrders,
} from "../services/mock-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for seeding.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const inventorySeedRows = mockInventory.map((item) => ({
  id: item.id,
  created_at: item.created_at,
  updated_at: item.updated_at,
  company_id: item.company_id,
  product_id: item.product_id,
  quantity: item.quantity,
  warehouse_location: item.warehouse_location,
  reorder_level: item.reorder_level,
  unit_cost: item.unit_cost,
}));

const bomSeedRows = mockBomRows.map((row) => ({
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
  company_id: row.company_id,
  parent_product_id: row.parent_product_id,
  component_product_id: row.component_product_id,
  level: row.level,
  quantity: row.quantity,
}));

const workOrderSeedRows = mockWorkOrders.map((row) => ({
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
  company_id: row.company_id,
  product_id: row.product_id,
  quantity: row.quantity,
  status: row.status,
  schedule_date: row.schedule_date,
  machine: row.machine,
  owner: row.owner,
}));

const purchaseOrderSeedRows = mockPurchaseOrders.map((row) => ({
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
  company_id: row.company_id,
  supplier_id: row.supplier_id,
  order_number: row.order_number,
  total_amount: row.total_amount,
  status: row.status,
  expected_date: row.expected_date,
  received_percent: row.received_percent,
}));

const salesOrderSeedRows = mockSalesOrders.map((row) => ({
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
  company_id: row.company_id,
  customer_id: row.customer_id,
  order_number: row.order_number,
  total_amount: row.total_amount,
  status: row.status,
  delivery_date: row.delivery_date,
  fulfillment_percent: row.fulfillment_percent,
}));

const qualitySeedRows = mockQualityInspections.map((row) => ({
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
  company_id: row.company_id,
  product_id: row.product_id,
  inspector: row.inspector,
  result: row.result,
  notes: row.notes,
  inspected_at: row.inspected_at,
}));

async function seed() {
  console.log("Seeding NextGen Manufacturing ERP...");

  await supabase.from("notifications").delete().neq("id", "");
  await supabase.from("quality_inspections").delete().neq("id", "");
  await supabase.from("sales_orders").delete().neq("id", "");
  await supabase.from("purchase_orders").delete().neq("id", "");
  await supabase.from("production_schedules").delete().neq("id", "");
  await supabase.from("work_orders").delete().neq("id", "");
  await supabase.from("bill_of_materials").delete().neq("id", "");
  await supabase.from("inventory").delete().neq("id", "");
  await supabase.from("customers").delete().neq("id", "");
  await supabase.from("suppliers").delete().neq("id", "");
  await supabase.from("products").delete().neq("id", "");
  await supabase.from("users").delete().neq("id", "");
  await supabase.from("companies").delete().neq("id", "");

  await supabase.from("companies").insert(mockCompany);
  await supabase.from("users").insert(mockUsers);
  await supabase.from("products").insert(mockProducts);
  await supabase.from("inventory").insert(inventorySeedRows);
  await supabase.from("bill_of_materials").insert(bomSeedRows);
  await supabase.from("suppliers").insert(mockSuppliers);
  await supabase.from("customers").insert(mockCustomers);
  await supabase.from("work_orders").insert(workOrderSeedRows);
  await supabase.from("production_schedules").insert(mockSchedules);
  await supabase.from("purchase_orders").insert(purchaseOrderSeedRows);
  await supabase.from("sales_orders").insert(salesOrderSeedRows);
  await supabase.from("quality_inspections").insert(qualitySeedRows);
  await supabase.from("notifications").insert(mockNotifications);

  console.log("Seed completed.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

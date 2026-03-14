import "server-only";

import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
} from "@/services/mock-data";
import type {
  ActivityItem,
  AlertItem,
  BillOfMaterialRow,
  Customer,
  DashboardSnapshot,
  InventoryInput,
  InventoryItem,
  Product,
  ProductionSchedule,
  PurchaseOrder,
  PurchaseOrderInput,
  QualityInspection,
  QualityInspectionInput,
  ReportsSnapshot,
  SalesOrder,
  SalesOrderInput,
  Supplier,
  UserProfile,
  WorkOrder,
  WorkOrderInput,
} from "@/types";

type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function withSupabase<T>(
  fallback: T,
  run: (supabase: SupabaseClient) => Promise<T>,
): Promise<T> {
  if (!isSupabaseConfigured) {
    return fallback;
  }

  try {
    const supabase = await createSupabaseServerClient();
    return await run(supabase);
  } catch {
    return fallback;
  }
}

function deriveInventoryStatus(quantity: number, reorderLevel: number) {
  if (quantity <= reorderLevel * 0.65) return "Critical" as const;
  if (quantity <= reorderLevel) return "Low" as const;
  return "Healthy" as const;
}

async function resolveCurrentCompanyId(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return mockCompany.id;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.company_id ?? mockCompany.id;
}

export const getProducts = cache(async (): Promise<Product[]> =>
  withSupabase(mockProducts, async (supabase) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data) return mockProducts;
    return data as Product[];
  }),
);

export const getSuppliers = cache(async (): Promise<Supplier[]> =>
  withSupabase(mockSuppliers, async (supabase) => {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return mockSuppliers;
    return data as Supplier[];
  }),
);

export const getCustomers = cache(async (): Promise<Customer[]> =>
  withSupabase(mockCustomers, async (supabase) => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return mockCustomers;
    return data as Customer[];
  }),
);

export const getProfileByUserId = cache(
  async (userId: string, email = ""): Promise<UserProfile> =>
    withSupabase(mockUsers[0]!, async (supabase) => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) return mockUsers[0]!;

      return (
        (data as UserProfile | null) ?? {
          ...mockUsers[1]!,
          id: userId,
          email: email || mockUsers[1]!.email,
        }
      );
    }),
);

export const getInventoryItems = cache(async (): Promise<InventoryItem[]> =>
  withSupabase(mockInventory, async (supabase) => {
    const [inventoryResult, productsResult] = await Promise.all([
      supabase
        .from("inventory")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase.from("products").select("*"),
    ]);

    if (inventoryResult.error || productsResult.error) {
      return mockInventory;
    }

    const products = new Map(
      ((productsResult.data as Product[] | null) ?? []).map((product) => [
        product.id,
        product,
      ]),
    );

    return (((inventoryResult.data as Record<string, unknown>[] | null) ?? []).map(
      (row) => {
        const product = products.get(String(row.product_id));
        const quantity = Number(row.quantity ?? 0);
        const reorderLevel = Number(row.reorder_level ?? 0);

        return {
          id: String(row.id),
          created_at: String(row.created_at),
          updated_at: String(row.updated_at),
          company_id: String(row.company_id),
          product_id: String(row.product_id),
          product_name: product?.name ?? "Unknown product",
          sku: product?.sku ?? "N/A",
          category: product?.category ?? "Uncategorized",
          unit: product?.unit ?? "ea",
          quantity,
          warehouse_location: String(row.warehouse_location),
          reorder_level: reorderLevel,
          unit_cost: Number(row.unit_cost ?? product?.standard_cost ?? 0),
          status: deriveInventoryStatus(quantity, reorderLevel),
        };
      },
    ) satisfies InventoryItem[]);
  }),
);

export const getInventoryItemById = cache(
  async (id: string): Promise<InventoryItem | null> => {
    const items = await getInventoryItems();
    return items.find((item) => item.id === id) ?? null;
  },
);

export const getBomRows = cache(async (): Promise<BillOfMaterialRow[]> =>
  withSupabase(mockBomRows, async (supabase) => {
    const [bomResult, productsResult] = await Promise.all([
      supabase.from("bill_of_materials").select("*"),
      supabase.from("products").select("*"),
    ]);

    if (bomResult.error || productsResult.error) {
      return mockBomRows;
    }

    const products = new Map(
      ((productsResult.data as Product[] | null) ?? []).map((product) => [
        product.id,
        product,
      ]),
    );

    return (((bomResult.data as Record<string, unknown>[] | null) ?? []).map(
      (row) => {
        const component = products.get(String(row.component_product_id));
        return {
          id: String(row.id),
          created_at: String(row.created_at),
          updated_at: String(row.updated_at),
          company_id: String(row.company_id),
          parent_product_id: String(row.parent_product_id),
          parent_product_name:
            products.get(String(row.parent_product_id))?.name ??
            "Unknown assembly",
          component_product_id: String(row.component_product_id),
          component_name: component?.name ?? "Unknown component",
          level: Number(row.level ?? 1),
          quantity: Number(row.quantity ?? 0),
          unit_cost: Number(component?.standard_cost ?? 0),
          rollup_cost:
            Number(row.quantity ?? 0) * Number(component?.standard_cost ?? 0),
        };
      },
    ) satisfies BillOfMaterialRow[]);
  }),
);

export const getWorkOrders = cache(async (): Promise<WorkOrder[]> =>
  withSupabase(mockWorkOrders, async (supabase) => {
    const [workOrdersResult, productsResult] = await Promise.all([
      supabase
        .from("work_orders")
        .select("*")
        .order("schedule_date", { ascending: true }),
      supabase.from("products").select("*"),
    ]);

    if (workOrdersResult.error || productsResult.error) {
      return mockWorkOrders;
    }

    const products = new Map(
      ((productsResult.data as Product[] | null) ?? []).map((product) => [
        product.id,
        product,
      ]),
    );

    return (((workOrdersResult.data as Record<string, unknown>[] | null) ?? []).map(
      (row) => ({
        id: String(row.id),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        company_id: String(row.company_id),
        product_id: String(row.product_id),
        product_name:
          products.get(String(row.product_id))?.name ?? "Unknown product",
        quantity: Number(row.quantity ?? 0),
        status: row.status as WorkOrder["status"],
        schedule_date: String(row.schedule_date),
        machine: String(row.machine ?? "Assembly Line 01"),
        owner: String(row.owner ?? "Production Lead"),
      }),
    ) satisfies WorkOrder[]);
  }),
);

export const getSchedules = cache(async (): Promise<ProductionSchedule[]> =>
  withSupabase(mockSchedules, async (supabase) => {
    const { data, error } = await supabase
      .from("production_schedules")
      .select("*")
      .order("schedule_date", { ascending: true });

    if (error || !data) return mockSchedules;
    return data as ProductionSchedule[];
  }),
);

export const getPurchaseOrders = cache(async (): Promise<PurchaseOrder[]> =>
  withSupabase(mockPurchaseOrders, async (supabase) => {
    const [purchaseResult, suppliersResult] = await Promise.all([
      supabase
        .from("purchase_orders")
        .select("*")
        .order("expected_date", { ascending: true }),
      supabase.from("suppliers").select("*"),
    ]);

    if (purchaseResult.error || suppliersResult.error) {
      return mockPurchaseOrders;
    }

    const suppliers = new Map(
      ((suppliersResult.data as Supplier[] | null) ?? []).map((supplier) => [
        supplier.id,
        supplier,
      ]),
    );

    return (((purchaseResult.data as Record<string, unknown>[] | null) ?? []).map(
      (row) => ({
        id: String(row.id),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        company_id: String(row.company_id),
        supplier_id: String(row.supplier_id),
        supplier_name:
          suppliers.get(String(row.supplier_id))?.name ?? "Unknown supplier",
        order_number: String(row.order_number),
        total_amount: Number(row.total_amount ?? 0),
        status: row.status as PurchaseOrder["status"],
        expected_date: String(row.expected_date),
        received_percent: Number(row.received_percent ?? 0),
      }),
    ) satisfies PurchaseOrder[]);
  }),
);

export const getSalesOrders = cache(async (): Promise<SalesOrder[]> =>
  withSupabase(mockSalesOrders, async (supabase) => {
    const [salesResult, customersResult] = await Promise.all([
      supabase
        .from("sales_orders")
        .select("*")
        .order("delivery_date", { ascending: true }),
      supabase.from("customers").select("*"),
    ]);

    if (salesResult.error || customersResult.error) {
      return mockSalesOrders;
    }

    const customers = new Map(
      ((customersResult.data as Customer[] | null) ?? []).map((customer) => [
        customer.id,
        customer,
      ]),
    );

    return (((salesResult.data as Record<string, unknown>[] | null) ?? []).map(
      (row) => ({
        id: String(row.id),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        company_id: String(row.company_id),
        customer_id: String(row.customer_id),
        customer_name:
          customers.get(String(row.customer_id))?.name ?? "Unknown customer",
        order_number: String(row.order_number),
        total_amount: Number(row.total_amount ?? 0),
        status: row.status as SalesOrder["status"],
        delivery_date: String(row.delivery_date),
        fulfillment_percent: Number(row.fulfillment_percent ?? 0),
      }),
    ) satisfies SalesOrder[]);
  }),
);

export const getQualityInspections = cache(
  async (): Promise<QualityInspection[]> =>
    withSupabase(mockQualityInspections, async (supabase) => {
      const [inspectionResult, productsResult] = await Promise.all([
        supabase
          .from("quality_inspections")
          .select("*")
          .order("inspected_at", { ascending: false }),
        supabase.from("products").select("*"),
      ]);

      if (inspectionResult.error || productsResult.error) {
        return mockQualityInspections;
      }

      const products = new Map(
        ((productsResult.data as Product[] | null) ?? []).map((product) => [
          product.id,
          product,
        ]),
      );

      return (((inspectionResult.data as Record<string, unknown>[] | null) ?? []).map(
        (row) => ({
          id: String(row.id),
          created_at: String(row.created_at),
          updated_at: String(row.updated_at),
          company_id: String(row.company_id),
          product_id: String(row.product_id),
          product_name:
            products.get(String(row.product_id))?.name ?? "Unknown product",
          inspector: String(row.inspector ?? "Quality Team"),
          result: row.result as QualityInspection["result"],
          notes: String(row.notes ?? ""),
          inspected_at: String(row.inspected_at),
        }),
      ) satisfies QualityInspection[]);
    }),
);

export const getNotifications = cache(async (): Promise<AlertItem[]> =>
  withSupabase(
    mockNotifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      severity: notification.severity,
    })),
    async (supabase) => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error || !data) {
        return mockNotifications.map((notification) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          severity: notification.severity,
        }));
      }

      return (data as Record<string, unknown>[]).map((row) => ({
        id: String(row.id),
        title: String(row.title),
        message: String(row.message),
        severity: row.severity as AlertItem["severity"],
      }));
    },
  ),
);

export const getDashboardSnapshot = cache(async (): Promise<DashboardSnapshot> => {
  const [inventory, workOrders, purchases, inspections, alerts] =
    await Promise.all([
      getInventoryItems(),
      getWorkOrders(),
      getPurchaseOrders(),
      getQualityInspections(),
      getNotifications(),
    ]);

  const chart_data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (name, index) => ({
      name,
      production: 44 + index * 8,
      procurement: 18 + (index % 3) * 6,
      sales: 22 + index * 5,
    }),
  );

  const recent_activity: ActivityItem[] = [
    ...workOrders.slice(0, 2).map((order) => ({
      id: `activity-${order.id}`,
      title: `${order.product_name} moved to ${order.status}`,
      detail: `WO ${order.id.toUpperCase()} scheduled on ${order.schedule_date}.`,
      timestamp: order.updated_at,
      type: "production" as const,
    })),
    ...purchases.slice(0, 2).map((po) => ({
      id: `activity-${po.id}`,
      title: `${po.order_number} for ${po.supplier_name}`,
      detail: `${po.status} with ${po.received_percent}% received.`,
      timestamp: po.updated_at,
      type: "procurement" as const,
    })),
    ...inspections.slice(0, 2).map((inspection) => ({
      id: `activity-${inspection.id}`,
      title: `${inspection.product_name} inspection ${inspection.result}`,
      detail: inspection.notes,
      timestamp: inspection.updated_at,
      type: "quality" as const,
    })),
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return {
    production_orders: workOrders.length,
    inventory_levels: inventory.reduce((sum, item) => sum + item.quantity, 0),
    active_work_orders: workOrders.filter(
      (order) => order.status === "In Production",
    ).length,
    pending_purchase_orders: purchases.filter(
      (order) => order.status === "Pending",
    ).length,
    chart_data,
    recent_activity,
    alerts,
  };
});

export const getReportsSnapshot = cache(async (): Promise<ReportsSnapshot> => {
  const [inventory, workOrders, purchases, sales] = await Promise.all([
    getInventoryItems(),
    getWorkOrders(),
    getPurchaseOrders(),
    getSalesOrders(),
  ]);

  const revenue = sales.reduce((sum, order) => sum + order.total_amount, 0);
  const procurementSpend = purchases.reduce(
    (sum, order) => sum + order.total_amount,
    0,
  );
  const inventoryValue = inventory.reduce(
    (sum, item) => sum + item.quantity * item.unit_cost,
    0,
  );
  const wipValue = workOrders
    .filter((order) => order.status !== "Completed")
    .reduce((sum, order) => {
      const inventoryItem = inventory.find(
        (item) => item.product_id === order.product_id,
      );
      return sum + order.quantity * Number(inventoryItem?.unit_cost ?? 0);
    }, 0);

  return {
    production_summary: {
      completed_orders: workOrders.filter((item) => item.status === "Completed")
        .length,
      planned_orders: workOrders.filter((item) => item.status === "Planned")
        .length,
      throughput_units: workOrders.reduce((sum, order) => sum + order.quantity, 0),
    },
    inventory_report: {
      inventory_value: inventoryValue,
      low_stock_items: inventory.filter((item) => item.status === "Low").length,
      critical_stock_items: inventory.filter((item) => item.status === "Critical")
        .length,
    },
    financial_overview: {
      revenue,
      procurement_spend: procurementSpend,
      work_in_progress_value: wipValue,
      gross_margin:
        revenue === 0
          ? 0
          : Number((((revenue - procurementSpend) / revenue) * 100).toFixed(1)),
    },
  };
});

export async function createInventoryItem(input: InventoryInput) {
  return withSupabase(mockInventory[0]!, async (supabase) => {
    const companyId = await resolveCurrentCompanyId(supabase);
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        company_id: companyId,
        sku: input.sku,
        name: input.productName,
        description: `${input.productName} created from the ERP inventory module.`,
        category: input.category,
        unit: "ea",
        standard_cost: input.unitCost,
        sales_price: input.unitCost * 1.35,
      })
      .select()
      .single();

    if (productError || !product) {
      throw new Error(productError?.message ?? "Unable to create product.");
    }

    const { data: inventory, error: inventoryError } = await supabase
      .from("inventory")
      .insert({
        company_id: companyId,
        product_id: product.id,
        quantity: input.quantity,
        warehouse_location: input.warehouseLocation,
        reorder_level: input.reorderLevel,
        unit_cost: input.unitCost,
      })
      .select()
      .single();

    if (inventoryError || !inventory) {
      throw new Error(inventoryError?.message ?? "Unable to create inventory.");
    }

    return {
      id: String(inventory.id),
      created_at: String(inventory.created_at),
      updated_at: String(inventory.updated_at),
      company_id: companyId,
      product_id: String(product.id),
      product_name: String(product.name),
      sku: String(product.sku),
      category: String(product.category),
      unit: String(product.unit),
      quantity: Number(inventory.quantity),
      warehouse_location: String(inventory.warehouse_location),
      reorder_level: Number(inventory.reorder_level),
      unit_cost: Number(inventory.unit_cost),
      status: deriveInventoryStatus(
        Number(inventory.quantity),
        Number(inventory.reorder_level),
      ),
    } as InventoryItem;
  });
}

export async function createWorkOrder(input: WorkOrderInput) {
  return withSupabase(mockWorkOrders[0]!, async (supabase) => {
    const companyId = await resolveCurrentCompanyId(supabase);
    const product = (await getProducts()).find((item) => item.id === input.productId);

    const { data, error } = await supabase
      .from("work_orders")
      .insert({
        company_id: companyId,
        product_id: input.productId,
        quantity: input.quantity,
        status: input.status,
        schedule_date: input.scheduleDate,
        machine: "Assembly Line 02",
        owner: "Production Lead",
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to create work order.");
    }

    return {
      id: String(data.id),
      created_at: String(data.created_at),
      updated_at: String(data.updated_at),
      company_id: String(data.company_id),
      product_id: String(data.product_id),
      product_name: product?.name ?? "Unknown product",
      quantity: Number(data.quantity),
      status: data.status as WorkOrder["status"],
      schedule_date: String(data.schedule_date),
      machine: String(data.machine),
      owner: String(data.owner),
    } as WorkOrder;
  });
}

export async function createPurchaseOrder(input: PurchaseOrderInput) {
  return withSupabase(mockPurchaseOrders[0]!, async (supabase) => {
    const companyId = await resolveCurrentCompanyId(supabase);
    const supplier = (await getSuppliers()).find(
      (item) => item.id === input.supplierId,
    );

    const { data, error } = await supabase
      .from("purchase_orders")
      .insert({
        company_id: companyId,
        supplier_id: input.supplierId,
        order_number: `PO-${Date.now()}`,
        total_amount: input.totalAmount,
        status: input.status,
        expected_date: input.expectedDate,
        received_percent: 0,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to create purchase order.");
    }

    return {
      id: String(data.id),
      created_at: String(data.created_at),
      updated_at: String(data.updated_at),
      company_id: String(data.company_id),
      supplier_id: String(data.supplier_id),
      supplier_name: supplier?.name ?? "Unknown supplier",
      order_number: String(data.order_number),
      total_amount: Number(data.total_amount),
      status: data.status as PurchaseOrder["status"],
      expected_date: String(data.expected_date),
      received_percent: Number(data.received_percent),
    } as PurchaseOrder;
  });
}

export async function createSalesOrder(input: SalesOrderInput) {
  return withSupabase(mockSalesOrders[0]!, async (supabase) => {
    const companyId = await resolveCurrentCompanyId(supabase);
    const customer = (await getCustomers()).find(
      (item) => item.id === input.customerId,
    );

    const { data, error } = await supabase
      .from("sales_orders")
      .insert({
        company_id: companyId,
        customer_id: input.customerId,
        order_number: `SO-${Date.now()}`,
        total_amount: input.totalAmount,
        status: input.status,
        delivery_date: input.deliveryDate,
        fulfillment_percent: input.status === "Delivered" ? 100 : 0,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to create sales order.");
    }

    return {
      id: String(data.id),
      created_at: String(data.created_at),
      updated_at: String(data.updated_at),
      company_id: String(data.company_id),
      customer_id: String(data.customer_id),
      customer_name: customer?.name ?? "Unknown customer",
      order_number: String(data.order_number),
      total_amount: Number(data.total_amount),
      status: data.status as SalesOrder["status"],
      delivery_date: String(data.delivery_date),
      fulfillment_percent: Number(data.fulfillment_percent),
    } as SalesOrder;
  });
}

export async function createQualityInspection(input: QualityInspectionInput) {
  return withSupabase(mockQualityInspections[0]!, async (supabase) => {
    const companyId = await resolveCurrentCompanyId(supabase);
    const product = (await getProducts()).find((item) => item.id === input.productId);

    const { data, error } = await supabase
      .from("quality_inspections")
      .insert({
        company_id: companyId,
        product_id: input.productId,
        inspector: "Quality Lead",
        result: input.result,
        notes: input.notes,
        inspected_at: new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to create inspection.");
    }

    return {
      id: String(data.id),
      created_at: String(data.created_at),
      updated_at: String(data.updated_at),
      company_id: String(data.company_id),
      product_id: String(data.product_id),
      product_name: product?.name ?? "Unknown product",
      inspector: String(data.inspector),
      result: data.result as QualityInspection["result"],
      notes: String(data.notes),
      inspected_at: String(data.inspected_at),
    } as QualityInspection;
  });
}

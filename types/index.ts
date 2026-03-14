export type UserRole = "admin" | "manager" | "worker";
export type InventoryStatus = "Healthy" | "Low" | "Critical";
export type WorkOrderStatus = "Planned" | "In Production" | "Completed";
export type PurchaseStatus = "Pending" | "Approved" | "Received";
export type SalesStatus = "Pending" | "Packed" | "Delivered";
export type InspectionResult = "Pass" | "Fail";

export interface BaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Company extends BaseRecord {
  name: string;
  industry: string;
  size_range: string;
  timezone: string;
}

export interface UserProfile extends BaseRecord {
  email: string;
  full_name: string;
  role: UserRole;
  company_id: string;
  avatar_url: string | null;
}

export interface Product extends BaseRecord {
  company_id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  standard_cost: number;
  sales_price: number;
}

export interface InventoryItem extends BaseRecord {
  company_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  category: string;
  unit: string;
  quantity: number;
  warehouse_location: string;
  reorder_level: number;
  unit_cost: number;
  status: InventoryStatus;
}

export interface BillOfMaterialRow extends BaseRecord {
  company_id: string;
  parent_product_id: string;
  parent_product_name: string;
  component_product_id: string;
  component_name: string;
  level: number;
  quantity: number;
  unit_cost: number;
  rollup_cost: number;
}

export interface WorkOrder extends BaseRecord {
  company_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  status: WorkOrderStatus;
  schedule_date: string;
  machine: string;
  owner: string;
}

export interface ProductionSchedule extends BaseRecord {
  company_id: string;
  work_order_id: string;
  machine_name: string;
  schedule_date: string;
  shift: string;
  capacity_percent: number;
  status: WorkOrderStatus;
}

export interface Supplier extends BaseRecord {
  company_id: string;
  name: string;
  contact_name: string;
  email: string;
  lead_time_days: number;
  status: "Preferred" | "Approved" | "Trial";
}

export interface Customer extends BaseRecord {
  company_id: string;
  name: string;
  contact_name: string;
  email: string;
  region: string;
}

export interface PurchaseOrder extends BaseRecord {
  company_id: string;
  supplier_id: string;
  supplier_name: string;
  order_number: string;
  total_amount: number;
  status: PurchaseStatus;
  expected_date: string;
  received_percent: number;
}

export interface SalesOrder extends BaseRecord {
  company_id: string;
  customer_id: string;
  customer_name: string;
  order_number: string;
  total_amount: number;
  status: SalesStatus;
  delivery_date: string;
  fulfillment_percent: number;
}

export interface QualityInspection extends BaseRecord {
  company_id: string;
  product_id: string;
  product_name: string;
  inspector: string;
  result: InspectionResult;
  notes: string;
  inspected_at: string;
}

export interface Notification extends BaseRecord {
  company_id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  is_read: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: "inventory" | "production" | "procurement" | "quality" | "sales";
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
}

export interface ChartPoint {
  name: string;
  production: number;
  procurement: number;
  sales: number;
}

export interface DashboardSnapshot {
  production_orders: number;
  inventory_levels: number;
  active_work_orders: number;
  pending_purchase_orders: number;
  chart_data: ChartPoint[];
  recent_activity: ActivityItem[];
  alerts: AlertItem[];
}

export interface ReportsSnapshot {
  production_summary: {
    completed_orders: number;
    planned_orders: number;
    throughput_units: number;
  };
  inventory_report: {
    inventory_value: number;
    low_stock_items: number;
    critical_stock_items: number;
  };
  financial_overview: {
    revenue: number;
    procurement_spend: number;
    work_in_progress_value: number;
    gross_margin: number;
  };
}

export interface InventoryInput {
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  warehouseLocation: string;
  reorderLevel: number;
  unitCost: number;
}

export interface WorkOrderInput {
  productId: string;
  quantity: number;
  status: WorkOrderStatus;
  scheduleDate: string;
}

export interface PurchaseOrderInput {
  supplierId: string;
  totalAmount: number;
  status: PurchaseStatus;
  expectedDate: string;
}

export interface SalesOrderInput {
  customerId: string;
  totalAmount: number;
  status: SalesStatus;
  deliveryDate: string;
}

export interface QualityInspectionInput {
  productId: string;
  result: InspectionResult;
  notes: string;
}

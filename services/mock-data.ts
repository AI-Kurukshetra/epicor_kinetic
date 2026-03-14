import type {
  BillOfMaterialRow,
  Company,
  Customer,
  InventoryItem,
  Notification,
  Product,
  ProductionSchedule,
  PurchaseOrder,
  QualityInspection,
  SalesOrder,
  Supplier,
  UserProfile,
  WorkOrder,
} from "@/types";

const day = 1000 * 60 * 60 * 24;
const stamp = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * day).toISOString();

export const mockCompany: Company = {
  id: "company-nextgen",
  created_at: stamp(180),
  updated_at: stamp(2),
  name: "Northstar Fabrication Co.",
  industry: "Discrete Manufacturing",
  size_range: "50-200",
  timezone: "America/Chicago",
};

export const mockUsers: UserProfile[] = [
  {
    id: "user-admin",
    created_at: stamp(180),
    updated_at: stamp(1),
    email: "olivia.admin@northstar.example",
    full_name: "Olivia Carter",
    role: "admin",
    company_id: mockCompany.id,
    avatar_url: null,
  },
  {
    id: "user-manager",
    created_at: stamp(160),
    updated_at: stamp(1),
    email: "ethan.manager@northstar.example",
    full_name: "Ethan Brooks",
    role: "manager",
    company_id: mockCompany.id,
    avatar_url: null,
  },
  {
    id: "user-worker",
    created_at: stamp(120),
    updated_at: stamp(3),
    email: "maya.worker@northstar.example",
    full_name: "Maya Singh",
    role: "worker",
    company_id: mockCompany.id,
    avatar_url: null,
  },
];

const productBlueprints = [
  ["Servo Motor Assembly", "Motion", "ea", 1800, 2600],
  ["Control Panel Kit", "Electrical", "kit", 940, 1420],
  ["Hydraulic Valve Pack", "Fluid", "ea", 620, 1040],
  ["Precision Gearbox", "Mechanical", "ea", 1330, 1980],
  ["Steel Chassis Frame", "Structure", "ea", 490, 890],
  ["Conveyor Sensor Pack", "Sensors", "set", 310, 540],
  ["Pump Housing", "Fluid", "ea", 420, 760],
  ["Operator Console", "Electrical", "ea", 1240, 1840],
  ["Thermal Shield Plate", "Structure", "ea", 115, 240],
  ["Drive Shaft Set", "Mechanical", "set", 360, 620],
  ["Bearing Core", "Mechanical", "ea", 52, 110],
  ["Copper Wiring Loom", "Electrical", "roll", 88, 140],
  ["Fastener Pack A", "Consumable", "pack", 24, 42],
  ["Sensor PCB", "Sensors", "ea", 140, 260],
  ["Actuator Arm", "Motion", "ea", 210, 370],
  ["Sealant Cartridge", "Consumable", "ea", 18, 32],
  ["Composite Panel Sheet", "Structure", "sheet", 96, 176],
  ["Valve Stem", "Fluid", "ea", 44, 88],
  ["Touch Display Unit", "Electrical", "ea", 280, 480],
  ["Cooling Fan Module", "Electrical", "ea", 72, 130],
] as const;

export const mockProducts: Product[] = productBlueprints.map(
  ([name, category, unit, standard_cost, sales_price], index) => ({
    id: `product-${index + 1}`,
    created_at: stamp(150 - index),
    updated_at: stamp((index % 7) + 1),
    company_id: mockCompany.id,
    sku: `NGM-${1000 + index}`,
    name,
    description: `${name} configured for configurable manufacturing workflows.`,
    category,
    unit,
    standard_cost,
    sales_price,
  }),
);

const inventoryLevels = [
  540, 180, 96, 140, 64, 210, 88, 54, 420, 160, 900, 620, 1400, 250, 190, 310,
  130, 340, 76, 110,
];
const reorderLevels = [
  180, 140, 80, 120, 100, 110, 95, 70, 180, 140, 300, 260, 480, 140, 100, 120,
  90, 160, 90, 75,
];

export const mockInventory: InventoryItem[] = mockProducts.map(
  (product, index) => {
    const quantity = inventoryLevels[index];
    const reorderLevel = reorderLevels[index];
    const status =
      quantity <= reorderLevel * 0.65
        ? "Critical"
        : quantity <= reorderLevel
          ? "Low"
          : "Healthy";

    return {
      id: `inventory-${index + 1}`,
      created_at: stamp(120 - index),
      updated_at: stamp(index % 5),
      company_id: mockCompany.id,
      product_id: product.id,
      product_name: product.name,
      sku: product.sku,
      category: product.category,
      unit: product.unit,
      quantity,
      warehouse_location: `A-${(index % 5) + 1}-${(index % 4) + 1}`,
      reorder_level: reorderLevel,
      unit_cost: product.standard_cost,
      status,
    };
  },
);

const bomBlueprints = [
  [0, 10, 1, 4],
  [0, 12, 1, 8],
  [0, 13, 2, 1],
  [1, 11, 1, 2],
  [1, 18, 1, 1],
  [2, 17, 1, 6],
  [2, 15, 2, 1],
  [3, 10, 1, 6],
  [3, 12, 1, 10],
  [7, 18, 1, 1],
  [7, 11, 1, 3],
  [7, 19, 1, 2],
] as const;

export const mockBomRows: BillOfMaterialRow[] = bomBlueprints.map(
  ([parentIndex, componentIndex, level, quantity], index) => {
    const parent = mockProducts[parentIndex];
    const component = mockProducts[componentIndex];

    return {
      id: `bom-${index + 1}`,
      created_at: stamp(100 - index),
      updated_at: stamp(index % 6),
      company_id: mockCompany.id,
      parent_product_id: parent.id,
      parent_product_name: parent.name,
      component_product_id: component.id,
      component_name: component.name,
      level,
      quantity,
      unit_cost: component.standard_cost,
      rollup_cost: component.standard_cost * quantity,
    };
  },
);

const machines = [
  "Laser Cell 01",
  "Assembly Line 02",
  "Hydraulic Bench 01",
  "CNC Cluster 03",
];

const owners = ["Ava Kim", "Noah Patel", "Grace Lin", "Lucas Reed"];

export const mockWorkOrders: WorkOrder[] = Array.from({ length: 10 }, (_, i) => {
  const product = mockProducts[i];
  const status = (["Planned", "In Production", "Completed"] as const)[i % 3];

  return {
    id: `wo-${i + 1}`,
    created_at: stamp(25 - i),
    updated_at: stamp(i % 4),
    company_id: mockCompany.id,
    product_id: product.id,
    product_name: product.name,
    quantity: 40 + i * 8,
    status,
    schedule_date: stamp(-(i - 1)).slice(0, 10),
    machine: machines[i % machines.length]!,
    owner: owners[i % owners.length]!,
  };
});

export const mockSchedules: ProductionSchedule[] = mockWorkOrders.map(
  (workOrder, index) => ({
    id: `schedule-${index + 1}`,
    created_at: stamp(20 - index),
    updated_at: stamp(index % 4),
    company_id: mockCompany.id,
    work_order_id: workOrder.id,
    machine_name: workOrder.machine,
    schedule_date: workOrder.schedule_date,
    shift: ["Morning", "Swing", "Night"][index % 3]!,
    capacity_percent: 55 + (index % 4) * 11,
    status: workOrder.status,
  }),
);

const supplierNames = [
  "Atlas Industrial Supply",
  "BluePeak Components",
  "ForgeLine Metals",
  "Helix Motion Parts",
  "Delta Control Systems",
];

export const mockSuppliers: Supplier[] = supplierNames.map((name, index) => ({
  id: `supplier-${index + 1}`,
  created_at: stamp(120 - index),
  updated_at: stamp(index % 7),
  company_id: mockCompany.id,
  name,
  contact_name: [
    "Emma Ross",
    "Liam Scott",
    "Sofia Hall",
    "Mason Clark",
    "Aria James",
  ][index]!,
  email: `procurement${index + 1}@vendor.example`,
  lead_time_days: 5 + index * 2,
  status: (["Preferred", "Approved", "Preferred", "Trial", "Approved"] as const)[
    index
  ]!,
}));

const customerNames = [
  "Summit Robotics",
  "Apex Packaging",
  "Nova Logistics",
  "Crest Energy",
  "Meridian Foods",
];

export const mockCustomers: Customer[] = customerNames.map((name, index) => ({
  id: `customer-${index + 1}`,
  created_at: stamp(110 - index),
  updated_at: stamp(index % 5),
  company_id: mockCompany.id,
  name,
  contact_name: [
    "James Fox",
    "Mia Allen",
    "Benjamin Ward",
    "Ella Kelly",
    "Jack Cook",
  ][index]!,
  email: `operations${index + 1}@customer.example`,
  region: ["Midwest", "West", "South", "East", "Central"][index]!,
}));

export const mockPurchaseOrders: PurchaseOrder[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `po-${index + 1}`,
    created_at: stamp(18 - index),
    updated_at: stamp(index % 3),
    company_id: mockCompany.id,
    supplier_id: mockSuppliers[index]!.id,
    supplier_name: mockSuppliers[index]!.name,
    order_number: `PO-2026-${110 + index}`,
    total_amount: 6200 + index * 1850,
    status: (["Pending", "Approved", "Received", "Pending", "Approved"] as const)[
      index
    ]!,
    expected_date: stamp(-(index + 2)).slice(0, 10),
    received_percent: [0, 20, 100, 0, 45][index]!,
  }),
);

export const mockSalesOrders: SalesOrder[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `so-${index + 1}`,
    created_at: stamp(16 - index),
    updated_at: stamp(index % 4),
    company_id: mockCompany.id,
    customer_id: mockCustomers[index % mockCustomers.length]!.id,
    customer_name: mockCustomers[index % mockCustomers.length]!.name,
    order_number: `SO-2026-${210 + index}`,
    total_amount: 12400 + index * 2200,
    status: (["Pending", "Packed", "Delivered"] as const)[index % 3]!,
    delivery_date: stamp(-(index + 1)).slice(0, 10),
    fulfillment_percent: [0, 55, 100, 20, 70, 100][index]!,
  }),
);

export const mockQualityInspections: QualityInspection[] = Array.from(
  { length: 8 },
  (_, index) => {
    const product = mockProducts[index];
    const result = (["Pass", "Pass", "Fail"] as const)[index % 3]!;

    return {
      id: `qc-${index + 1}`,
      created_at: stamp(14 - index),
      updated_at: stamp(index % 4),
      company_id: mockCompany.id,
      product_id: product.id,
      product_name: product.name,
      inspector: ["Riya Shah", "Daniel Long", "Priya Nair"][index % 3]!,
      result,
      notes:
        result === "Pass"
          ? "Dimensional and visual checks cleared for release."
          : "Surface finish variance detected. Hold and rework required.",
      inspected_at: stamp(index).slice(0, 10),
    };
  },
);

export const mockNotifications: Notification[] = [
  {
    id: "notification-1",
    created_at: stamp(1),
    updated_at: stamp(1),
    company_id: mockCompany.id,
    title: "Low stock alert",
    message: "Operator Console inventory dropped under reorder target.",
    severity: "warning",
    is_read: false,
  },
  {
    id: "notification-2",
    created_at: stamp(0),
    updated_at: stamp(0),
    company_id: mockCompany.id,
    title: "Machine nearing capacity",
    message: "Assembly Line 02 is scheduled at 88% capacity tomorrow.",
    severity: "warning",
    is_read: false,
  },
  {
    id: "notification-3",
    created_at: stamp(2),
    updated_at: stamp(2),
    company_id: mockCompany.id,
    title: "Receiving completed",
    message: "PO-2026-112 was fully received and posted to stock.",
    severity: "info",
    is_read: true,
  },
  {
    id: "notification-4",
    created_at: stamp(1),
    updated_at: stamp(1),
    company_id: mockCompany.id,
    title: "Quality hold",
    message: "Hydraulic Valve Pack failed final inspection and is on hold.",
    severity: "critical",
    is_read: false,
  },
];

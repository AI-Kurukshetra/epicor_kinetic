import fs from "node:fs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const DEMO_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

const envPath = fs.existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function seededUuid(seed: string) {
  const hash = createHash("sha256").update(seed).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function hashToInt(seed: string, mod: number) {
  const hash = createHash("sha256").update(seed).digest();
  return hash.readUInt32BE(0) % mod;
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next.toISOString().slice(0, 10);
}

async function seedERP() {
  const today = new Date();

  await supabase.from("companies").upsert(
    {
      id: DEMO_COMPANY_ID,
      name: "NextGen Manufacturing",
      industry: "Industrial Manufacturing",
      created_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  const productNames = [
    "Industrial Motor",
    "Hydraulic Pump",
    "Steel Bolt",
    "Control Panel",
    "Ball Bearing",
    "Aluminum Frame",
    "Gearbox Assembly",
    "Robotic Arm Module",
    "Sensor Unit",
    "Conveyor Belt",
    "Precision Gear",
    "Servo Drive",
    "Valve Manifold",
    "Heat Exchanger",
    "CNC Spindle",
    "Drive Shaft",
    "Actuator Arm",
    "Pressure Gauge",
    "Steel Bracket",
    "Copper Wiring Loom",
    "Cooling Fan Module",
    "Touch Display Unit",
    "Sealant Cartridge",
    "Composite Panel",
    "Fastener Pack",
    "Hydraulic Cylinder",
    "Laser Alignment Kit",
    "Pneumatic Fitting",
    "Automation Relay",
    "Packaging Module",
    "Industrial Gear",
    "Motor Assembly",
  ];

  const products = productNames.map((name, index) => {
    const sku = `NGM-${2000 + index}`;
    const price = 150 + hashToInt(name, 1900);
    return {
      id: seededUuid(`product:${sku}`),
      company_id: DEMO_COMPANY_ID,
      sku,
      name,
      description: `${name} configured for manufacturing operations.`,
      category: index % 2 === 0 ? "Mechanical" : "Electrical",
      unit: "ea",
      standard_cost: Math.round(price * 0.68),
      sales_price: price,
    };
  });

  const warehouses = ["Main Warehouse", "Factory Storage", "Distribution Center"];
  const inventory = products.flatMap((product) =>
    warehouses.map((warehouse) => {
      const quantity = 50 + hashToInt(`${product.sku}:${warehouse}`, 451);
      const reorderLevel = Math.max(40, Math.round(quantity * 0.3));
      return {
        id: seededUuid(`inventory:${product.id}:${warehouse}`),
        company_id: DEMO_COMPANY_ID,
        product_id: product.id,
        quantity,
        warehouse_location: warehouse,
        reorder_level: reorderLevel,
        unit_cost: product.standard_cost,
      };
    }),
  );

  const supplierNames = [
    "Global Metals Ltd",
    "Precision Parts Co",
    "SteelWorks International",
    "Advanced Robotics Parts",
    "Machinery Source",
    "Industrial Supply Hub",
    "Prime Components",
    "Automation Source",
    "Future Parts Ltd",
    "Mechanical Supply Co",
  ];

  const suppliers = supplierNames.map((name, index) => ({
    id: seededUuid(`supplier:${name}`),
    company_id: DEMO_COMPANY_ID,
    name,
    contact_name: [
      "Alex Morgan",
      "Jamie Lee",
      "Taylor Rivera",
      "Morgan Casey",
      "Riley Parker",
      "Jordan Quinn",
      "Casey Patel",
      "Avery Cole",
      "Cameron Shaw",
      "Jamie Bell",
    ][index]!,
    email: `contact${index + 1}@supplier.example`,
    lead_time_days: 4 + (index % 5) * 2,
    status: (["Preferred", "Approved", "Trial"] as const)[index % 3],
  }));

  const customerNames = [
    "Acme Manufacturing",
    "Future Robotics",
    "Atlas Engineering",
    "Titan Robotics",
    "Delta Machines",
    "Vertex Industrial",
    "NovaTech Industries",
    "Pioneer Automation",
    "Omega Fabrication",
    "IronForge Industries",
  ];

  const customers = customerNames.map((name, index) => ({
    id: seededUuid(`customer:${name}`),
    company_id: DEMO_COMPANY_ID,
    name,
    contact_name: [
      "Harper Lane",
      "Logan Price",
      "Quinn Morales",
      "Reese Evans",
      "Parker Hayes",
      "Skyler James",
      "Rowan Bell",
      "Charlie Watts",
      "Avery Knight",
      "Riley Cruz",
    ][index]!,
    email: `orders${index + 1}@customer.example`,
    region: ["Midwest", "West", "South", "East"][index % 4],
  }));

  const workOrders = Array.from({ length: 20 }, (_, index) => {
    const product = products[index % products.length]!;
    const quantity = 20 + hashToInt(`wo:${index}`, 180);
    const status = (["Planned", "In Production", "Completed"] as const)[
      index % 3
    ];
    return {
      id: seededUuid(`work-order:${product.id}:${index}`),
      company_id: DEMO_COMPANY_ID,
      product_id: product.id,
      quantity,
      status,
      schedule_date: addDays(today, 1 + hashToInt(`wo-date:${index}`, 30)),
      machine: ["Line A", "Line B", "Line C"][index % 3],
      owner: ["Production Lead", "Shift Supervisor", "Ops Manager"][index % 3],
    };
  });

  const purchaseOrders = Array.from({ length: 15 }, (_, index) => {
    const supplier = suppliers[index % suppliers.length]!;
    const status = (["Pending", "Ordered", "Received"] as const)[index % 3];
    const totalAmount = 1500 + hashToInt(`po:${index}`, 9000);
    const receivedPercent = status === "Received" ? 100 : status === "Ordered" ? 40 : 0;
    return {
      id: seededUuid(`purchase-order:${supplier.id}:${index}`),
      company_id: DEMO_COMPANY_ID,
      supplier_id: supplier.id,
      order_number: `PO-DEMO-${1200 + index}`,
      total_amount: totalAmount,
      status,
      expected_date: addDays(today, 3 + hashToInt(`po-date:${index}`, 25)),
      received_percent: receivedPercent,
    };
  });

  const salesOrders = Array.from({ length: 15 }, (_, index) => {
    const customer = customers[index % customers.length]!;
    const status = (["Pending", "Processing", "Shipped", "Delivered"] as const)[
      index % 4
    ];
    const totalAmount = 2800 + hashToInt(`so:${index}`, 12000);
    const fulfillment =
      status === "Delivered" ? 100 : status === "Shipped" ? 70 : status === "Processing" ? 40 : 10;
    return {
      id: seededUuid(`sales-order:${customer.id}:${index}`),
      company_id: DEMO_COMPANY_ID,
      customer_id: customer.id,
      order_number: `SO-DEMO-${2200 + index}`,
      total_amount: totalAmount,
      status,
      delivery_date: addDays(today, 2 + hashToInt(`so-date:${index}`, 28)),
      fulfillment_percent: fulfillment,
    };
  });

  await supabase.from("products").upsert(products, { onConflict: "id" });
  await supabase.from("inventory").upsert(inventory, { onConflict: "id" });
  await supabase.from("suppliers").upsert(suppliers, { onConflict: "id" });
  await supabase.from("customers").upsert(customers, { onConflict: "id" });
  await supabase.from("work_orders").upsert(workOrders, { onConflict: "id" });
  await supabase.from("purchase_orders").upsert(purchaseOrders, { onConflict: "id" });
  await supabase.from("sales_orders").upsert(salesOrders, { onConflict: "id" });

  await supabase.from("products").update({ company_id: DEMO_COMPANY_ID }).neq("company_id", DEMO_COMPANY_ID);
  await supabase.from("inventory").update({ company_id: DEMO_COMPANY_ID }).neq("company_id", DEMO_COMPANY_ID);
  await supabase.from("suppliers").update({ company_id: DEMO_COMPANY_ID }).neq("company_id", DEMO_COMPANY_ID);
  await supabase.from("customers").update({ company_id: DEMO_COMPANY_ID }).neq("company_id", DEMO_COMPANY_ID);
  await supabase.from("work_orders").update({ company_id: DEMO_COMPANY_ID }).neq("company_id", DEMO_COMPANY_ID);
  await supabase.from("purchase_orders").update({ company_id: DEMO_COMPANY_ID }).neq("company_id", DEMO_COMPANY_ID);
  await supabase.from("sales_orders").update({ company_id: DEMO_COMPANY_ID }).neq("company_id", DEMO_COMPANY_ID);

  console.log("ERP demo data seeded.");
}

seedERP().catch((error) => {
  console.error(error);
  process.exit(1);
});

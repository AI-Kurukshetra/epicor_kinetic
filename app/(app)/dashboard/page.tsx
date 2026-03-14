export const dynamic = "force-dynamic";

import { ArrowRight } from "lucide-react";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { AlertsPanel } from "@/components/shared/alerts-panel";
import { DashboardChartShell } from "@/components/shared/dashboard-chart-shell";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getDashboardSnapshot } from "@/services/erp";
import { getInventory } from "@/src/services/inventoryService";
import { getCustomers } from "@/src/services/customerService";
import { getProducts } from "@/src/services/productService";
import { getSuppliers } from "@/src/services/supplierService";
import { getWorkOrders } from "@/src/services/workOrderService";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();
  const [
    { data: products, error: productsError },
    { data: inventory, error: inventoryError },
    { data: suppliers, error: suppliersError },
    { data: customers, error: customersError },
    { data: workOrders, error: workOrdersError },
  ] =
    await Promise.all([
      getProducts(),
      getInventory(),
      getSuppliers(),
      getCustomers(),
      getWorkOrders(),
    ]);

  const hasError = Boolean(
    productsError ||
      inventoryError ||
      suppliersError ||
      customersError ||
      workOrdersError,
  );
  const activeWorkOrders = workOrders.filter(
    (order) => order.status === "In Production",
  ).length;

  return (
    <div className="space-y-6">
      <div className="surface subtle-grid overflow-hidden px-6 py-8">
        <PageHeader
          eyebrow="Operations"
          title="Manufacturing command center"
          description="Track production throughput, procurement readiness, inventory health, and quality alerts from one live dashboard."
          action={
            <Button asChild size="lg">
              <a href="/work-orders">
                Review work orders
                <ArrowRight className="size-4" />
              </a>
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total products"
          value={products.length}
          helper={
            hasError ? "Data unavailable. Check Supabase connection." : "Active SKUs in catalog"
          }
        />
        <KpiCard
          label="Total inventory"
          value={inventory.reduce((sum, item) => sum + item.quantity, 0)}
          helper={
            hasError ? "Data unavailable. Check Supabase connection." : "Units available across warehouses"
          }
        />
        <KpiCard
          label="Active work orders"
          value={activeWorkOrders}
          helper={
            hasError ? "Data unavailable. Check Supabase connection." : "Orders currently in production"
          }
        />
        <KpiCard
          label="Suppliers"
          value={suppliers.length}
          helper={
            hasError ? "Data unavailable. Check Supabase connection." : "Approved vendors in network"
          }
        />
        <KpiCard
          label="Customers"
          value={customers.length}
          helper={
            hasError ? "Data unavailable. Check Supabase connection." : "Active customer accounts"
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <DashboardChartShell data={snapshot.chart_data} />
        <AlertsPanel alerts={snapshot.alerts} />
      </div>

      <ActivityFeed items={snapshot.recent_activity} />
    </div>
  );
}

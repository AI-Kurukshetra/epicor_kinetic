export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getInventory } from "@/src/services/inventoryService";

export default async function InventoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: inventory, error } = await getInventory();
  const item = inventory.find((entry) => entry.id === id);

  if (!item || error) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory detail"
        title={item.product_name}
        description={`SKU ${item.sku} stored in ${item.warehouse_location}.`}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">On hand</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {item.quantity} {item.unit}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Reorder level</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{item.reorder_level}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Inventory value</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {formatCurrency(item.quantity * item.unit_cost)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={item.status} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="mt-1 font-medium">{item.category}</p>
          </div>
          <div className="rounded-2xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Warehouse location</p>
            <p className="mt-1 font-medium">{item.warehouse_location}</p>
          </div>
          <div className="rounded-2xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Unit cost</p>
            <p className="mt-1 font-medium">{formatCurrency(item.unit_cost)}</p>
          </div>
          <div className="rounded-2xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="mt-1 font-medium">{formatDate(item.updated_at, "MMM d, yyyy p")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

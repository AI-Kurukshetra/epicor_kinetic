export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { getInventory } from "@/src/services/inventoryService";

export default async function InventoryPage() {
  const { data: inventory, error } = await getInventory();
  const lowStock = inventory.filter((item) => item.status !== "Healthy").length;
  const inventoryValue = inventory.reduce(
    (sum, item) => sum + item.quantity * item.unit_cost,
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Inventory management"
        description="Track stock quantity, reorder thresholds, warehouse positions, and valuation across every SKU."
        action={
          <Button asChild>
            <Link href="/inventory/new">
              <Plus className="size-4" />
              New inventory item
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{inventory.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Inventory value</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {formatCurrency(inventoryValue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Low stock items</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{lowStock}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock ledger</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {inventory.length === 0 && !error ? (
            <div className="mb-4 rounded-2xl border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
              No inventory items found.
            </div>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reorder</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={`/inventory/${item.id}`} className="font-medium hover:text-primary">
                      {item.product_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.warehouse_location}</TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>{item.reorder_level}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>{formatCurrency(item.quantity * item.unit_cost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

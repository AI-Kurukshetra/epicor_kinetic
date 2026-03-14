export const dynamic = "force-dynamic";

import { createPurchaseOrderAction } from "@/app/actions";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { getPurchaseOrders } from "@/services/erp";
import { getSuppliers } from "@/src/services/supplierService";

export default async function PurchasesPage() {
  const [
    { data: suppliers, error: suppliersError },
    purchaseOrders,
  ] = await Promise.all([
    getSuppliers(),
    getPurchaseOrders(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Procurement"
        title="Purchase management"
        description="Manage approved vendors, purchase orders, and receiving progress across inbound supply."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create purchase order</CardTitle>
          </CardHeader>
          <CardContent>
            {suppliersError ? (
              <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {suppliersError}
              </div>
            ) : null}
            <form action={createPurchaseOrderAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supplierId">Supplier</Label>
                <select
                  id="supplierId"
                  name="supplierId"
                  className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select supplier
                  </option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Amount</Label>
                <Input id="totalAmount" name="totalAmount" type="number" min="1" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                  defaultValue="Pending"
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Received</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedDate">Expected date</Label>
                <Input id="expectedDate" name="expectedDate" type="date" required />
              </div>
              <SubmitButton className="w-full">Create purchase order</SubmitButton>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor directory</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {suppliers.length === 0 && !suppliersError ? (
                <div className="rounded-2xl border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
                  No suppliers found.
                </div>
              ) : null}
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="rounded-2xl border border-border/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-muted-foreground">{supplier.contact_name}</p>
                    </div>
                    <StatusBadge status={supplier.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Lead time {supplier.lead_time_days} days
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Receiving</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.supplier_name}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>{order.expected_date}</TableCell>
                      <TableCell>{order.received_percent}%</TableCell>
                      <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

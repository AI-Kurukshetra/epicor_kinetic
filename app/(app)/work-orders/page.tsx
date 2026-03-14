export const dynamic = "force-dynamic";

import { createWorkOrderAction } from "@/app/actions";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProducts } from "@/src/services/productService";
import { getWorkOrders } from "@/src/services/workOrderService";

export default async function WorkOrdersPage() {
  const [
    { data: products, error: productsError },
    { data: workOrders, error: workOrdersError },
  ] = await Promise.all([getProducts(), getWorkOrders()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Production"
        title="Work orders"
        description="Release new production jobs, allocate schedule dates, and track orders from planning through completion."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create work order</CardTitle>
          </CardHeader>
          <CardContent>
            {productsError ? (
              <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {productsError}
              </div>
            ) : null}
            <form action={createWorkOrderAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <select
                  id="productId"
                  name="productId"
                  className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select product
                  </option>
                  {products.slice(0, 10).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                  defaultValue="Planned"
                >
                  <option>Planned</option>
                  <option>In Production</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleDate">Schedule date</Label>
                <Input id="scheduleDate" name="scheduleDate" type="date" required />
              </div>
              <SubmitButton className="w-full">Create work order</SubmitButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open work orders</CardTitle>
          </CardHeader>
          <CardContent>
            {workOrdersError ? (
              <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {workOrdersError}
              </div>
            ) : null}
            {workOrders.length === 0 && !workOrdersError ? (
              <div className="mb-4 rounded-2xl border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
                No work orders found.
              </div>
            ) : null}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.product_name}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{order.schedule_date}</TableCell>
                    <TableCell>{order.machine}</TableCell>
                    <TableCell>{order.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

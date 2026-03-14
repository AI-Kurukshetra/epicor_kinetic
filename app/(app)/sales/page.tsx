export const dynamic = "force-dynamic";

import { createSalesOrderAction } from "@/app/actions";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { getSalesOrders } from "@/services/erp";
import { getCustomers } from "@/src/services/customerService";

export default async function SalesPage() {
  const [
    { data: customers, error: customersError },
    salesOrders,
  ] = await Promise.all([getCustomers(), getSalesOrders()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Revenue"
        title="Sales orders"
        description="Track customer commitments, order status, and delivery readiness with a lightweight commercial cockpit."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create sales order</CardTitle>
          </CardHeader>
          <CardContent>
            {customersError ? (
              <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {customersError}
              </div>
            ) : null}
            <form action={createSalesOrderAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer</Label>
                <select
                  id="customerId"
                  name="customerId"
                  className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select customer
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Order amount</Label>
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
                  <option>Packed</option>
                  <option>Delivered</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery date</Label>
                <Input id="deliveryDate" name="deliveryDate" type="date" required />
              </div>
              <SubmitButton className="w-full">Create sales order</SubmitButton>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer accounts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {customers.length === 0 && !customersError ? (
                <div className="rounded-2xl border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
                  No customers found.
                </div>
              ) : null}
              {customers.map((customer) => (
                <div key={customer.id} className="rounded-2xl border border-border/60 p-4">
                  <p className="font-medium">{customer.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{customer.contact_name}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{customer.region}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SO</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>{order.delivery_date}</TableCell>
                      <TableCell>{order.fulfillment_percent}%</TableCell>
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

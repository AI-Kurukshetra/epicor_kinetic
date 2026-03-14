export const dynamic = "force-dynamic";

import { createQualityInspectionAction } from "@/app/actions";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getQualityInspections } from "@/services/erp";
import { getProducts } from "@/src/services/productService";

export default async function QualityPage() {
  const [
    { data: products, error: productsError },
    inspections,
  ] = await Promise.all([getProducts(), getQualityInspections()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quality"
        title="Quality control"
        description="Record inspections, capture pass or fail outcomes, and keep a clean audit trail for manufacturing releases."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Log inspection</CardTitle>
          </CardHeader>
          <CardContent>
            {productsError ? (
              <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {productsError}
              </div>
            ) : null}
            <form action={createQualityInspectionAction} className="space-y-4">
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
                  {products.slice(0, 12).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <select
                  id="result"
                  name="result"
                  className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                  defaultValue="Pass"
                >
                  <option>Pass</option>
                  <option>Fail</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Inspection observations" required />
              </div>
              <SubmitButton className="w-full">Record inspection</SubmitButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inspection log</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell>{inspection.product_name}</TableCell>
                    <TableCell>{inspection.inspector}</TableCell>
                    <TableCell>
                      <StatusBadge status={inspection.result} />
                    </TableCell>
                    <TableCell className="max-w-sm text-muted-foreground">
                      {inspection.notes}
                    </TableCell>
                    <TableCell>{inspection.inspected_at}</TableCell>
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

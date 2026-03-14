import { createInventoryAction } from "@/app/actions";
import { PageHeader } from "@/components/shared/page-header";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewInventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Create inventory item"
        description="Add a new product SKU, starting stock, warehouse location, and reorder policy."
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Inventory setup</CardTitle>
          <CardDescription>
            This action creates the product master record and the initial inventory position.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createInventoryAction} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="productName">Product name</Label>
              <Input id="productName" name="productName" placeholder="Servo Motor Assembly" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" placeholder="NGM-2044" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="Motion" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Opening quantity</Label>
              <Input id="quantity" name="quantity" type="number" min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouseLocation">Warehouse location</Label>
              <Input id="warehouseLocation" name="warehouseLocation" placeholder="B-2-4" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder level</Label>
              <Input id="reorderLevel" name="reorderLevel" type="number" min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitCost">Unit cost</Label>
              <Input id="unitCost" name="unitCost" type="number" min="0" step="0.01" required />
            </div>
            <div className="md:col-span-2">
              <SubmitButton size="lg">Create inventory item</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

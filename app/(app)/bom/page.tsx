import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency } from "@/lib/utils";
import { getBomRows } from "@/services/erp";

export default async function BomPage() {
  const bomRows = await getBomRows();
  const assemblies = Array.from(new Set(bomRows.map((row) => row.parent_product_name)));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Engineering"
        title="Bill of materials"
        description="Manage multi-level product structures and understand component rollups before scheduling production."
      />

      <Tabs defaultValue={assemblies[0]}>
        <TabsList>
          {assemblies.map((assembly) => (
            <TabsTrigger key={assembly} value={assembly}>
              {assembly}
            </TabsTrigger>
          ))}
        </TabsList>
        {assemblies.map((assembly) => {
          const rows = bomRows.filter((row) => row.parent_product_name === assembly);
          const cost = rows.reduce((sum, row) => sum + row.rollup_cost, 0);
          return (
            <TabsContent key={assembly} value={assembly}>
              <Card>
                <CardHeader>
                  <CardTitle>{assembly}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-border/60 p-4">
                      <p className="text-sm text-muted-foreground">Components</p>
                      <p className="mt-1 text-2xl font-semibold">{rows.length}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 p-4">
                      <p className="text-sm text-muted-foreground">BOM rollup cost</p>
                      <p className="mt-1 text-2xl font-semibold">{formatCurrency(cost)}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 p-4">
                      <p className="text-sm text-muted-foreground">Levels</p>
                      <p className="mt-1 text-2xl font-semibold">
                        {Math.max(...rows.map((row) => row.level))}
                      </p>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit cost</TableHead>
                        <TableHead>Rollup</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className={row.level > 1 ? "pl-8" : ""}>
                            {row.component_name}
                          </TableCell>
                          <TableCell>{row.level}</TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell>{formatCurrency(row.unit_cost)}</TableCell>
                          <TableCell>{formatCurrency(row.rollup_cost)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import { getReportsSnapshot } from "@/services/erp";

export default async function ReportsPage() {
  const reports = await getReportsSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description="Monitor production throughput, stock exposure, and core financial performance with a concise executive summary."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Production summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Completed orders</p>
              <p className="mt-1 text-3xl font-semibold">
                {reports.production_summary.completed_orders}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Planned orders</p>
              <p className="mt-1 text-3xl font-semibold">
                {reports.production_summary.planned_orders}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Throughput units</p>
              <p className="mt-1 text-3xl font-semibold">
                {formatCompactNumber(reports.production_summary.throughput_units)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Inventory value</p>
              <p className="mt-1 text-3xl font-semibold">
                {formatCurrency(reports.inventory_report.inventory_value)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Low stock items</p>
              <p className="mt-1 text-3xl font-semibold">
                {reports.inventory_report.low_stock_items}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Critical stock items</p>
              <p className="mt-1 text-3xl font-semibold">
                {reports.inventory_report.critical_stock_items}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="mt-1 text-3xl font-semibold">
                {formatCurrency(reports.financial_overview.revenue)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Procurement spend</p>
              <p className="mt-1 text-3xl font-semibold">
                {formatCurrency(reports.financial_overview.procurement_spend)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Gross margin</p>
              <p className="mt-1 text-3xl font-semibold">
                {reports.financial_overview.gross_margin}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/types";

const DashboardChart = dynamic(
  () =>
    import("@/components/shared/dashboard-chart").then(
      (mod) => mod.DashboardChart,
    ),
  {
    ssr: false,
    loading: () => (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Operations flow</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <div className="h-full rounded-2xl bg-muted" />
        </CardContent>
      </Card>
    ),
  },
);

export function DashboardChartShell({ data }: { data: ChartPoint[] }) {
  return <DashboardChart data={data} />;
}

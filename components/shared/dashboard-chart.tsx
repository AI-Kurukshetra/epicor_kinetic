"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/types";

export function DashboardChart({ data }: { data: ChartPoint[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Operations flow</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                borderColor: "rgba(148,163,184,0.2)",
              }}
            />
            <Legend />
            <Bar dataKey="production" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="procurement" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sales" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

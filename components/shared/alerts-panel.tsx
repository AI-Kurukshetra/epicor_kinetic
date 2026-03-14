import { BellDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AlertItem } from "@/types";

export function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-border/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-accent p-2 text-accent-foreground">
                  <BellDot className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
              <StatusBadge status={alert.severity} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { ActivityItem } from "@/types";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-2xl border border-border/60 p-4">
            <div className="mt-0.5 rounded-2xl bg-secondary p-2 text-secondary-foreground">
              <Clock3 className="size-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
              <p className="text-xs text-muted-foreground">{formatDate(item.timestamp, "MMM d, p")}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <Card className="animate-enter-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold">{formatCompactNumber(value)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <ArrowUpRight className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

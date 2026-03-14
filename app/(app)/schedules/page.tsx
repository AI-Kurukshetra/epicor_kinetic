import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getSchedules } from "@/services/erp";

export default async function SchedulesPage() {
  const schedules = await getSchedules();
  const grouped = Object.entries(
    schedules.reduce<Record<string, typeof schedules>>((acc, schedule) => {
      acc[schedule.machine_name] ??= [];
      acc[schedule.machine_name].push(schedule);
      return acc;
    }, {}),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Planning"
        title="Production scheduling"
        description="Review capacity across cells and shifts with a simple production calendar for the week ahead."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {grouped.map(([machine, machineSchedules]) => (
          <Card key={machine}>
            <CardHeader>
              <CardTitle>{machine}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {machineSchedules.map((schedule) => (
                <div key={schedule.id} className="rounded-2xl border border-border/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{schedule.schedule_date}</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.shift} shift · Capacity {schedule.capacity_percent}%
                      </p>
                    </div>
                    <StatusBadge status={schedule.status} />
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${schedule.capacity_percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

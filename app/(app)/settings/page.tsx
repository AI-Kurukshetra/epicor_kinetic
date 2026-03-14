import { getCurrentUser, requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  requireRole(user, ["admin"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="Review role access, workspace posture, and the current deployment configuration."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Admin</p>
                  <p className="text-sm text-muted-foreground">
                    Full access to ERP, reporting, and configuration.
                  </p>
                </div>
                <Badge variant="outline">All modules</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Manager</p>
                  <p className="text-sm text-muted-foreground">
                    Operational access to planning, procurement, sales, and reporting.
                  </p>
                </div>
                <Badge variant="outline">Operational</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Worker</p>
                  <p className="text-sm text-muted-foreground">
                    Access to dashboard, inventory visibility, schedules, work orders, and quality.
                  </p>
                </div>
                <Badge variant="outline">Execution</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Authentication</p>
              <p className="mt-1 font-medium">
                {isSupabaseConfigured ? "Supabase configured" : "Demo mode active"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Current admin</p>
              <p className="mt-1 font-medium">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">Deployment target</p>
              <p className="mt-1 font-medium">Ready for Vercel</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

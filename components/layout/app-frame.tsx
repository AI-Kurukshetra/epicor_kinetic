"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types";

export function AppFrame({
  children,
  user,
  demoMode,
}: {
  children: ReactNode;
  user: UserProfile;
  demoMode: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
      <AppSidebar pathname={pathname} user={user} />
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <AppTopbar pathname={pathname} user={user} />
        {demoMode ? (
          <div className="surface flex items-center gap-3 px-4 py-4 text-sm">
            <div className="rounded-2xl bg-warning/15 p-2 text-warning">
              <AlertTriangle className="size-4" />
            </div>
            <div className="flex-1">
              Supabase environment variables are not configured. The workspace is
              running in seeded demo mode.
            </div>
            <Badge variant="warning">Demo mode</Badge>
          </div>
        ) : null}
        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
}

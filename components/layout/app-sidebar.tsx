import Link from "next/link";
import { Factory } from "lucide-react";
import { NAV_ITEMS } from "@/components/layout/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

export function AppSidebar({
  pathname,
  user,
  className,
}: {
  pathname: string;
  user: UserProfile;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 flex-col rounded-[32px] border border-border/70 bg-card/88 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex",
        className,
      )}
    >
      <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-background/70 p-4">
        <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
          <Factory className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">NextGen Manufacturing ERP</p>
          <p className="text-xs text-muted-foreground">Cloud operations workspace</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {NAV_ITEMS.filter((item) => item.roles.includes(user.role)).map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto rounded-3xl border border-border/60 bg-background/70 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="outline" className="capitalize">
            {user.role}
          </Badge>
        </div>
      </div>
    </aside>
  );
}

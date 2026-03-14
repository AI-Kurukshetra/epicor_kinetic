import { Bell, Search } from "lucide-react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserProfile } from "@/types";

export function AppTopbar({
  pathname,
  user,
}: {
  pathname: string;
  user: UserProfile;
}) {
  return (
    <div className="surface sticky top-4 z-20 flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <MobileNavigation pathname={pathname} user={user} />
        <div className="hidden items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 md:flex">
          <Search className="size-4 text-muted-foreground" />
          <Input
            placeholder="Search products, orders, suppliers"
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end">
        <div className="hidden items-center gap-2 md:flex">
          <Badge variant="outline" className="capitalize">
            {user.role}
          </Badge>
          <Badge variant="outline">Live ERP workspace</Badge>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="size-4" />
        </Button>
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </div>
  );
}

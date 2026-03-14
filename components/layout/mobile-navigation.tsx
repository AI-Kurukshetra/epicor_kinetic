"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { NAV_ITEMS } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserProfile } from "@/types";

export function MobileNavigation({
  pathname,
  user,
}: {
  pathname: string;
  user: UserProfile;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(92vw,420px)]">
        <DialogHeader>
          <DialogTitle>Navigate</DialogTitle>
          <DialogDescription>
            Production, procurement, quality, and planning in one place.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {NAV_ITEMS.filter((item) => item.roles.includes(user.role)).map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

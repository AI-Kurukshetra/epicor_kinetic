import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  CalendarRange,
  FileSpreadsheet,
  Gauge,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
    roles: ["admin", "manager", "worker"],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["admin", "manager", "worker"],
  },
  {
    title: "BOM",
    href: "/bom",
    icon: Boxes,
    roles: ["admin", "manager"],
  },
  {
    title: "Work Orders",
    href: "/work-orders",
    icon: Wrench,
    roles: ["admin", "manager", "worker"],
  },
  {
    title: "Schedules",
    href: "/schedules",
    icon: CalendarRange,
    roles: ["admin", "manager", "worker"],
  },
  {
    title: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
    roles: ["admin", "manager"],
  },
  {
    title: "Sales",
    href: "/sales",
    icon: Receipt,
    roles: ["admin", "manager"],
  },
  {
    title: "Quality",
    href: "/quality",
    icon: ShieldCheck,
    roles: ["admin", "manager", "worker"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileSpreadsheet,
    roles: ["admin", "manager"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

import { format } from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value: Date | string, pattern = "MMM d, yyyy") {
  return format(typeof value === "string" ? new Date(value) : value, pattern);
}

export function getStatusTone(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("completed") ||
    normalized.includes("healthy") ||
    normalized.includes("pass") ||
    normalized.includes("received") ||
    normalized.includes("delivered")
  ) {
    return "success";
  }

  if (
    normalized.includes("low") ||
    normalized.includes("pending") ||
    normalized.includes("planned") ||
    normalized.includes("packed")
  ) {
    return "warning";
  }

  if (
    normalized.includes("critical") ||
    normalized.includes("fail") ||
    normalized.includes("hold")
  ) {
    return "destructive";
  }

  return "default";
}

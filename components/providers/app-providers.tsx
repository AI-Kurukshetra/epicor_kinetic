"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster
        richColors
        theme="system"
        position="top-right"
        toastOptions={{
          className: "rounded-2xl border border-border bg-card text-card-foreground",
        }}
      />
    </ThemeProvider>
  );
}

import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="subtle-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/12 to-transparent" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}

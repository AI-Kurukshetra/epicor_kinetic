import type { ReactNode } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { AppFrame } from "@/components/layout/app-frame";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return <AppFrame user={user} demoMode={!isSupabaseConfigured}>{children}</AppFrame>;
}

import "server-only";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mockUsers } from "@/services/mock-data";
import { getProfileByUserId } from "@/services/erp";
import type { UserProfile, UserRole } from "@/types";

export async function maybeGetCurrentUser(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) {
    return mockUsers[0]!;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return getProfileByUserId(user.id, user.email ?? "");
}

export async function getCurrentUser() {
  const user = await maybeGetCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export function requireRole(user: UserProfile, allowedRoles: UserRole[]) {
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }
}

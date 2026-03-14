import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = loginSchema.parse(await request.json());

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

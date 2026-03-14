import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = signupSchema.parse(await request.json());

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, demo: true }, { status: 201 });
  }

  const supabase = await createSupabaseServerClient();
  const { error, data } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, user: data.user }, { status: 201 });
}

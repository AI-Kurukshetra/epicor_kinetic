import Link from "next/link";
import { redirect } from "next/navigation";
import { Factory } from "lucide-react";
import { signupAction } from "@/app/actions";
import { maybeGetCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SubmitButton } from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await maybeGetCurrentUser();
  const params = await searchParams;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="subtle-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/12 to-transparent" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg border-border/70 bg-card/92">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
                <Factory className="size-5" />
              </div>
              <div>
                <CardTitle>Create workspace</CardTitle>
                <CardDescription>Launch a modern manufacturing control tower.</CardDescription>
              </div>
            </div>
            {!isSupabaseConfigured ? (
              <div className="rounded-2xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                Supabase env vars are missing. Signup will route to the seeded demo workspace.
              </div>
            ) : null}
            {params.success ? (
              <div className="rounded-2xl border border-success/30 bg-success/10 p-3 text-sm text-success">
                Account created. You can now sign in.
              </div>
            ) : null}
            {params.error ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {decodeURIComponent(params.error)}
              </div>
            ) : null}
          </CardHeader>
          <CardContent>
            <form action={signupAction} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ops@company.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <SubmitButton className="w-full">Create workspace</SubmitButton>
            </form>
            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
              <span>Already have an account?</span>
              <Button variant="ghost" asChild className="px-0">
                <Link href="/login">Back to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

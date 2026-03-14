import { redirect } from "next/navigation";
import { maybeGetCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await maybeGetCurrentUser();
  redirect(user ? "/dashboard" : "/login");
}

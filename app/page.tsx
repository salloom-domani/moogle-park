import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  // in case of client component
  // const session = authClient.useSession();

  if (!session) {
    return redirect("/auth/login");
  }

  return redirect("/dashboard");
}

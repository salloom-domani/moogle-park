import LogoutBtn from "@/components/logout-btn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return redirect("/login");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/logo.svg"
        alt="Next.js logo"
        width={300}
        height={300}
        priority
      />

      <h1 className="text-4xl font-bold">Moogle Park</h1>
      <Avatar>
        <AvatarImage
          className="rounded-full"
          src={session.user.image ?? ""}
          alt="Profile"
          width={100}
          height={100}
        />
        <AvatarFallback>
          {session.user.name.charAt(0)}
          {session.user.name.charAt(1)}
        </AvatarFallback>
      </Avatar>
      <p className="text-2xl font-bold">Logged in as {session.user.name}</p>
      <LogoutBtn />
    </main>
  );
}

"use client";
import * as React from "react";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import { authClient } from "@/lib/auth-client";

export default function LogoutBtn() {
  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();

  function handleLogout() {
    startTransition(async () => {
      await authClient.signOut();
      router.replace("/auth/login");
    });
  }

  return (
    <Button className="btn btn-outline-primary" onClick={handleLogout}>
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

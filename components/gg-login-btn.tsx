"use client";

import React from "react";

import Image from "next/image";

import { authClient } from "@/lib/auth-client";

import { LoadingButton } from "@/components/ui/loading-button";

export default function GoogleLoginButton() {
  const [isPending, startTransition] = React.useTransition();

  function handleGoogleLogin() {
    startTransition(async () => {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      console.log(result);
    });
  }

  return (
    <LoadingButton
      variant="outline"
      className="w-full"
      loading={isPending}
      onClick={handleGoogleLogin}
    >
      <Image src="/google-logo.svg" alt="Google Logo" width={24} height={24} />
      Google
    </LoadingButton>
  );
}

"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function SwitchBtn() {
  const segment = useSelectedLayoutSegment();
  console.log(segment);
  return (
    <Link
      href={segment === "login" ? "/auth/register" : "/auth/login"}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 absolute right-4 top-4 md:right-8 md:top-8"
    >
      {segment === "login" ? "Sign up" : "Sign in"}
    </Link>
  );
}

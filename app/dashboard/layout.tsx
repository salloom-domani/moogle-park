// layout.tsx
import { getSession } from "@/lib/auth";
import DashboardLayout from "./dashboard-layout-comp";
import React from "react";

export default async function DashboardRootLayout({
                                                      children,
                                                  }: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    return <DashboardLayout session={session}>{children}</DashboardLayout>;
}

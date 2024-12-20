"use client";

import {AppSidebar} from "@/components/app-sidebar";
import {List, Grid} from "lucide-react";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import React from "react";
import {useViewMode, ViewModeProvider} from "@/hooks/use-view-mode";

function LayoutContent({children}: { children: React.ReactNode }) {
    const {viewMode, setViewMode} = useViewMode();

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "250px",
                } as React.CSSProperties
            }
        >
            <AppSidebar/>
            <SidebarInset>
                <header className="sticky top-0 flex justify-between items-center gap-4 border-b bg-background p-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md ${
                                viewMode === "list" ? "bg-primary text-white" : "hover:bg-muted"
                            }`}
                        >
                            <List className="w-5 h-5"/>
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md ${
                                viewMode === "grid" ? "bg-primary text-white" : "hover:bg-muted"
                            }`}
                        >
                            <Grid className="w-5 h-5"/>
                        </button>
                    </div>
                </header>
                <main className="p-4">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <ViewModeProvider>
            <LayoutContent>{children}</LayoutContent>
        </ViewModeProvider>
    );
}

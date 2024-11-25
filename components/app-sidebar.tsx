"use client";

import React from "react";
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import { Cloud, File, Inbox, Trash2, Plus } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
// import {Button} from "@/components/ui/button";
// import {createGroupAction} from "@/actions/group-action";

export function AppSidebar() {
    const searchParams = useSearchParams();
    // const selectedSegment = useSelectedLayoutSegment();
    const isActive = (view: string) => searchParams.get("view") === view;

    return (
        <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                            <a href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-border text-sidebar-primary-foreground">
                                    <Image
                                        src="/logo.svg"
                                        alt="Moogle Park logo"
                                        width={48}
                                        height={48}
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Moogle Park</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Create</SidebarGroupLabel>
                    <SidebarGroupContent className="px-1.5 md:px-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="bg-primary text-white w-[100px] h-[60px] rounded-2xl hover:bg-primary-hover">
                                {/*<Button className="w-[100px] h-[60px] flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"*/}
                                {/*// onClick={() => createGroupAction({}as any)}*/}
                                {/*>*/}
                                    <Plus className="w-5 h-5 " />
                                    New
                                {/*</Button>*/}
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => alert("Create New Folder")}>
                                    New Folder
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => alert("Create New File")}>
                                    New File
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent className="px-1.5 md:px-0">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className={`${
                                        isActive("groups")
                                            ? "bg-primary text-white pointer-events-none" 
                                            : "hover:bg-muted"
                                    }`}
                                >
                                    <a href="/dashboard?view=groups">
                                        <Inbox />
                                        <span>Groups</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className={`${
                                        isActive("files")
                                            ? "bg-primary text-white pointer-events-none"
                                            : "hover:bg-muted"
                                    }`}
                                >
                                    <a href="/dashboard?view=files">
                                        <File />
                                        <span>Files</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className={`${
                                        isActive("trash")
                                            ? "bg-primary text-white pointer-events-none"
                                            : "hover:bg-muted"
                                    }`}
                                >
                                    <a href="/dashboard?view=trash">
                                        <Trash2 />
                                        <span>Trash</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Storage</SidebarGroupLabel>
                    <SidebarGroupContent className="px-1.5 md:px-0">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Cloud />
                                    <Progress value={25} />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-4">User Profile Section</div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Cloud, Inbox, Trash2, Plus } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { AddFolderPopover } from "@/components/add-new-folder-popup";
// import {Button} from "@/components/ui/button";
// import {createGroupAction} from "@/actions/group-action";

type AppSidebarProps = {
  segment?: string;
  session: { user: { name: string; email: string; image?: string | null } } | null;
};

export function AppSidebar({ segment, session }: AppSidebarProps) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

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
                  <Plus className="w-5 h-5" />
                  New
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setPopoverOpen(true)}>
                  New Group
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
                    segment === "groups"
                      ? "bg-primary text-white pointer-events-none"
                      : "hover:bg-muted"
                  }`}
                >
                  <a href="/dashboard/groups">
                    <Inbox />
                    <span>Groups</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`${
                    segment === "trash"
                      ? "bg-primary text-white pointer-events-none"
                      : "hover:bg-muted"
                  }`}
                >
                  <a href="/dashboard/trash">
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
        <div className="flex items-center gap-4 p-4 rounded-lg">
          <Image
              src={session?.user.image || "/default-avatar.png"}
              alt="User Avatar"
              width={48}
              height={48}
              className="rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold">{session?.user.name}</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
      {isPopoverOpen && (
        <AddFolderPopover
          isOpen={isPopoverOpen}
          onCloseAction={() => setPopoverOpen(false)}
        />
      )}
    </Sidebar>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
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
};

export function AppSidebar({ segment }: AppSidebarProps) {
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
                    segment === "my-files"
                      ? "bg-primary text-white pointer-events-none"
                      : "hover:bg-muted"
                  }`}
                >
                  <a href="/dashboard/my-files">
                    <File />
                    <span>My Files</span>
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
        <div className="p-4">User Profile Section</div>
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

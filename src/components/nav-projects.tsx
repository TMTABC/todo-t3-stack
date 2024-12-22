"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { List, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname hook

const data = {
  projects: [
    {
      name: "Todos",
      url: "/",
      icon: List,
    },
    {
      name: "Kanban",
      url: "/kanban",
      icon: LayoutDashboard,
    },
  ],
};

export function NavProjects() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {data.projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className={
                  pathname === item.url ? "font-bold text-blue-500" : ""
                } 
              >
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

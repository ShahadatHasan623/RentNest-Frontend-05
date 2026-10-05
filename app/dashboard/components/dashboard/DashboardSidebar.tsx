"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

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

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { dashboardMenu } from "@/config/dashboardMenu";
import type { UserRole } from "@/config/dashboardMenu";
import LogoutButton from "@/_components/auth/LogoutButton";

interface DashboardSidebarProps {
  role: UserRole;
  user: {
    name: string;
    email: string;
  };
}

/* ---------- helpers ---------- */

const getInitials = (name?: string | null) => {
  if (!name) return "?";

  return (
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
};

/* ---------- main component ---------- */

const DashboardSidebar = ({ role, user }: DashboardSidebarProps) => {
  const pathname = usePathname();

  const menuItems = dashboardMenu[role];

  const roleLabel =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  return (
    <Sidebar collapsible="icon">
      {/* ================= Brand ================= */}
      <SidebarHeader className="border-b border-sidebar-border">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2 py-3 transition-opacity hover:opacity-80"
        >
          {/* gradient logo box */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/75 text-primary-foreground shadow-sm">
            <Home className="size-5" />
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-lg font-bold leading-tight tracking-tight">
              RentNest
            </p>
            <p className="truncate text-[11px] font-medium text-muted-foreground">
              Rental Management
            </p>
          </div>
        </Link>
      </SidebarHeader>

      {/* ================= Menu ================= */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabel} Panel</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="rounded-lg transition-all data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm"
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= User ================= */}
      <SidebarFooter className="border-t border-sidebar-border">
        {/* user card */}
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-2.5">
          <Avatar className="size-9 shrink-0 rounded-lg border">
            <AvatarFallback className="rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold leading-tight">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <LogoutButton />
      </SidebarFooter>

      {/* rail — edge e click/pinch korle collapse/expand */}
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
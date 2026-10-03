"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

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

const DashboardSidebar = ({
  role,
  user,
}: DashboardSidebarProps) => {
  const pathname = usePathname();

  const menuItems = dashboardMenu[role];

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-2 px-2 py-3 font-bold text-xl"
        >
          <Home className="h-6 w-6" />
          <span>RentNest</span>
        </Link>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role.charAt(0) + role.slice(1).toLowerCase()} Panel
          </SidebarGroupLabel>

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

      {/* User */}
      <SidebarFooter>
        <div className="px-2 py-2 text-sm">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-muted-foreground truncate">
            {user.email}
          </p>
        </div>

        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
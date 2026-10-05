"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, LogOut, Settings, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderBreadcrumb {
  label: string;
  href?: string;
}

interface HeaderUser {
  name: string;
  email: string;
  avatar?: string;
}

interface DashboardHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: HeaderBreadcrumb[];
  notificationCount?: number;
  user?: HeaderUser;
  children?: ReactNode;
}

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

const DashboardHeader = ({
  title,
  description,
  breadcrumbs,
  notificationCount = 0,
  user,
  children,
}: DashboardHeaderProps) => {
  const hasBreadcrumbs = !!breadcrumbs?.length;

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 md:px-6">
      <SidebarTrigger className="size-8 shrink-0 rounded-lg transition-colors hover:bg-muted" />

      <Separator orientation="vertical" className="!h-5" />

      {/* ============ Breadcrumbs (priority) / Title ============ */}
      {hasBreadcrumbs ? (
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="text-sm">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <BreadcrumbItem key={`${crumb.label}-${index}`}>
                  {isLast ? (
                    <BreadcrumbPage className="max-w-[160px] truncate font-semibold md:max-w-xs">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <>
                      {crumb.href ? (
                        <BreadcrumbLink asChild>
                          <Link
                            href={crumb.href}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <span className="text-muted-foreground">
                          {crumb.label}
                        </span>
                      )}

                      <BreadcrumbSeparator className="ml-1.5" />
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold tracking-tight md:text-lg">
            {title}
          </h1>

          {description && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      {/* ============ Right side ============ */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-2">
        {/* custom actions (children slot) */}
        {children}

        {/* notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-4" />

          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>

        {/* user dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2 rounded-lg px-1.5 md:px-2"
              >
                <Avatar className="size-7 rounded-lg border md:size-8">
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}

                  <AvatarFallback className="rounded-lg bg-primary text-[11px] font-semibold text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden max-w-[140px] truncate text-sm font-medium lg:inline">
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="font-normal">
                <p className="truncate text-sm font-semibold">{user.name}</p>

                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserRound className="size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
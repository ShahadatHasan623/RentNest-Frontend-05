"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Home,
  ClipboardList,
  CreditCard,
  Users,
  LogOut,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import LogoutButton from "@/app/(auth)/_components/LogoutButton";

const tenantItems = [
  {
    title: "Overview",
    href: "/dashboard/tenant",
    icon: LayoutDashboard,
  },
  {
    title: "My Requests",
    href: "/dashboard/tenant/requests",
    icon: ClipboardList,
  },
  {
    title: "Payments",
    href: "/dashboard/tenant/payments",
    icon: CreditCard,
  },
  {
    title: "Reviews",
    href: "/dashboard/tenant/reviews",
    icon: ClipboardList,
  },
];

const landlordItems = [
  {
    title: "Overview",
    href: "/dashboard/landlord",
    icon: LayoutDashboard,
  },
  {
    title: "My Properties",
    href: "/dashboard/landlord/properties",
    icon: Home,
  },
  {
    title: "Rental Requests",
    href: "/dashboard/landlord/requests",
    icon: ClipboardList,
  },
];

const adminItems = [
  {
    title: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Properties",
    href: "/dashboard/admin/properties",
    icon: Building2,
  },
  {
    title: "Requests",
    href: "/dashboard/admin/requests",
    icon: ClipboardList,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <aside className="hidden min-h-screen w-64 border-r bg-white md:block">
        <div className="p-6">Loading...</div>
      </aside>
    );
  }

  let items = tenantItems;

  if (user?.role === "LANDLORD") {
    items = landlordItems;
  }

  if (user?.role === "ADMIN") {
    items = adminItems;
  }

  return (
    <aside className="relative hidden min-h-screen w-64 border-r bg-white md:flex md:flex-col">
      {/* Logo */}
      <div className="border-b p-6">
        <Link href="/" className="text-2xl font-bold">
          RentNest
        </Link>
      </div>

      {/* User */}
      <div className="border-b px-6 py-4">
        <p className="font-medium">{user?.name}</p>

        <p className="text-sm text-muted-foreground">
          {user?.role}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
       <LogoutButton/>
      </div>
    </aside>
  );
}
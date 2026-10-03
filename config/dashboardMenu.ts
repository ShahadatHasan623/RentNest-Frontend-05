import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ClipboardList,
  CreditCard,
  Star,
  Users,
  ShieldCheck,
} from "lucide-react";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export const dashboardMenu = {
  TENANT: [
    {
      title: "Overview",
      href: "/dashboard/tenant",
      icon: LayoutDashboard,
    },
    {
      title: "Browse Properties",
      href: "/properties",
      icon: Building2,
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
      title: "My Reviews",
      href: "/dashboard/tenant/reviews",
      icon: Star,
    },
  ],

  LANDLORD: [
    {
      title: "Overview",
      href: "/dashboard/landlord",
      icon: LayoutDashboard,
    },
    {
      title: "My Properties",
      href: "/dashboard/landlord/properties",
      icon: Building2,
    },
    {
      title: "Add Property",
      href: "/dashboard/landlord/properties/new",
      icon: PlusCircle,
    },
    {
      title: "Rental Requests",
      href: "/dashboard/landlord/requests",
      icon: ClipboardList,
    },
  ],

  ADMIN: [
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
      title: "Rental Requests",
      href: "/dashboard/admin/requests",
      icon: ClipboardList,
    },
    {
      title: "Moderation",
      href: "/dashboard/admin/moderation",
      icon: ShieldCheck,
    },
  ],
};
// app/dashboard/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getMe } from "@/services/auth";
import DashboardSidebar from "./components/dashboard/DashboardSidebar";
import DashboardHeader from "./components/dashboard/DashboardHeader";


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // auth guard — login na thakle redirect
  const user = await getMe();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar
        role={user.role}
        user={{ name: user.name, email: user.email }}
      />

      <SidebarInset>
        <DashboardHeader
          title="Dashboard"
          notificationCount={0}
          user={{ name: user.name, email: user.email }}
        />

        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
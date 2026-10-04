import { redirect } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";



import { getMe } from "@/services/auth";
import DashboardSidebar from "./components/dashboard/DashboardSidebar";
import DashboardHeader from "./components/dashboard/DashboardHeader";


const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar
          role={user.role}
          user={{
            name: user.name,
            email: user.email,
          }}
        />

        <SidebarInset>
          <DashboardHeader
            title={`${user.role.charAt(0)}${user.role.slice(1).toLowerCase()} Dashboard`}
          />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
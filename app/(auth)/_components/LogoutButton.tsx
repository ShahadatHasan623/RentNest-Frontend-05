"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "../_actions/logout";
import { toast } from "sonner";



const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      router.push("/login");
      router.refresh();
      toast.success("Logged out successfully");
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
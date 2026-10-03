"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { updateUserStatusAction } from "@/app/dashboard/admin/users/_actions/userActions";

interface UserStatusButtonProps {
  id: string;
  activeStatus: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

const UserStatusButton = ({
  id,
  activeStatus,
}: UserStatusButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const nextStatus =
    activeStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

  const handleStatusChange = () => {
    startTransition(async () => {
      const result = await updateUserStatusAction(
        id,
        nextStatus
      );

      if (!result?.success) {
        toast.error(
          result?.message || "Failed to update status"
        );
        return;
      }

      toast.success(
        nextStatus === "BLOCKED"
          ? "User blocked successfully"
          : "User unblocked successfully"
      );

      router.refresh();
    });
  };

  return (
    <Button
      size="sm"
      variant={
        activeStatus === "ACTIVE"
          ? "destructive"
          : "default"
      }
      disabled={isPending}
      onClick={handleStatusChange}
    >
      {isPending
        ? "Updating..."
        : activeStatus === "ACTIVE"
          ? "Block"
          : "Unblock"}
    </Button>
  );
};

export default UserStatusButton;
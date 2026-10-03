
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateRentalStatusAction } from "@/app/dashboard/landlord/_actions/rentalActions";



interface RentalRequestActionsProps {
  id: string;
}

const RentalRequestActions = ({
  id,
}: RentalRequestActionsProps) => {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const handleStatusUpdate = (
    status: "APPROVED" | "REJECTED"
  ) => {
    startTransition(async () => {
      const result =
        await updateRentalStatusAction(
          id,
          status
        );

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Failed to update status"
        );
        return;
      }

      toast.success(
        `Request ${status.toLowerCase()} successfully`
      );

      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() =>
          handleStatusUpdate("APPROVED")
        }
        disabled={isPending}
      >
        {isPending
          ? "Updating..."
          : "Approve"}
      </Button>

      <Button
        size="sm"
        variant="destructive"
        onClick={() =>
          handleStatusUpdate("REJECTED")
        }
        disabled={isPending}
      >
        Reject
      </Button>
    </div>
  );
};

export default RentalRequestActions;


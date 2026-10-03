
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateRentalStatusAction } from "@/app/dashboard/landlord/_actions/rentalActions";



interface RentalStatusButtonProps {
  id: string;
  status: string;
}

const RentalStatusButton = ({
  id,
  status,
}: RentalStatusButtonProps) => {
  const [isPending, startTransition] =
    useTransition();

  const router = useRouter();

  if (status !== "ACTIVE") {
    return null;
  }

  const handleComplete = () => {
    startTransition(async () => {
      const result =
        await updateRentalStatusAction(
          id,
          "COMPLETED"
        );

      console.log(
        "COMPLETE RENTAL RESULT:",
        result
      );

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Failed to complete rental"
        );
        return;
      }

      toast.success(
        "Rental completed successfully"
      );

      router.refresh();
    });
  };

  return (
    <Button
      size="sm"
      onClick={handleComplete}
      disabled={isPending}
    >
      {isPending
        ? "Completing..."
        : "Complete Rental"}
    </Button>
  );
};

export default RentalStatusButton;

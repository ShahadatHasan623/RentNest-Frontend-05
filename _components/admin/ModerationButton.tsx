"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { moderateProperty } from "@/app/dashboard/admin/moderation/actions";

interface ModerationButtonProps {
  propertyId: string;
  status: "APPROVED" | "REJECTED";
}

const ModerationButton = ({
  propertyId,
  status,
}: ModerationButtonProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleModeration = async () => {
    try {
      setLoading(true);

      const result = await moderateProperty(
        propertyId,
        status
      );

      console.log("MODERATION RESULT:", result);

      if (result?.success) {
        router.refresh();
      }
    } catch (error) {
      console.error(
        "MODERATION ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleModeration}
      disabled={loading}
      variant={
        status === "APPROVED"
          ? "default"
          : "destructive"
      }
    >
      {loading
        ? "Processing..."
        : status === "APPROVED"
        ? "Approve"
        : "Reject"}
    </Button>
  );
};

export default ModerationButton;
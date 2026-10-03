"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { createPaymentAction } from "@/app/dashboard/tenant/requests/_actions/paymentActions";

interface PaymentButtonProps {
  rentalRequestId: string;
}

const PaymentButton = ({
  rentalRequestId,
}: PaymentButtonProps) => {
  const [isPending, startTransition] =
    useTransition();

  const handlePayment = () => {
    startTransition(async () => {
      const result =
        await createPaymentAction(
          rentalRequestId
        );

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Failed to create payment"
        );
        return;
      }

      const checkoutUrl =
        result?.data?.checkoutUrl;

      if (!checkoutUrl) {
        toast.error(
          "Payment checkout URL not found"
        );
        return;
      }

      window.location.href = checkoutUrl;
    });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isPending}
      className="w-full"
    >
      {isPending
        ? "Creating Checkout..."
        : "Proceed to Payment"}
    </Button>
  );
};

export default PaymentButton;

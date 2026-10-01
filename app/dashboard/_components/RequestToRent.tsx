/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/src/hooks/useAuth";
import { createRentalRequest } from "@/src/services/rental.service";

interface Props {
  propertyId: string;
  propertyTitle: string;
  isAvailable: boolean;
}

export default function RequestToRent({
  propertyId,
  propertyTitle,
  isAvailable,
}: Props) {
  const router = useRouter();

  const { user, isLoading } = useAuth();

  const [startDate, setStartDate] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [open, setOpen] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const handleOpen = () => {
    if (!user) {
      router.push(
        `/auth/login?redirect=/properties/${propertyId}`
      );

      return;
    }

    if (user.role !== "TENANT") {
      toast.error(
        "Only tenants can request a property."
      );

      return;
    }

    setOpen(true);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!startDate) {
      toast.error(
        "Please select your preferred start date."
      );

      return;
    }

    try {
      setSubmitting(true);

      await createRentalRequest({
        propertyId,
        startDate,
        message,
      });

      toast.success(
        "Rental request submitted successfully!"
      );

      setOpen(false);

      setStartDate("");
      setMessage("");

      router.push(
        "/dashboard/tenant/requests"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit rental request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAvailable) {
    return (
      <Button
        disabled
        className="w-full"
      >
        Currently Unavailable
      </Button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full"
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            handleOpen();
          }}
        >
          Request to Rent
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Request to Rent
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <p className="text-sm text-muted-foreground">
              Property
            </p>

            <p className="font-semibold">
              {propertyTitle}
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Preferred Start Date
            </Label>

            <input
              type="date"
              value={startDate}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Message
            </Label>

            <Textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Tell the landlord something about your rental request..."
              rows={5}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
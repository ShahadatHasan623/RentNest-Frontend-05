"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RentalRequest } from "@/types/rental";



interface RequestCardProps {
  request: RentalRequest;
}

const RequestCard = ({
  request,
}: RequestCardProps) => {
  const [isPending, startTransition] =
    useTransition();

  const handleStatus = (
    status: "APPROVED" | "REJECTED"
  ) => {
    startTransition(async () => {
   
      console.log(
        "UPDATE REQUEST:",
        request.id,
        status
      );

      toast.success(
        `Request ${status.toLowerCase()}`
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {request.property?.title ||
            "Property"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Tenant
          </p>

          <p className="font-medium">
            {request.tenant?.name ||
              "Unknown Tenant"}
          </p>

          <p className="text-sm text-muted-foreground">
            {request.tenant?.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Property
          </p>

          <p>
            {request.property?.location ||
              "Location unavailable"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Rent
          </p>

          <p className="font-semibold">
            ৳{request.property?.rent ?? 0}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <span className="font-medium">
            {request.status}
          </span>
        </div>

        {request.message && (
          <div>
            <p className="text-sm text-muted-foreground">
              Message
            </p>

            <p>{request.message}</p>
          </div>
        )}

        {request.status === "PENDING" && (
          <div className="flex gap-3">
            <Button
              onClick={() =>
                handleStatus("APPROVED")
              }
              disabled={isPending}
            >
              Approve
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                handleStatus("REJECTED")
              }
              disabled={isPending}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestCard;
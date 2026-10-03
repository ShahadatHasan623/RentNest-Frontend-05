import Link from "next/link";
import { notFound } from "next/navigation";

import { getRentalById } from "@/services/rentals";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RentalDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const RentalDetailsPage = async ({
  params,
}: RentalDetailsPageProps) => {
  const { id } = await params;

  const rental = await getRentalById(id);

  if (!rental) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Rental Request Details
          </h1>

          <p className="text-muted-foreground">
            View your rental request information.
          </p>
        </div>

        <Badge variant="outline">
          {rental.status}
        </Badge>
      </div>

      {/* Property */}
      <Card>
        <CardHeader>
          <CardTitle>
            Property Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Property
            </p>

            <p className="font-semibold">
              {rental.property?.title || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Location
            </p>

            <p>
              {rental.property?.location || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Monthly Rent
            </p>

            <p className="font-semibold">
              ৳{rental.property?.rent ?? "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rental Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Rental Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Move-in Date
            </p>

            <p>
              {new Date(
                rental.moveInDate
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Duration
            </p>

            <p>
              {rental.duration} months
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <Badge>
              {rental.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          variant="outline"
          className="flex-1"
        >
          <Link href="/dashboard/tenant/requests">
            Back to Requests
          </Link>
        </Button>

        {rental.status === "APPROVED" && (
          <Button
            asChild
            className="flex-1"
          >
            <Link
              href={`/dashboard/tenant/requests/${rental.id}/pay`}
            >
              Pay Now
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RentalDetailsPage;

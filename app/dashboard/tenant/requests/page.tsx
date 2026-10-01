"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMyRentalRequests } from "@/src/services/rental.service";

export default function TenantRequestsPage() {
  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-rental-requests"],
    queryFn: getMyRentalRequests,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        Loading rental requests...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load requests
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          My Rental Requests
        </h1>

        <p className="text-muted-foreground">
          Track all your property rental requests.
        </p>
      </div>

      {!requests.length ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">
            No rental requests yet
          </h2>

          <p className="mt-2 text-muted-foreground">
            Find a property and send your first
            rental request.
          </p>

          <Button
            asChild
            className="mt-5"
          >
            <Link href="/properties">
              Browse Properties
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border bg-white p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {request.property?.title ||
                      "Rental Property"}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {request.property?.location}
                  </p>

                  {request.startDate && (
                    <p className="mt-2 text-sm">
                      Start Date:{" "}
                      <strong>
                        {new Date(
                          request.startDate
                        ).toLocaleDateString()}
                      </strong>
                    </p>
                  )}
                </div>

                <Badge
                  variant={
                    request.status === "REJECTED"
                      ? "destructive"
                      : "default"
                  }
                >
                  {request.status}
                </Badge>
              </div>

              {request.status === "APPROVED" && (
                <div className="mt-5 border-t pt-4">
                  <Button asChild>
                    <Link
                      href={`/dashboard/tenant/requests/${request.id}/pay`}
                    >
                      Proceed to Payment
                    </Link>
                  </Button>
                </div>
              )}

              {request.status === "ACTIVE" && (
                <div className="mt-5 border-t pt-4">
                  <Button asChild>
                    <Link
                      href={`/dashboard/tenant/reviews?requestId=${request.id}`}
                    >
                      Leave Review
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
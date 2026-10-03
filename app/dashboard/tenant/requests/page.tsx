import Link from "next/link";

import { getMyRentals } from "@/services/rentals";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default";

    case "REJECTED":
      return "destructive";

    case "ACTIVE":
      return "default";

    case "COMPLETED":
      return "secondary";

    default:
      return "outline";
  }
};

const TenantRequestsPage = async () => {
  const rentals = await getMyRentals();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          My Rental Requests
        </h1>

        <p className="text-muted-foreground">
          View and manage your rental requests.
        </p>
      </div>

      {rentals.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              You have no rental requests yet.
            </p>

            <Button asChild className="mt-4">
              <Link href="/properties">
                Browse Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rentals.map((rental) => (
            <Card key={rental.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="line-clamp-2">
                    {rental.property?.title ||
                      "Property"}
                  </CardTitle>

                  <Badge
                    variant={getStatusVariant(
                      rental.status
                    )}
                  >
                    {rental.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Location
                  </p>

                  <p>
                    {rental.property?.location ||
                      "N/A"}
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

                <div className="flex gap-2 pt-2">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                  >
                    <Link
                      href={`/dashboard/tenant/requests/${rental.id}`}
                    >
                      View
                    </Link>
                  </Button>

                  {rental.status === "APPROVED" && (
                    <Button asChild className="flex-1">
                      <Link
                        href={`/dashboard/tenant/requests/${rental.id}/pay`}
                      >
                        Pay Now
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantRequestsPage;



import { getLandlordRequests } from "@/services/rentals";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import RentalRequestActions from "@/_components/landlord/RentalRequestActions";

const LandlordRequestsPage = async () => {
  const requests = await getLandlordRequests();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Rental Requests
        </h1>

        <p className="text-muted-foreground">
          Manage tenant rental requests.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              No rental requests found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="line-clamp-2">
                    {request.property?.title ||
                      "Property"}
                  </CardTitle>

                  <Badge variant="outline">
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tenant ID
                  </p>

                  <p className="break-all text-sm">
                    {request.tenantId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Property
                  </p>

                  <p>
                    {request.property?.title ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Move-in Date
                  </p>

                  <p>
                    {new Date(
                      request.moveInDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Duration
                  </p>

                  <p>
                    {request.duration} months
                  </p>
                </div>

                {request.status === "PENDING" && (
                  <RentalRequestActions
                    id={request.id}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandlordRequestsPage;


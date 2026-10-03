import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLandlordRequestsAction } from "./requests/_actions/requestActions";
import { getMyProperties } from "@/services/landlordProperties";



const LandlordDashboardPage = async () => {
  const [properties, requests] = await Promise.all([
    getMyProperties(),
    getLandlordRequestsAction(),
  ]);

  const availableProperties = properties.filter(
    (property) => property.available
  ).length;

  const unavailableProperties = properties.filter(
    (property) => !property.available
  ).length;

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING"
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === "APPROVED"
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === "REJECTED"
  ).length;

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
    },
    {
      title: "Available",
      value: availableProperties,
    },
    {
      title: "Unavailable",
      value: unavailableProperties,
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
    },
    {
      title: "Approved Requests",
      value: approvedRequests,
    },
    {
      title: "Rejected Requests",
      value: rejectedRequests,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Landlord Dashboard
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage your properties and rental requests.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            Add Property
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard/landlord/properties">
              My Properties
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard/landlord/properties/new">
              Add Property
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard/landlord/requests">
              Rental Requests
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Recent Rental Requests</CardTitle>

            {requests.length > 0 && (
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/landlord/requests">
                  View All
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {requests.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No rental requests yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">
                      {request.property?.title ||
                        "Rental Property"}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Tenant ID: {request.tenantId}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Move-in:{" "}
                      {new Date(
                        request.moveInDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border px-3 py-1 text-xs font-medium">
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Property Summary</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Properties
            </p>

            <p className="text-2xl font-bold">
              {properties.length}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Available Properties
            </p>

            <p className="text-2xl font-bold">
              {availableProperties}
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/dashboard/landlord/properties">
              Manage Properties
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandlordDashboardPage;
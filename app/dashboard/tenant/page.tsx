import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getMyRentals } from "@/services/rentals";
import { getMyPayments } from "@/services/payments";

const TenantDashboardPage = async () => {
  const [rentals, payments] = await Promise.all([
    getMyRentals(),
    getMyPayments(),
  ]);

  const pendingRentals = rentals.filter(
    (rental) => rental.status === "PENDING"
  ).length;

  const approvedRentals = rentals.filter(
    (rental) => rental.status === "APPROVED"
  ).length;

  const activeRentals = rentals.filter(
    (rental) => rental.status === "ACTIVE"
  ).length;

  const completedRentals = rentals.filter(
    (rental) => rental.status === "COMPLETED"
  ).length;

  const completedPayments = payments.filter(
    (payment) => payment.status === "COMPLETED"
  );

  const totalPaid = completedPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const stats = [
    {
      title: "Total Requests",
      value: rentals.length,
    },
    {
      title: "Pending",
      value: pendingRentals,
    },
    {
      title: "Approved",
      value: approvedRentals,
    },
    {
      title: "Active Rentals",
      value: activeRentals,
    },
    {
      title: "Completed",
      value: completedRentals,
    },
    {
      title: "Total Payments",
      value: payments.length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Tenant Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage your rental requests and payments.
        </p>
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

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Completed Payments
            </p>

            <p className="text-2xl font-bold">
              {completedPayments.length}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Total Paid
            </p>

            <p className="text-2xl font-bold">
              ${totalPaid.toFixed(2)}
            </p>
          </div>

          <Button asChild>
            <Link href="/dashboard/tenant/payments">
              View Payments
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rental Requests</CardTitle>
        </CardHeader>

        <CardContent>
          {rentals.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">
                You have no rental requests yet.
              </p>

              <Button asChild className="mt-4">
                <Link href="/properties">
                  Browse Properties
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {rentals.slice(0, 5).map((rental) => (
                <div
                  key={rental.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">
                      {rental.property?.title ||
                        "Rental Property"}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {rental.property?.location || "Location unavailable"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border px-3 py-1 text-xs font-medium">
                      {rental.status}
                    </span>

                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/dashboard/tenant/requests/${rental.id}`}
                      >
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {rentals.length > 5 && (
            <Button
              asChild
              variant="outline"
              className="mt-5 w-full"
            >
              <Link href="/dashboard/tenant/requests">
                View All Requests
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDashboardPage;
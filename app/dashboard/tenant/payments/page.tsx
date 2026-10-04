import { getMyPayments } from "@/services/payments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";


const TenantPaymentsPage = async () => {
  const payments = await getMyPayments();

  return (

    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">
          View all your rental payments.
        </p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              No payment history found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>
                    {payment.rentalRequest?.property?.title ||
                      "Rental Property"}
                  </CardTitle>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${payment.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : payment.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">
                    ${payment.amount}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Method</p>
                  <p className="font-semibold">
                    {payment.method}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-semibold">
                    {payment.provider}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="break-all font-mono text-sm">
                    {payment.transactionId || "N/A"}
                  </p>
                </div>

                {payment.paidAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Paid At
                    </p>
                    <p className="font-semibold">
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">
                    Location
                  </p>
                  <p className="font-semibold">
                    {payment.rentalRequest?.property?.location ||
                      "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantPaymentsPage;
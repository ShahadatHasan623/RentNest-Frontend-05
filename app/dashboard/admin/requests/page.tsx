import {
  getAdminRentalRequests,
} from "@/services/rentals";

const AdminRentalRequestsPage = async () => {
  const rentals = await getAdminRentalRequests();
  console.log("ADMIN RENTAL REQUESTS:", rentals);

  const pending = rentals.filter(
    (item) => item.status === "PENDING"
  ).length;

  const approved = rentals.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejected = rentals.filter(
    (item) => item.status === "REJECTED"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Rental Requests
        </h1>

        <p className="text-muted-foreground">
          Monitor all rental requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Total
          </p>

          <p className="mt-2 text-3xl font-bold">
            {rentals.length}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pending}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Approved
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {approved}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Rejected
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {rejected}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">
                Property
              </th>

              <th className="px-4 py-3 text-left">
                Tenant
              </th>

              <th className="px-4 py-3 text-left">
                Landlord
              </th>

              <th className="px-4 py-3 text-left">
                Move In
              </th>

              <th className="px-4 py-3 text-left">
                Duration
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rentals.map((rental) => (
              <tr
                key={rental.id}
                className="border-b last:border-0"
              >
                <td className="px-4 py-4">
                  {rental.property?.title ||
                    "Unknown Property"}
                </td>

                <td className="px-4 py-4">
                  <p>
                    {rental.tenant?.name ||
                      "Unknown"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {rental.tenant?.email || "-"}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <p>
                    {rental.landlord?.name ||
                      "Unknown"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {rental.landlord?.email || "-"}
                  </p>
                </td>

                <td className="px-4 py-4">
                  {new Date(
                    rental.moveInDate
                  ).toLocaleDateString()}
                </td>

                <td className="px-4 py-4">
                  {rental.duration} month
                  {rental.duration > 1 ? "s" : ""}
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">
                    {rental.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRentalRequestsPage;
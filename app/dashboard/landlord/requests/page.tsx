import RequestCard from "./_components/RequestCard";
import { getLandlordRequests } from "@/services/landlordRequests";

const LandlordRequestsPage = async () => {
  const requests =
    await getLandlordRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Rental Requests
        </h1>

        <p className="text-muted-foreground">
          Manage rental requests from tenants.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="font-semibold">
            No rental requests
          </h2>

          <p className="text-sm text-muted-foreground">
            You don&rsquo;t have any rental requests yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LandlordRequestsPage;
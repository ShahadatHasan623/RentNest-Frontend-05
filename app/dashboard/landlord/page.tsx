import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandlordDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Landlord Dashboard
        </h1>

        <p className="text-muted-foreground">
          Manage your properties and rental requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Properties</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requests</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              ৳0
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
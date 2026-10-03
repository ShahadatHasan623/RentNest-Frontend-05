import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const AdminDashboardPage = () => {
  const stats = [
    {
      title: "Total Users",
      value: 0,
    },
    {
      title: "Tenants",
      value: 0,
    },
    {
      title: "Landlords",
      value: 0,
    },
    {
      title: "Pending Properties",
      value: 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage users, properties and platform activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Management */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View users and manage their account status.
            </p>

            <Button asChild>
              <Link href="/dashboard/admin/users">
                Manage Users
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Moderation</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review and manage properties submitted by landlords.
            </p>

            <Button asChild>
              <Link href="/dashboard/admin/properties">
                Manage Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard/admin/users">
              Users
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard/admin/properties">
              Properties
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
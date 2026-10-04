import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";

import { getAllUsersForDashboard } from "@/services/users";

const AdminDashboardPage = async () => {
  const users = await getAllUsersForDashboard();

  console.log("ADMIN DASHBOARD USERS:", users);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.activeStatus === "ACTIVE"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.activeStatus === "BLOCKED"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.activeStatus === "INACTIVE"
  ).length;

  const landlords = users.filter(
    (user) => user.role === "LANDLORD"
  ).length;

  const tenants = users.filter(
    (user) => user.role === "TENANT"
  ).length;

  const admins = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage users and monitor the RentNest platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={
            <Users className="h-5 w-5" />
          }
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={
            <UserCheck className="h-5 w-5" />
          }
        />

        <StatCard
          title="Blocked Users"
          value={blockedUsers}
          icon={
            <UserX className="h-5 w-5" />
          }
        />

        <StatCard
          title="Landlords"
          value={landlords}
          icon={
            <ShieldCheck className="h-5 w-5" />
          }
        />

      </div>

      {/* User Overview */}
      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">
            User Overview
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Tenants
              </span>

              <span className="font-semibold">
                {tenants}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Landlords
              </span>

              <span className="font-semibold">
                {landlords}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Admins
              </span>

              <span className="font-semibold">
                {admins}
              </span>
            </div>

          </div>
        </div>

        {/* Account Status */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">
            Account Status
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Active
              </span>

              <span className="font-semibold text-green-600">
                {activeUsers}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Blocked
              </span>

              <span className="font-semibold text-red-600">
                {blockedUsers}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Inactive
              </span>

              <span className="font-semibold text-yellow-600">
                {inactiveUsers}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl border p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <div className="rounded-lg bg-muted p-2">
          {icon}
        </div>

      </div>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
};

export default AdminDashboardPage;
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Home,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserRound,
  UserX,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getAllUsersForDashboard } from "@/services/users";

/* ---------- helpers ---------- */

const countBy = <T,>(items: T[], key: keyof T, value: string) =>
  items.filter((item) => item[key] === value).length;

/* ---------- small components ---------- */

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  accent: string;
}

const StatCard = ({ title, value, icon: Icon, accent }: StatCardProps) => (
  <Card className="rounded-2xl border-border/70 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <CardContent className="flex items-center gap-4 p-5">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
      >
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-muted-foreground">
          {title}
        </p>

        <p className="text-2xl font-bold leading-tight tracking-tight">
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);

/* ---------- distribution row (label + bar + value) ---------- */

const DistributionRow = ({
  label,
  value,
  total,
  barColor,
  icon: Icon,
}: {
  label: string;
  value: number;
  total: number;
  barColor: string;
  icon: LucideIcon;
}) => {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          <Icon className="size-4 text-muted-foreground" />
          {label}
        </span>

        <span className="flex items-center gap-2">
          <span className="font-semibold">{value}</span>

          <span className="w-9 text-right text-xs text-muted-foreground">
            {percentage}%
          </span>
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/* ---------- main component ---------- */

const AdminDashboardPage = async () => {
  const usersData = await getAllUsersForDashboard();

  // safe default
  const users = usersData ?? [];

  const totalUsers = users.length;

  const activeUsers = countBy(users, "activeStatus", "ACTIVE");
  const blockedUsers = countBy(users, "activeStatus", "BLOCKED");
  const inactiveUsers = countBy(users, "activeStatus", "INACTIVE");

  const landlords = countBy(users, "role", "LANDLORD");
  const tenants = countBy(users, "role", "TENANT");
  const admins = countBy(users, "role", "ADMIN");

  const stats: StatCardProps[] = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Blocked Users",
      value: blockedUsers,
      icon: UserX,
      accent: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      title: "Landlords",
      value: landlords,
      icon: Building2,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Platform overview 🛡️
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            Manage users and monitor the RentNest platform.
          </p>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {/* ================= Stats ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* ================= Distributions ================= */}
        <div className="space-y-6 lg:col-span-2">
          {/* role distribution */}
          <Card className="rounded-2xl border-border/70 py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold">User Roles</h2>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Platform users by role
                  </p>
                </div>

                <UserCog className="size-4 text-muted-foreground" />
              </div>

              <div className="mt-5 space-y-4">
                <DistributionRow
                  label="Tenants"
                  value={tenants}
                  total={totalUsers}
                  barColor="bg-blue-500"
                  icon={UserRound}
                />

                <DistributionRow
                  label="Landlords"
                  value={landlords}
                  total={totalUsers}
                  barColor="bg-emerald-500"
                  icon={Building2}
                />

                <DistributionRow
                  label="Admins"
                  value={admins}
                  total={totalUsers}
                  barColor="bg-violet-500"
                  icon={ShieldCheck}
                />
              </div>
            </CardContent>
          </Card>

          {/* status distribution */}
          <Card className="rounded-2xl border-border/70 py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold">Account Status</h2>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Health of user accounts
                  </p>
                </div>

                <UserCheck className="size-4 text-muted-foreground" />
              </div>

              <div className="mt-5 space-y-4">
                <DistributionRow
                  label="Active"
                  value={activeUsers}
                  total={totalUsers}
                  barColor="bg-emerald-500"
                  icon={UserCheck}
                />

                <DistributionRow
                  label="Inactive"
                  value={inactiveUsers}
                  total={totalUsers}
                  barColor="bg-amber-500"
                  icon={UserRound}
                />

                <DistributionRow
                  label="Blocked"
                  value={blockedUsers}
                  total={totalUsers}
                  barColor="bg-red-500"
                  icon={UserX}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= Right Column ================= */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-2.5">
            {[
              {
                title: "Manage Users",
                description: "View, block & activate accounts",
                href: "/dashboard/admin/users",
                icon: Users,
              },
              {
                title: "All Properties",
                description: "Moderate platform listings",
                href: "/dashboard/admin/properties",
                icon: Home,
              },
            ].map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{action.title}</p>

                    <p className="truncate text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>

                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>

          {/* Platform Summary */}
          <Card className="rounded-2xl border-border/70 py-0">
            <CardContent className="space-y-5 p-6">
              <p className="text-sm font-semibold">Platform Snapshot</p>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Verified / Healthy
                  </span>

                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {activeUsers}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Need Attention
                  </span>

                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {inactiveUsers}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Restricted</span>

                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {blockedUsers}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
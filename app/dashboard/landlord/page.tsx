import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock,
  DoorClosed,
  DoorOpen,
  Plus,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getLandlordRequestsAction } from "./requests/_actions/requestActions";
import { getMyProperties } from "@/services/landlordProperties";

/* ---------- helpers ---------- */

const formatCurrency = (value: number | string | null | undefined) =>
  `৳${Number(value ?? 0).toLocaleString("en-US")}`;

const formatDate = (value?: string | Date | null) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInitials = (name?: string | null) => {
  if (!name) return "T";

  return (
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "T"
  );
};

const STATUS_STYLES: Record<string, string> = {
  PENDING:
    "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  APPROVED:
    "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ACTIVE:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  COMPLETED:
    "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  REJECTED: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={`shrink-0 rounded-full px-2.5 font-medium ${
      STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground"
    }`}
  >
    {STATUS_LABELS[status] ?? status}
  </Badge>
);

/* ---------- small components ---------- */

interface StatCardProps {
  title: string;
  value: number | string;
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

/* ---------- main component ---------- */

const LandlordDashboardPage = async () => {
  const [propertiesData, requestsData] = await Promise.all([
    getMyProperties(),
    getLandlordRequestsAction(),
  ]);

  // safe defaults
  const properties = propertiesData ?? [];
  const requests = requestsData ?? [];

  const availableProperties = properties.filter(
    (property) => property.available,
  ).length;

  const unavailableProperties = properties.length - availableProperties;

  const countBy = (status: string) =>
    requests.filter((request) => request.status === status).length;

  const pendingRequests = countBy("PENDING");
  const approvedRequests = countBy("APPROVED");
  const rejectedRequests = countBy("REJECTED");

  // available properties theke estimated monthly income
  const monthlyIncome = properties
    .filter((property) => property.available)
    .reduce((sum, property) => sum + Number(property.rent ?? 0), 0);

  const occupancyRate =
    properties.length > 0
      ? Math.round((unavailableProperties / properties.length) * 100)
      : 0;

  const stats: StatCardProps[] = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Building2,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "Available",
      value: availableProperties,
      icon: DoorOpen,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Unavailable",
      value: unavailableProperties,
      icon: DoorClosed,
      accent: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Approved Requests",
      value: approvedRequests,
      icon: BadgeCheck,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Rejected Requests",
      value: rejectedRequests,
      icon: XCircle,
      accent: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  ];

  const quickActions = [
    {
      title: "My Properties",
      description: "Manage your listings",
      href: "/dashboard/landlord/properties",
      icon: Building2,
    },
    {
      title: "Add Property",
      description: "List a new property",
      href: "/dashboard/landlord/properties/new",
      icon: Plus,
    },
    {
      title: "Rental Requests",
      description: "Review tenant applications",
      href: "/dashboard/landlord/requests",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground/80">
              Welcome back 👋
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Landlord Dashboard
            </h1>

            <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
              Manage your properties and review rental requests.
            </p>
          </div>

          <Button
            asChild
            variant="secondary"
            className="gap-1.5 sm:shrink-0"
          >
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="size-4" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {/* ================= Stats ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* ================= Recent Requests ================= */}
        <Card className="rounded-2xl border-border/70 py-0 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b px-6 py-4">
            <div>
              <CardTitle className="text-base">
                Recent Rental Requests
              </CardTitle>

              <CardDescription className="mt-0.5 text-xs">
                Latest tenant applications for your properties
              </CardDescription>
            </div>

            {requests.length > 0 && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
              >
                <Link href="/dashboard/landlord/requests">
                  View All
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-4 md:p-5">
            {requests.length === 0 ? (
              /* empty state */
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Building2 className="size-6 text-muted-foreground" />
                </div>

                <div>
                  <p className="font-medium">No rental requests yet</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    When tenants request your properties, they&apos;ll appear
                    here.
                  </p>
                </div>

                <Button asChild variant="outline" className="mt-1 gap-1.5">
                  <Link href="/dashboard/landlord/properties">
                    Manage Properties
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {requests.slice(0, 5).map((request) => (
                  <Link
                    key={request.id}
                    href={`/dashboard/landlord/requests/${request.id}`}
                    className="group flex items-center gap-3.5 rounded-xl border border-transparent p-2.5 transition-colors hover:border-border hover:bg-muted/40"
                  >
                    {/* tenant avatar */}
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {getInitials(request.tenant?.name)}
                    </div>

                    {/* info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                        {request.tenant?.name ||
                          `Tenant #${request.tenantId?.slice(0, 8) || "Unknown"}`}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {request.property?.title || "Rental Property"}
                        {" · "}
                        {formatDate(request.moveInDate)}
                      </p>
                    </div>

                    {/* status */}
                    <StatusBadge status={request.status} />

                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </Link>
                ))}
              </div>
            )}

            {requests.length > 5 && (
              <Button
                asChild
                variant="outline"
                className="mt-4 w-full"
              >
                <Link href="/dashboard/landlord/requests">
                  View All Requests
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ================= Right Column ================= */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-2.5">
            {quickActions.map((action) => {
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

          {/* Property Overview */}
          <Card className="rounded-2xl border-border/70 py-0">
            <CardContent className="space-y-5 p-6">
              <p className="text-sm font-semibold">Property Overview</p>

              {/* occupancy progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Occupancy</span>

                  <span className="font-semibold">
                    {unavailableProperties}/{properties.length} occupied
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>

              <Separator />

              {/* income */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="size-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Est. Monthly Income
                  </p>

                  <p className="text-lg font-bold leading-tight tracking-tight text-primary">
                    {formatCurrency(monthlyIncome)}
                  </p>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/landlord/properties">
                  Manage Properties
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboardPage;
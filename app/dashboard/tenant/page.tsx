import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCheck,
  Clock,
  CreditCard,
  FileText,
  Home,
  KeyRound,
  MapPin,
  Wallet,
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

import { getMyRentals } from "@/services/rentals";
import { getMyPayments } from "@/services/payments";

/* ---------- helpers ---------- */

const formatCurrency = (value: number) =>
  `৳${Number(value || 0).toLocaleString("en-US")}`;

const STATUS_STYLES: Record<string, string> = {
  PENDING:
    "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  APPROVED:
    "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ACTIVE:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  COMPLETED: "border-primary/25 bg-primary/10 text-primary",
  REJECTED: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

/* ---------- small components ---------- */

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

const TenantDashboardPage = async () => {
  const [rentalsData, paymentsData] = await Promise.all([
    getMyRentals(),
    getMyPayments(),
  ]);

  // safe defaults — API null/undefined hole crash hobe na
  const rentals = rentalsData ?? [];
  const payments = paymentsData ?? [];

  const countBy = (status: string) =>
    rentals.filter((rental) => rental.status === status).length;

  const completedPayments = payments.filter(
    (payment) => payment.status === "COMPLETED",
  );

  const totalPaid = completedPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );

  const avgPayment =
    completedPayments.length > 0
      ? totalPaid / completedPayments.length
      : 0;

  const stats: StatCardProps[] = [
    {
      title: "Total Requests",
      value: rentals.length,
      icon: FileText,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "Pending",
      value: countBy("PENDING"),
      icon: Clock,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Approved",
      value: countBy("APPROVED"),
      icon: BadgeCheck,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Rentals",
      value: countBy("ACTIVE"),
      icon: KeyRound,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Completed",
      value: countBy("COMPLETED"),
      icon: CheckCheck,
      accent: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    {
      title: "Total Payments",
      value: payments.length,
      icon: CreditCard,
      accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= Welcome Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Welcome back 👋
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Tenant Dashboard
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            Manage your rental requests, track payments and find your next
            home.
          </p>
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

      {/* ================= Payment Summary ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
          {/* total paid */}
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="size-6 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-3xl font-bold leading-tight tracking-tight">
                {formatCurrency(totalPaid)}
              </p>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden !h-12 lg:block" />

          {/* breakdown */}
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">
                Completed Payments
              </p>
              <p className="mt-0.5 text-lg font-semibold">
                {completedPayments.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Average Payment</p>
              <p className="mt-0.5 text-lg font-semibold">
                {formatCurrency(avgPayment)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="mt-0.5 text-lg font-semibold">{payments.length}</p>
            </div>
          </div>

          <Button asChild className="gap-1.5 lg:shrink-0">
            <Link href="/dashboard/tenant/payments">
              View Payments
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* ================= Recent Requests ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b px-6 py-4">
          <div>
            <CardTitle className="text-base">Recent Rental Requests</CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Your latest requests and their status
            </CardDescription>
          </div>

          {rentals.length > 0 && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
            >
              <Link href="/dashboard/tenant/requests">
                View All
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-4 md:p-5">
          {rentals.length === 0 ? (
            /* empty state */
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Home className="size-6 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium">No rental requests yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse properties and send your first request.
                </p>
              </div>

              <Button asChild className="mt-1 gap-1.5">
                <Link href="/properties">
                  Browse Properties
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          ) : (
            /* request rows — whole row clickable */
            <div className="space-y-1.5">
              {rentals.slice(0, 5).map((rental) => {
                const image = rental.property?.images?.[0];

                return (
                  <Link
                    key={rental.id}
                    href={`/dashboard/tenant/requests/${rental.id}`}
                    className="group flex items-center gap-3.5 rounded-xl border border-transparent p-2.5 transition-colors hover:border-border hover:bg-muted/40"
                  >
                    {/* thumbnail */}
                    {image ? (
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border">
                        <Image
                          unoptimized
                          src={image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted">
                        <Home className="size-5 text-muted-foreground" />
                      </div>
                    )}

                    {/* info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                        {rental.property?.title || "Rental Property"}
                      </p>

                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        {rental.property?.location || "Location unavailable"}
                      </p>
                    </div>

                    <StatusBadge status={rental.status} />

                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </Link>
                );
              })}
            </div>
          )}

          {rentals.length > 5 && (
            <Button asChild variant="outline" className="mt-4 w-full">
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
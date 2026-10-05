import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock,
  CreditCard,
  Hash,
  Home,
  Landmark,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getMyPayments } from "@/services/payments";

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

const STATUS_STYLES: Record<string, string> = {
  COMPLETED:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  PENDING:
    "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  FAILED: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
  CANCELLED: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={`gap-1 rounded-full px-3 py-1 text-xs font-medium ${
      STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground"
    }`}
  >
    {status === "COMPLETED" ? (
      <CheckCircle2 className="size-3" />
    ) : status === "PENDING" ? (
      <Clock className="size-3" />
    ) : (
      <CircleDashed className="size-3" />
    )}
    {STATUS_LABELS[status] ?? status}
  </Badge>
);

/* ---------- main component ---------- */

const TenantPaymentsPage = async () => {
  const payments = (await getMyPayments()) ?? [];

  const completedPayments = payments.filter(
    (payment) => payment.status === "COMPLETED",
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING",
  );

  const totalPaid = completedPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );

  const totalPaidThisYear = completedPayments
    .filter((payment) => {
      if (!payment.paidAt) return false;

      const paidDate = new Date(payment.paidAt);

      return paidDate.getFullYear() === new Date().getFullYear();
    })
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const stats = [
    {
      title: "Total Paid",
      value: formatCurrency(totalPaid),
      icon: Wallet,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "This Year",
      value: formatCurrency(totalPaidThisYear),
      icon: CalendarDays,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Completed",
      value: completedPayments.length,
      icon: CheckCircle2,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Pending",
      value: pendingPayments.length,
      icon: Clock,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Your transactions 💳
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Payment History
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            All your rental payments in one place — receipts, statuses and
            transaction details.
          </p>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {/* ================= Summary Stats ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="rounded-2xl border-border/70 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.accent}`}
                >
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>

                  <p className="truncate text-xl font-bold leading-tight tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ================= Payment List ================= */}
      {payments.length === 0 ? (
        /* empty state */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <CreditCard className="size-7 text-muted-foreground" />
          </div>

          <div>
            <p className="text-lg font-semibold">No payments yet</p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Your payment history will appear here once you complete a
              rental payment.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => {
            const property = payment.rentalRequest?.property;
            const isCompleted = payment.status === "COMPLETED";

            return (
              <Card
                key={payment.id}
                className="rounded-2xl border-border/70 py-0 transition-colors hover:border-primary/30"
              >
                <CardContent className="p-5 md:p-6">
                  {/* ---------- top row ---------- */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* left: property info */}
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                          isCompleted
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Home className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold tracking-tight">
                          {property?.title || "Rental Property"}
                        </p>

                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {property?.location || "Location unavailable"}
                        </p>

                        {property?.id && (
                          <Link
                            href={`/properties/${property.id}`}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            View Property
                            <ArrowUpRight className="size-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* right: amount + status */}
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
                      <StatusBadge status={payment.status} />

                      <p
                        className={`text-2xl font-bold leading-none tracking-tight ${
                          isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {formatCurrency(payment.amount)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {payment.paidAt
                          ? `Paid on ${formatDate(payment.paidAt)}`
                          : "Not paid yet"}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* ---------- meta grid ---------- */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-4">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Banknote className="size-3.5" />
                        Method
                      </p>

                      <p className="mt-0.5 font-semibold capitalize">
                        {payment.method || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Landmark className="size-3.5" />
                        Provider
                      </p>

                      <p className="mt-0.5 font-semibold">
                        {payment.provider || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        Created
                      </p>

                      <p className="mt-0.5 font-semibold">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Hash className="size-3.5" />
                        Transaction ID
                      </p>

                      <p className="mt-0.5 truncate font-mono text-xs font-semibold">
                        {payment.transactionId || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TenantPaymentsPage;
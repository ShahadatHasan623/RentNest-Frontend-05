import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Home,
  KeyRound,
  MapPin,
  Star,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getMyRentals } from "@/services/rentals";

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
  PENDING:
    "border-amber-500/25 bg-amber-500/50 text-black dark:text-amber-400",
  APPROVED:
    "border-blue-500/25 bg-blue-500/50 text-blue-600 dark:text-blue-400",
  ACTIVE:
    "border-emerald-500/25 bg-emerald-500/50 text-black dark:text-emerald-400",
  COMPLETED:
    "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  REJECTED: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  ALL: "All",
  PENDING: "Pending",
  APPROVED: "Approved",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const FILTERS = ["ALL", "PENDING", "APPROVED", "ACTIVE", "COMPLETED", "REJECTED"];

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={`gap-1 rounded-full border-transparent px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm ${
      STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground"
    }`}
  >
    {STATUS_LABELS[status] ?? status}
  </Badge>
);

/* ---------- main component ---------- */

interface TenantRequestsPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

const TenantRequestsPage = async ({ searchParams }: TenantRequestsPageProps) => {
  const { status } = await searchParams;

  const rentals = (await getMyRentals()) ?? [];

  const activeFilter = status && STATUS_LABELS[status] ? status : "ALL";

  const filtered =
    activeFilter === "ALL"
      ? rentals
      : rentals.filter((rental) => rental.status === activeFilter);

  const countBy = (filter: string) =>
    filter === "ALL"
      ? rentals.length
      : rentals.filter((rental) => rental.status === filter).length;

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Your applications 🏠
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            My Rental Requests
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            Track the status of your rental requests and complete your
            payments.
          </p>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {/* ================= Status Filter Tabs ================= */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => {
          const count = countBy(filter);
          const isActive = activeFilter === filter;

          return (
            <Link
              key={filter}
              href={
                filter === "ALL"
                  ? "/dashboard/tenant/requests"
                  : `/dashboard/tenant/requests?status=${filter}`
              }
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                  : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {STATUS_LABELS[filter] ?? filter}

              <span
                className={`rounded-full px-1.5 text-xs font-semibold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ================= Requests Grid ================= */}
      {rentals.length === 0 ? (
        /* ---- completely empty ---- */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Home className="size-7 text-muted-foreground" />
          </div>

          <div>
            <p className="text-lg font-semibold">No rental requests yet</p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Browse properties and send your first rental request.
            </p>
          </div>

          <Button asChild className="mt-2 gap-1.5">
            <Link href="/properties">
              Browse Properties
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        /* ---- filter result empty ---- */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center">
          <p className="font-medium">
            No {STATUS_LABELS[activeFilter]?.toLowerCase()} requests
          </p>

          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/tenant/requests">Clear filter</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((rental) => {
            const image = rental.property?.images?.[0];

            const isPaymentCompleted =
              rental.payment?.status === "COMPLETED";

            const needsPayment =
              rental.status === "APPROVED" && !isPaymentCompleted;

            return (
              <Card
                key={rental.id}
                className="group flex h-full flex-col gap-0 overflow-hidden rounded-2xl border-border/70 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5"
              >
                {/* ---------- image header ---------- */}
                <div className="relative aspect-[16/8] overflow-hidden">
                  {image ? (
                    <Image
                      unoptimized
                      src={image}
                      alt={rental.property?.title || "Property"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <Home className="size-8 text-muted-foreground" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                  {/* status badge */}
                  <div className="absolute left-3 top-3">
                    <StatusBadge status={rental.status} />
                  </div>

                  {/* rent pill */}
                  <div className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(rental.property?.rent)}
                    </span>

                    <span className="text-xs font-medium text-muted-foreground">
                      /mo
                    </span>
                  </div>
                </div>

                {/* ---------- content ---------- */}
                <CardContent className="flex flex-1 flex-col p-5">
                  {/* title + location */}
                  <div className="space-y-1">
                    <h3 className="line-clamp-1 font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {rental.property?.title || "Rental Property"}
                    </h3>

                    <p className="flex items-center gap-1.5 line-clamp-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      {rental.property?.location || "Location unavailable"}
                    </p>
                  </div>

                  {/* info grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-3 text-center">
                    <div className="min-w-0">
                      <p className="flex items-center justify-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <CalendarDays className="size-3" />
                        Move-in
                      </p>

                      <p className="mt-0.5 truncate text-xs font-semibold">
                        {formatDate(rental.moveInDate)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="flex items-center justify-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <KeyRound className="size-3" />
                        Duration
                      </p>

                      <p className="mt-0.5 truncate text-xs font-semibold">
                        {rental.duration ?? "N/A"} months
                      </p>
                    </div>
                  </div>

                  {/* payment status */}
                  {rental.payment && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Wallet className="size-3.5" />
                        Payment
                      </span>

                      <span
                        className={`font-semibold ${
                          isPaymentCompleted
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {isPaymentCompleted ? "✓ Paid" : "Pending"}
                      </span>
                    </div>
                  )}

                  {/* actions */}
                  <div className="mt-auto space-y-2 pt-4">
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Link
                          href={`/dashboard/tenant/requests/${rental.id}`}
                        >
                          View Details
                        </Link>
                      </Button>

                      {needsPayment && (
                        <Button
                          asChild
                          size="sm"
                          className="flex-1 gap-1.5"
                        >
                          <Link
                            href={`/dashboard/tenant/requests/${rental.id}/pay`}
                          >
                            <CreditCard className="size-4" />
                            Pay Now
                          </Link>
                        </Button>
                      )}
                    </div>

                    {isPaymentCompleted && rental.propertyId && (
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="w-full gap-1.5"
                      >
                        <Link
                          href={`/dashboard/tenant/reviews/${rental.propertyId}`}
                        >
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          Leave a Review
                        </Link>
                      </Button>
                    )}
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

export default TenantRequestsPage;
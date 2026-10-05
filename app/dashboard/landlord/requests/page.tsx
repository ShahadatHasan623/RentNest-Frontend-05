import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock,
  FileText,
  Home,
  Inbox,
  KeyRound,
  MapPin,
  Wallet,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getLandlordRequests } from "@/services/rentals";
import RentalRequestActions from "@/_components/landlord/RentalRequestActions";

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
  ALL: "All",
  PENDING: "Pending",
  APPROVED: "Approved",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const FILTERS = [
  "ALL",
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "COMPLETED",
  "REJECTED",
];

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

/* ---------- main component ---------- */

interface LandlordRequestsPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

const LandlordRequestsPage = async ({
  searchParams,
}: LandlordRequestsPageProps) => {
  const { status } = await searchParams;

  const requests = (await getLandlordRequests()) ?? [];

  const activeFilter =
    status && STATUS_LABELS[status] ? status : "ALL";

  const filtered =
    activeFilter === "ALL"
      ? requests
      : requests.filter((request) => request.status === activeFilter);

  const countBy = (filter: string) =>
    filter === "ALL"
      ? requests.length
      : requests.filter((request) => request.status === filter).length;

  const pendingCount = countBy("PENDING");

  // pending requests er estimated value
  const pendingValue = requests
    .filter((request) => request.status === "PENDING")
    .reduce((sum, request) => sum + Number(request.property?.rent ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Tenant applications 📬
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Rental Requests
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            Review tenant applications and manage your rentals.
            {pendingCount > 0 && ` ${pendingCount} awaiting your response.`}
          </p>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {/* ================= Summary Strip ================= */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="size-4.5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Pending Review</p>

            <p className="text-xl font-bold leading-tight tracking-tight">
              {pendingCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <KeyRound className="size-4.5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Active Rentals</p>

            <p className="text-xl font-bold leading-tight tracking-tight">
              {countBy("ACTIVE")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="size-4.5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Pending Value</p>

            <p className="text-xl font-bold leading-tight tracking-tight text-primary">
              {formatCurrency(pendingValue)}
              <span className="text-xs font-medium text-muted-foreground">
                /mo
              </span>
            </p>
          </div>
        </div>
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
                  ? "/dashboard/landlord/requests"
                  : `/dashboard/landlord/requests?status=${filter}`
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

      {/* ================= Requests List ================= */}
      {requests.length === 0 ? (
        /* ---- completely empty ---- */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Inbox className="size-7 text-muted-foreground" />
          </div>

          <div>
            <p className="text-lg font-semibold">No rental requests yet</p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              When tenants request your properties, they&apos;ll appear here.
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        /* ---- filter result empty ---- */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center">
          <p className="font-medium">
            No {STATUS_LABELS[activeFilter]?.toLowerCase()} requests
          </p>

          <Link
            href="/dashboard/landlord/requests"
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear filter
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((request) => {
            const property = request.property;
            const isPending = request.status === "PENDING";

            return (
              <Card
                key={request.id}
                className={`rounded-2xl border-border/70 py-0 transition-colors ${
                  isPending
                    ? "border-amber-500/30 hover:border-amber-500/50"
                    : "hover:border-primary/30"
                }`}
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* ---------- tenant + property info ---------- */}
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      {/* tenant avatar */}
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(request.tenant?.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* tenant name + status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold tracking-tight">
                            {request.tenant?.name ||
                              `Tenant #${request.tenantId?.slice(0, 8) || "Unknown"}`}
                          </p>

                          <StatusBadge status={request.status} />
                        </div>

                        {/* property */}
                        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                          <Building2 className="size-3.5 shrink-0" />
                          {property?.title || "Rental Property"}
                        </p>

                        {/* location */}
                        {property?.location && (
                          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                            <MapPin className="size-3 shrink-0" />
                            {property.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ---------- meta info ---------- */}
                    <div className="grid shrink-0 grid-cols-3 gap-3 lg:w-auto lg:gap-6">
                      <div className="lg:min-w-28">
                        <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          <CalendarDays className="size-3" />
                          Move-in
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {formatDate(request.moveInDate)}
                        </p>
                      </div>

                      <div className="lg:min-w-20">
                        <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          <Clock className="size-3" />
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {request.duration ?? "N/A"} mo
                        </p>
                      </div>

                      <div className="lg:min-w-24">
                        <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          <Wallet className="size-3" />
                          Rent
                        </p>

                        <p className="mt-1 text-sm font-semibold text-primary">
                          {property?.rent
                            ? formatCurrency(property.rent)
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <Separator className="lg:hidden" />

                    {/* ---------- actions ---------- */}
                    <div className="flex shrink-0 items-center gap-2 lg:justify-end">
                      {property?.id && (
                        <Link
                          href={`/properties/${property.id}`}
                          className="inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="View property"
                        >
                          <Home className="size-4" />
                        </Link>
                      )}

                      {isPending ? (
                        <RentalRequestActions id={request.id} />
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1 rounded-full px-3 py-1.5 text-xs font-normal text-muted-foreground"
                        >
                          {request.status === "APPROVED" ? (
                            <>
                              <BadgeCheck className="size-3" />
                              Approved
                            </>
                          ) : request.status === "REJECTED" ? (
                            <>
                              <XCircle className="size-3" />
                              Rejected
                            </>
                          ) : request.status === "ACTIVE" ? (
                            <>
                              <KeyRound className="size-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <FileText className="size-3" />
                              Archived
                            </>
                          )}
                        </Badge>
                      )}
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

export default LandlordRequestsPage;
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock,
  Inbox,
  MapPin,
  SearchX,
  Wallet,
  XCircle,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { getAdminRentalRequests } from "@/services/rentals";

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
  if (!name) return "?";

  return (
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
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

/* ---------- person cell (avatar + name + email) ---------- */

const PersonCell = ({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) => (
  <div className="flex items-center gap-2.5">
    <Avatar className="size-8 shrink-0 rounded-full border">
      <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>

    <div className="min-w-0">
      <p className="truncate text-sm font-semibold">
        {name || "Unknown"}
      </p>

      <p className="truncate text-xs text-muted-foreground">
        {email || "—"}
      </p>
    </div>
  </div>
);

/* ---------- main component ---------- */

interface AdminRentalRequestsPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

const AdminRentalRequestsPage = async ({
  searchParams,
}: AdminRentalRequestsPageProps) => {
  const { status } = await searchParams;

  const rentals = (await getAdminRentalRequests()) ?? [];

  const activeFilter =
    status && STATUS_LABELS[status] ? status : "ALL";

  const filtered =
    activeFilter === "ALL"
      ? rentals
      : rentals.filter((rental) => rental.status === activeFilter);

  const countBy = (filter: string) =>
    filter === "ALL"
      ? rentals.length
      : rentals.filter((rental) => rental.status === filter).length;

  const pendingCount = countBy("PENDING");
  const activeCount = countBy("ACTIVE");

  // platform-wide monthly rental value (active + approved)
  const monthlyValue = rentals
    .filter(
      (rental) =>
        rental.status === "ACTIVE" || rental.status === "APPROVED",
    )
    .reduce((sum, rental) => sum + Number(rental.property?.rent ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Platform activity 🔄
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Rental Requests
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            Monitor all rental activity between tenants and landlords.
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
            <p className="text-sm text-muted-foreground">Pending</p>

            <p className="text-xl font-bold leading-tight tracking-tight">
              {pendingCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <BadgeCheck className="size-4.5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Active Rentals</p>

            <p className="text-xl font-bold leading-tight tracking-tight">
              {activeCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="size-4.5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Monthly Rental Value
            </p>

            <p className="text-xl font-bold leading-tight tracking-tight text-primary">
              {formatCurrency(monthlyValue)}
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
                  ? "/dashboard/admin/rental-requests"
                  : `/dashboard/admin/admin/rental-requests?status=${filter}`
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

      {/* ================= Requests Table ================= */}
      <Card className="overflow-hidden rounded-2xl border-border/70 py-0">
        {/* table header strip */}
        <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-5 py-3.5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Building2 className="size-4 text-muted-foreground" />
            All Requests
          </p>

          <p className="text-xs text-muted-foreground">
            Total:{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>
          </p>
        </div>

        {rentals.length === 0 ? (
          /* ---- completely empty ---- */
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Inbox className="size-7 text-muted-foreground" />
            </div>

            <div>
              <p className="font-semibold">No rental requests yet</p>

              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Rental activity will appear here once tenants start
                requesting properties.
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          /* ---- filter result empty ---- */
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <SearchX className="size-6 text-muted-foreground" />
            </div>

            <p className="font-medium">
              No {STATUS_LABELS[activeFilter]?.toLowerCase()} requests
            </p>

            <Link
              href="/dashboard/admin/rental-requests"
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear filter
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Property</th>

                  <th className="px-5 py-3 font-medium">Tenant</th>

                  <th className="px-5 py-3 font-medium">Landlord</th>

                  <th className="px-5 py-3 font-medium">Move-in</th>

                  <th className="px-5 py-3 font-medium">Rent</th>

                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-b transition-colors last:border-0 hover:bg-muted/40"
                  >
                    {/* property */}
                    <td className="max-w-52 px-5 py-4">
                      <p className="truncate font-semibold">
                        {rental.property?.title || "Unknown Property"}
                      </p>

                      {rental.property?.location && (
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0" />
                          {rental.property.location}
                        </p>
                      )}
                    </td>

                    {/* tenant */}
                    <td className="px-5 py-4">
                      <PersonCell
                        name={rental.tenant?.name}
                        email={rental.tenant?.email}
                      />
                    </td>

                    {/* landlord */}
                    <td className="px-5 py-4">
                      <PersonCell
                        name={rental.landlord?.name}
                        email={rental.landlord?.email}
                      />
                    </td>

                    {/* move-in + duration */}
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-1.5 font-medium">
                        <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
                        {formatDate(rental.moveInDate)}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {rental.duration ?? "N/A"} month
                        {rental.duration > 1 ? "s" : ""}
                      </p>
                    </td>

                    {/* rent */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-primary">
                        {rental.property?.rent
                          ? formatCurrency(rental.property.rent)
                          : "—"}
                      </p>

                      <p className="text-xs text-muted-foreground">/month</p>
                    </td>

                    {/* status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={rental.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminRentalRequestsPage;
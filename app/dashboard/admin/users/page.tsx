import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  Users,
  UserX,
  X,
} from "lucide-react";

import UserStatusButton from "@/_components/admin/UserStatusButton";

import { getAllUsers } from "@/services/users";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AdminUsersPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

/* ---------- helpers ---------- */

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
  ACTIVE:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  BLOCKED: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
  INACTIVE:
    "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const ROLE_STYLES: Record<string, string> = {
  ADMIN:
    "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  LANDLORD:
    "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  TENANT:
    "border-slate-500/25 bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={`rounded-full px-2.5 font-medium ${
      STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground"
    }`}
  >
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </Badge>
);

const RoleBadge = ({ role }: { role: string }) => (
  <Badge
    variant="outline"
    className={`gap-1 rounded-full px-2.5 font-medium ${
      ROLE_STYLES[role] ?? "border-border bg-muted text-muted-foreground"
    }`}
  >
    {role === "ADMIN" && <ShieldCheck className="size-3" />}
    {role.charAt(0) + role.slice(1).toLowerCase()}
  </Badge>
);

/* ---------- main component ---------- */

const AdminUsersPage = async ({ searchParams }: AdminUsersPageProps) => {
  const params = await searchParams;

  const search = params.search || "";

  const currentPage = Math.max(Number(params.page) || 1, 1);

  const result = await getAllUsers({
    search,
    page: currentPage,
    limit: 10,
  });

  const users = result?.users || [];

  const meta = result?.meta;

  const totalPages = meta?.totalPages || 1;

  const page = meta?.page || currentPage;

  const total = meta?.total || 0;

  const createPageUrl = (pageNumber: number) => {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    query.set("page", String(pageNumber));

    return `/dashboard/admin/users?${query.toString()}`;
  };

  /* ---------- smart page numbers (with ellipsis) ---------- */

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Platform members 👥
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            User Management
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            Manage all registered users and their account status.
          </p>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {/* ================= Search Bar ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardContent className="p-4">
          <form method="GET" className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name or email..."
                className="h-11 bg-background pl-10 pr-10"
              />

              {/* clear button */}
              {search && (
                <Link
                  href="/dashboard/admin/users"
                  className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </Link>
              )}
            </div>

            <Button type="submit" className="h-11 gap-2 sm:w-32">
              <Search className="size-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ================= Users Table ================= */}
      <Card className="overflow-hidden rounded-2xl border-border/70 py-0">
        {/* table header strip */}
        <div className="flex flex-col gap-2 border-b bg-muted/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Users className="size-4 text-muted-foreground" />
            All Users
          </p>

          <p className="text-xs text-muted-foreground">
            Total:{" "}
            <span className="font-semibold text-foreground">{total}</span>
            {search && (
              <>
                {" "}
                · results for{" "}
                <span className="font-semibold text-foreground">
                  &quot;{search}&quot;
                </span>
              </>
            )}
          </p>
        </div>

        {users.length === 0 ? (
          /* ---- empty state ---- */
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <UserX className="size-7 text-muted-foreground" />
            </div>

            <div>
              <p className="font-semibold">
                {search ? "No users found" : "No users yet"}
              </p>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {search
                  ? `No users match "${search}". Try a different search term.`
                  : "Registered users will appear here."}
              </p>
            </div>

            {search && (
              <Button asChild variant="outline" size="sm" className="mt-1">
                <Link href="/dashboard/admin/users">Clear search</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">User</th>

                  <th className="px-5 py-3 font-medium">Role</th>

                  <th className="px-5 py-3 font-medium">Status</th>

                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors last:border-0 hover:bg-muted/40"
                  >
                    {/* user (avatar + name + email) */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 shrink-0 rounded-full border">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {user.name || "N/A"}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* role */}
                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={user.activeStatus} />
                    </td>

                    {/* action */}
                    <td className="px-5 py-4 text-right">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <ShieldCheck className="size-3.5" />
                          Protected
                        </span>
                      ) : (
                        <UserStatusButton
                          id={user.id}
                          activeStatus={user.activeStatus}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ================= Pagination ================= */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* page info */}
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(page - 1) * 10 + 1}–{Math.min(page * 10, total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{total}</span> users
          </p>

          {/* pagination controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* previous */}
            {page > 1 ? (
              <Button
                asChild
                variant="outline"
                size="icon"
                className="size-8"
              >
                <Link href={createPageUrl(page - 1)} aria-label="Previous page">
                  <ChevronLeft className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled
              >
                <ChevronLeft className="size-4" />
              </Button>
            )}

            {/* page numbers */}
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1.5 text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : pageNumber === page ? (
                <Button
                  key={pageNumber}
                  size="sm"
                  className="size-8 p-0"
                  disabled
                >
                  {pageNumber}
                </Button>
              ) : (
                <Button
                  key={pageNumber}
                  asChild
                  size="sm"
                  variant="outline"
                  className="size-8 p-0"
                >
                  <Link href={createPageUrl(pageNumber)}>{pageNumber}</Link>
                </Button>
              ),
            )}

            {/* next */}
            {page < totalPages ? (
              <Button
                asChild
                variant="outline"
                size="icon"
                className="size-8"
              >
                <Link href={createPageUrl(page + 1)} aria-label="Next page">
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled
              >
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
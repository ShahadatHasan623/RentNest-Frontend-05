import Link from "next/link";

import UserStatusButton from "@/_components/admin/UserStatusButton";

import { getAllUsers } from "@/services/users";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface AdminUsersPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

const AdminUsersPage = async ({
  searchParams,
}: AdminUsersPageProps) => {
  const params = await searchParams;

  const search = params.search || "";

  const currentPage = Math.max(
    Number(params.page) || 1,
    1
  );

  const result = await getAllUsers({
    search,
    page: currentPage,
    limit: 10,
  });


  const users = result?.users || [];

  const meta = result?.meta;

  const totalPages = meta?.totalPages || 1;

  const page = meta?.page || currentPage;

  const createPageUrl = (pageNumber: number) => {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    query.set("page", String(pageNumber));

    return `/dashboard/admin/users?${query.toString()}`;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          User Management
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage all registered users and their account
          status.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Search Users
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            method="GET"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by name or email..."
              className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            <Button type="submit">
              Search
            </Button>

            {search && (
              <Button
                asChild
                variant="outline"
              >
                <Link href="/dashboard/admin/users">
                  Clear
                </Link>
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* User Count */}
      <div className="text-sm text-muted-foreground">
        Total Users:{" "}
        <span className="font-semibold text-foreground">
          {meta?.total || 0}
        </span>
      </div>

      {/* User Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left">
                    Role
                  </th>

                  <th className="px-4 py-3 text-left">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      {search
                        ? `No users found for "${search}".`
                        : "No users found."}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >

                      {/* Name */}
                      <td className="px-4 py-4 font-medium">
                        {user.name || "N/A"}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.activeStatus === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : user.activeStatus === "BLOCKED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.activeStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-right">
                        {user.role === "ADMIN" ? (
                          <span className="text-xs text-muted-foreground">
                            Admin
                          </span>
                        ) : (
                          <UserStatusButton
                            id={user.id}
                            activeStatus={user.activeStatus}
                          />
                        )}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Page Info */}
          <p className="text-sm text-muted-foreground">
            Showing page{" "}
            <span className="font-medium text-foreground">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {totalPages}
            </span>
          </p>

          {/* Pagination Buttons */}
          <div className="flex flex-wrap items-center gap-2">

            {/* Previous */}
            {page > 1 ? (
              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link href={createPageUrl(page - 1)}>
                  Previous
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
              >
                Previous
              </Button>
            )}

            {/* Page Numbers */}
            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <Button
                key={pageNumber}
                asChild
                size="sm"
                variant={
                  pageNumber === page
                    ? "default"
                    : "outline"
                }
              >
                <Link href={createPageUrl(pageNumber)}>
                  {pageNumber}
                </Link>
              </Button>
            ))}

            {/* Next */}
            {page < totalPages ? (
              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link href={createPageUrl(page + 1)}>
                  Next
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
              >
                Next
              </Button>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsersPage;
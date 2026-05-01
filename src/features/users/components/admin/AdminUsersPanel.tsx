"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";

import Badge from "@/features/shared/components/Badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/features/shared/ui/pagination";
import type {
  AdminManagedUser,
  ManagedUserRole,
} from "@/features/users/lib/adminUsers";
import {
  ADMIN_USERS_PAGE_SIZE,
  getManagedUsersCountLabel,
  getManagedUserLabel,
  getManagedUserSearchPlaceholder,
} from "@/features/users/lib/adminUsers";
import AdminCreateUserDialog from "@/features/users/components/admin/AdminCreateUserDialog";
import AdminUsersTable from "@/features/users/components/admin/AdminUsersTable";
import { getVisiblePages } from "@/features/shared/lib/pagination";
import { Input } from "@/features/shared/ui/input";
import Empty from "@/features/shared/components/Empty";

type AdminUsersPanelProps = {
  role: ManagedUserRole;
  users: AdminManagedUser[];
};

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

export default function AdminUsersPanel({ role, users }: AdminUsersPanelProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeValue(deferredQuery);
  const filteredUsers = normalizedQuery
    ? users.filter((user) =>
        [
          user.firstName,
          user.lastName,
          user.email,
          user.uniID,
          `${user.firstName} ${user.lastName}`,
        ].some((value) => normalizeValue(value).includes(normalizedQuery)),
      )
    : users;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ADMIN_USERS_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ADMIN_USERS_PAGE_SIZE,
    currentPage * ADMIN_USERS_PAGE_SIZE,
  );
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <section className="space-y-6">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-sky-600">
            {getManagedUserLabel(role)} directory
          </p>

          <AdminCreateUserDialog role={role} />
        </div>

        <div className="mt-4">
          <label
            htmlFor={`${role.toLowerCase()}UserSearch`}
            className="sr-only"
          >
            Search {getManagedUserLabel(role).toLowerCase()} accounts
          </label>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id={`${role.toLowerCase()}UserSearch`}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder={getManagedUserSearchPlaceholder(role)}
                className="pl-10"
              />
            </div>

            <Badge styles="self-start bg-slate-500 font-semibold text-slate-50 sm:self-auto">
              {getManagedUsersCountLabel(filteredUsers.length)}
            </Badge>
          </div>
        </div>
      </div>

      {paginatedUsers.length === 0 ? (
        <Empty resourceName={`${role.toLocaleLowerCase()} accounts`} />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <AdminUsersTable users={paginatedUsers} />
        </div>
      )}

      {filteredUsers.length > ADMIN_USERS_PAGE_SIZE ? (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm">
          <div className="mb-3 text-center text-sm text-slate-500 sm:hidden">
            Page {currentPage} of {totalPages}
          </div>

          <Pagination>
            <PaginationContent className="flex-wrap justify-center">
              <PaginationItem>
                <PaginationPrevious
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                />
              </PaginationItem>

              {visiblePages.map((pageToken, index) =>
                pageToken === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageToken}>
                    <PaginationLink
                      isActive={pageToken === currentPage}
                      onClick={() => setPage(pageToken)}
                    >
                      {pageToken}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </section>
  );
}

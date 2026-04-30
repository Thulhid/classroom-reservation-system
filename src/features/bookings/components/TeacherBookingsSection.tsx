"use client";

import { CalendarClock, ListFilter } from "lucide-react";

import BookingCardBox from "@/features/bookings/components/BookingCardBox";
import { useTeacherBookings } from "@/features/bookings/hooks/useTeacherBookings";
import type {
  BookingSortOrder,
  BookingStatusFilter,
} from "@/features/bookings/lib/bookingQuery";
import type { BookingsPagination } from "@/features/bookings/types/bookingTypes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/features/shared/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/ui/select";
import Spinner from "@/features/shared/components/Spinner";

type PageToken = number | "ellipsis";

const statusOptions = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "ongoing",
    label: "Ongoing",
  },
  {
    value: "completed",
    label: "Completed",
  },
] satisfies { value: BookingStatusFilter; label: string }[];

const sortOptions = [
  {
    value: "asc",
    label: "Date time ascending",
  },
  {
    value: "desc",
    label: "Date time descending",
  },
] satisfies { value: BookingSortOrder; label: string }[];

const emptyContent = {
  all: {
    title: "No bookings",
    description:
      "Pick a classroom and time period from the rooms page when you are ready to reserve one.",
  },
  upcoming: {
    title: "No upcoming bookings",
    description:
      "Pick a classroom and time period from the rooms page when you are ready to reserve one.",
  },
  ongoing: {
    title: "No ongoing bookings",
    description: "Bookings that are active right now will appear here.",
  },
  completed: {
    title: "No completed bookings",
    description: "Completed classroom bookings will appear here over time.",
  },
} satisfies Record<BookingStatusFilter, { title: string; description: string }>;

function getVisiblePages(page: number, totalPages: number): PageToken[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const visiblePages = [...pages]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((firstPage, secondPage) => firstPage - secondPage);

  return visiblePages.flatMap((pageNumber, index) => {
    const previousPage = visiblePages[index - 1];

    if (previousPage && pageNumber - previousPage > 1) {
      return ["ellipsis", pageNumber] as PageToken[];
    }

    return [pageNumber] as PageToken[];
  });
}

function getPaginationSummary(pagination?: BookingsPagination) {
  if (!pagination || pagination.totalItems === 0) {
    return "No bookings found";
  }

  const firstItem = (pagination.page - 1) * pagination.pageSize + 1;
  const lastItem = Math.min(
    pagination.page * pagination.pageSize,
    pagination.totalItems,
  );

  return `Showing ${firstItem}-${lastItem} of ${pagination.totalItems}`;
}

export default function TeacherBookingsSection() {
  const {
    bookingsPage,
    error,
    isLoading,
    query,
    refreshBookings,
    setPage,
    setSort,
    setStatus,
  } = useTeacherBookings();
  const bookings = bookingsPage?.bookings ?? [];
  const pagination = bookingsPage?.pagination;
  const selectedEmptyContent = emptyContent[query.status];
  const visiblePages = pagination
    ? getVisiblePages(pagination.page, pagination.totalPages)
    : [];

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-600">
              <ListFilter size={18} />
              <h2 className="text-lg font-semibold text-slate-800">
                Booking filters
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {getPaginationSummary(pagination)}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-120">
            <div className="space-y-2">
              <label
                htmlFor="booking-status"
                className="text-sm font-medium text-slate-700"
              >
                Status
              </label>
              <Select
                value={query.status}
                onValueChange={(value) =>
                  setStatus(value as BookingStatusFilter)
                }
              >
                <SelectTrigger id="booking-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="booking-sort"
                className="text-sm font-medium text-slate-700"
              >
                Sort
              </label>
              <Select
                value={query.sort}
                onValueChange={(value) => setSort(value as BookingSortOrder)}
              >
                <SelectTrigger id="booking-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div
        className={isLoading && bookings.length > 0 ? "opacity-60" : undefined}
        aria-busy={isLoading}
        aria-live="polite"
      >
        {isLoading && bookings.length === 0 ? (
          <Spinner className="mx-auto mt-15" size={50} />
        ) : (
          <BookingCardBox
            bookings={bookings}
            emptyTitle={selectedEmptyContent.title}
            emptyDescription={selectedEmptyContent.description}
            onBookingDeleted={refreshBookings}
            onBookingUpdated={refreshBookings}
          />
        )}
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm text-slate-500 sm:hidden">
            <CalendarClock size={16} />
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <Pagination>
            <PaginationContent className="flex-wrap justify-center">
              <PaginationItem>
                <PaginationPrevious
                  disabled={!pagination.hasPreviousPage || isLoading}
                  onClick={() => setPage(pagination.page - 1)}
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
                      isActive={pageToken === pagination.page}
                      disabled={isLoading}
                      onClick={() => setPage(pageToken)}
                    >
                      {pageToken}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  disabled={!pagination.hasNextPage || isLoading}
                  onClick={() => setPage(pagination.page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </section>
  );
}

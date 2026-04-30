import { useEffect, useState } from "react";

import {
  defaultTeacherBookingsQuery,
  type BookingSortOrder,
  type BookingStatusFilter,
  type TeacherBookingsQuery,
} from "@/features/bookings/lib/bookingQuery";
import { getTeacherBookings as getTeacherBookingsService } from "@/features/bookings/services/apiBookings";
import type { TeacherBookingsPage } from "@/features/bookings/types/bookingTypes";

export function useTeacherBookings() {
  const [query, setQuery] = useState<TeacherBookingsQuery>(
    defaultTeacherBookingsQuery,
  );
  const [bookingsPage, setBookingsPage] = useState<TeacherBookingsPage | null>(
    null,
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getTeacherBookingsService(
          query,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setIsLoading(false);

        if (!result.success) {
          setError(result.message ?? "Could not load your bookings.");
          return;
        }

        setBookingsPage(result.data);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setIsLoading(false);
        setError("Could not load your bookings.");
      }
    }

    loadBookings();

    return () => {
      controller.abort();
    };
  }, [query, reloadKey]);

  function setStatus(status: BookingStatusFilter) {
    setQuery((currentQuery) => ({
      ...currentQuery,
      status,
      page: 1,
    }));
  }

  function setSort(sort: BookingSortOrder) {
    setQuery((currentQuery) => ({
      ...currentQuery,
      sort,
      page: 1,
    }));
  }

  function setPage(page: number) {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page,
    }));
  }

  function refreshBookings() {
    setReloadKey((currentReloadKey) => currentReloadKey + 1);
  }

  return {
    bookingsPage,
    error,
    isLoading,
    query,
    refreshBookings,
    setPage,
    setSort,
    setStatus,
  };
}

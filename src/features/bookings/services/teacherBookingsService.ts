import type { TeacherBookingsQuery } from "@/features/bookings/lib/bookingQuery";
import type {
  BookingSummary,
  TeacherBookingsPage,
} from "@/features/bookings/types";

type BookingSummaryJson = Omit<BookingSummary, "startsAt" | "endsAt"> & {
  startsAt: string;
  endsAt: string;
};

type TeacherBookingsPageJson = Omit<TeacherBookingsPage, "bookings"> & {
  bookings: BookingSummaryJson[];
};

type GetTeacherBookingsResult =
  | {
      success: true;
      data: TeacherBookingsPage;
    }
  | {
      success: false;
      message?: string;
    };

function toBookingSummary(booking: BookingSummaryJson): BookingSummary {
  return {
    ...booking,
    startsAt: new Date(booking.startsAt),
    endsAt: new Date(booking.endsAt),
  };
}

export async function getTeacherBookings(
  query: TeacherBookingsQuery,
  signal?: AbortSignal,
): Promise<GetTeacherBookingsResult> {
  const searchParams = new URLSearchParams({
    status: query.status,
    sort: query.sort,
    page: String(query.page),
  });

  const response = await fetch(`/api/bookings?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });
  const result = (await response.json()) as
    | TeacherBookingsPageJson
    | { message?: string };

  if (!response.ok) {
    return {
      success: false,
      message:
        "message" in result
          ? result.message
          : "Could not load your bookings.",
    };
  }

  const bookingsPage = result as TeacherBookingsPageJson;

  return {
    success: true,
    data: {
      ...bookingsPage,
      bookings: bookingsPage.bookings.map(toBookingSummary),
    } satisfies TeacherBookingsPage,
  };
}

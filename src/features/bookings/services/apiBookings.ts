import type { TeacherBookingsQuery } from "@/features/bookings/lib/bookingQuery";
import type {
  CreateBookingPayload,
  BookingSummary,
  TeacherBookingsPage,
  UpdateBookingPayload,
} from "@/features/bookings/types/bookingTypes";

type BookingMutationResponse = {
  message?: string;
};

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
        "message" in result ? result.message : "Could not load your bookings.",
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

export async function deleteBooking(bookingId: string) {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
  const result = (await response.json()) as BookingMutationResponse;

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not delete booking.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Booking deleted successfully.",
  };
}

export async function updateBooking(
  bookingId: string,
  payload: UpdateBookingPayload,
) {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as BookingMutationResponse;

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not update booking.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Booking updated successfully.",
  };
}

export async function createBooking(payload: CreateBookingPayload) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as BookingMutationResponse;

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not create booking.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Booking created successfully.",
  };
}

export const TEACHER_BOOKINGS_PAGE_SIZE = 10;

export const bookingStatusFilters = [
  "all",
  "upcoming",
  "ongoing",
  "completed",
] as const;
export const bookingSortOrders = ["asc", "desc"] as const;

export type BookingStatusFilter = (typeof bookingStatusFilters)[number];
export type BookingSortOrder = (typeof bookingSortOrders)[number];

export type TeacherBookingsQuery = {
  status: BookingStatusFilter;
  sort: BookingSortOrder;
  page: number;
};

export const defaultTeacherBookingsQuery = {
  status: "upcoming",
  sort: "asc",
  page: 1,
} satisfies TeacherBookingsQuery;

function isBookingStatusFilter(
  value: string | null | undefined,
): value is BookingStatusFilter {
  return bookingStatusFilters.includes(value as BookingStatusFilter);
}

function isBookingSortOrder(
  value: string | null | undefined,
): value is BookingSortOrder {
  return bookingSortOrders.includes(value as BookingSortOrder);
}

export function parseBookingStatusFilter(value: string | null | undefined) {
  if (value === "future") {
    return "upcoming";
  }

  if (value === "past") {
    return "completed";
  }

  return isBookingStatusFilter(value)
    ? value
    : defaultTeacherBookingsQuery.status;
}

export function parseBookingSortOrder(value: string | null | undefined) {
  if (value === "dec") {
    return "desc";
  }

  return isBookingSortOrder(value) ? value : defaultTeacherBookingsQuery.sort;
}

export function parseBookingPage(value: string | null | undefined) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0
    ? page
    : defaultTeacherBookingsQuery.page;
}

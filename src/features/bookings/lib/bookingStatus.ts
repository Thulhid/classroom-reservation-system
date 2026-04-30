import { isAfter, isWithinInterval } from "date-fns";

export type BookingDisplayStatus = "upcoming" | "ongoing" | "completed";

type BookingStatusInput = {
  startsAt: Date;
  endsAt: Date;
};

const bookingStatusMeta = {
  upcoming: {
    label: "Upcoming",
    badgeStyles: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  },
  ongoing: {
    label: "Ongoing",
    badgeStyles: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
  },
  completed: {
    label: "Completed",
    badgeStyles: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  },
} satisfies Record<
  BookingDisplayStatus,
  {
    label: string;
    badgeStyles: string;
  }
>;

export function getBookingDisplayStatus(
  booking: BookingStatusInput,
  now = new Date(),
) {
  if (
    isWithinInterval(now, {
      start: booking.startsAt,
      end: booking.endsAt,
    })
  ) {
    return bookingStatusMeta.ongoing;
  }

  if (isAfter(booking.startsAt, now)) {
    return bookingStatusMeta.upcoming;
  }

  return bookingStatusMeta.completed;
}

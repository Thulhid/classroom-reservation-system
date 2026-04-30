import { CalendarDays, Clock, History } from "lucide-react";
import { isAfter, isWithinInterval } from "date-fns";

import {
  formatBookingDate,
  formatBookingTimeRange,
} from "@/features/bookings/lib/dateTime";
import type { BookingSummary } from "@/features/bookings/services/bookingService";

type RoomBookingHistoryProps = {
  bookings: BookingSummary[];
};

function getBookingStatus(booking: BookingSummary) {
  const now = new Date();

  if (
    isWithinInterval(now, {
      start: booking.startsAt,
      end: booking.endsAt,
    })
  ) {
    return {
      label: "Now",
      className: "bg-sky-50 text-sky-700",
    };
  }

  if (isAfter(booking.startsAt, now)) {
    return {
      label: "Upcoming",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: "Completed",
    className: "bg-slate-100 text-slate-600",
  };
}

export default function RoomBookingHistory({
  bookings,
}: RoomBookingHistoryProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sky-600">
            <History size={18} />
            <h2 className="text-lg font-semibold text-slate-800">
              Booking history
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Latest room reservations, including past and upcoming use.
          </p>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="mt-5 divide-y divide-slate-100">
          {bookings.map((booking) => {
            const status = getBookingStatus(booking);

            return (
              <article
                key={booking.id}
                className="grid gap-3 py-4 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-800">
                      {booking.purpose ?? "Classroom booking"}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Booked by {booking.teacherName}
                  </p>
                </div>

                <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:text-right">
                  <div className="flex items-center gap-2 lg:justify-end">
                    <CalendarDays size={16} className="text-sky-600" />
                    {formatBookingDate(booking.startsAt)}
                  </div>
                  <div className="flex items-center gap-2 lg:justify-end">
                    <Clock size={16} className="text-sky-600" />
                    {formatBookingTimeRange(booking.startsAt, booking.endsAt)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-5 text-center">
          <CalendarDays className="mx-auto text-slate-400" size={36} />
          <p className="mt-3 text-sm font-medium text-slate-700">
            No bookings recorded for this room yet.
          </p>
        </div>
      )}
    </section>
  );
}

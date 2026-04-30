import { CalendarDays, Clock, History } from "lucide-react";

import BookingDeleteButton from "@/features/bookings/components/BookingDeleteButton";
import BookingEditButton from "@/features/bookings/components/BookingEditButton";
import BookingStatusBadge from "@/features/bookings/components/BookingStatusBadge";
import {
  formatBookingDate,
  formatBookingTimeRange,
  toDateInputValue,
  toTimeInputValue,
} from "@/features/bookings/lib/dateTime";
import type { BookingSummary } from "@/features/bookings/types";

type RoomBookingHistoryProps = {
  bookings: BookingSummary[];
};

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
            Latest room reservations, including completed and upcoming use.
          </p>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="mt-5 divide-y divide-slate-100">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="grid gap-3 py-4 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="break-words font-semibold text-slate-800">
                    {booking.purpose ?? "Classroom booking"}
                  </h3>
                  <BookingStatusBadge booking={booking} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Booked by {booking.teacherName}
                </p>
              </div>

              <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end lg:text-right">
                <div className="flex items-center gap-2 lg:justify-end">
                  <CalendarDays size={16} className="text-sky-600" />
                  {formatBookingDate(booking.startsAt)}
                </div>
                <div className="flex items-center gap-2 lg:justify-end">
                  <Clock size={16} className="text-sky-600" />
                  {formatBookingTimeRange(booking.startsAt, booking.endsAt)}
                </div>
                {booking.canEdit || booking.canDelete ? (
                  <div className="flex gap-2 sm:ml-2">
                    {booking.canEdit ? (
                      <BookingEditButton
                        bookingId={booking.id}
                        bookingName={booking.purpose ?? booking.roomName}
                        initialDate={toDateInputValue(booking.startsAt)}
                        initialStartTime={toTimeInputValue(booking.startsAt)}
                        initialEndTime={toTimeInputValue(booking.endsAt)}
                        initialPurpose={booking.purpose}
                      />
                    ) : null}
                    {booking.canDelete ? (
                      <BookingDeleteButton
                        bookingId={booking.id}
                        bookingName={booking.purpose ?? booking.roomName}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
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

import { CalendarDays, Clock, DoorOpen } from "lucide-react";

import {
  formatBookingDate,
  formatBookingTimeRange,
  toDateInputValue,
  toTimeInputValue,
} from "@/features/bookings/lib/dateTime";
import BookingDeleteButton from "@/features/shared/components/BookingDeleteButton";
import BookingEditButton from "@/features/shared/components/BookingEditButton";
import BookingStatusBadge from "@/features/bookings/components/BookingStatusBadge";
import type { BookingSummary } from "@/features/bookings/types/bookingTypes";

type BookingCardProps = {
  booking: BookingSummary;
  onDeleted?: () => void;
  onUpdated?: () => void;
};

export default function BookingCard({
  booking,
  onDeleted,
  onUpdated,
}: BookingCardProps) {
  const hasActions = booking.canEdit || booking.canDelete;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
              <DoorOpen size={16} className="shrink-0" />
              <span className="truncate">{booking.roomName}</span>
            </span>
            <BookingStatusBadge booking={booking} />
          </div>
          <h2 className="mt-2 text-lg font-semibold break-words text-slate-800 sm:text-xl">
            {booking.purpose ?? "Classroom booking"}
          </h2>
        </div>

        <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center lg:min-w-fit lg:justify-end lg:text-right">
          <div className="flex items-center gap-2 lg:justify-end">
            <CalendarDays size={16} className="text-sky-600" />
            {formatBookingDate(booking.startsAt)}
          </div>
          <div className="flex items-center gap-2 lg:justify-end">
            <Clock size={16} className="text-sky-600" />
            {formatBookingTimeRange(booking.startsAt, booking.endsAt)}
          </div>
          {hasActions ? (
            <div className="flex gap-2 sm:ml-2">
              {booking.canEdit ? (
                <BookingEditButton
                  bookingId={booking.id}
                  bookingName={booking.purpose ?? booking.roomName}
                  initialDate={toDateInputValue(booking.startsAt)}
                  initialStartTime={toTimeInputValue(booking.startsAt)}
                  initialEndTime={toTimeInputValue(booking.endsAt)}
                  initialPurpose={booking.purpose}
                  onUpdated={onUpdated}
                />
              ) : null}
              {booking.canDelete ? (
                <BookingDeleteButton
                  bookingId={booking.id}
                  bookingName={booking.purpose ?? booking.roomName}
                  onDeleted={onDeleted}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

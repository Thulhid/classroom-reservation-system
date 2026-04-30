import { CalendarDays, Clock, DoorOpen } from "lucide-react";

import {
  formatBookingDate,
  formatBookingTimeRange,
} from "@/features/bookings/lib/dateTime";
import type { BookingSummary } from "@/features/bookings/services/bookingService";

type BookingCardProps = {
  booking: BookingSummary;
};

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <DoorOpen size={16} />
            {booking.roomName}
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-800">
            {booking.purpose ?? "Classroom booking"}
          </h2>
        </div>

        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 md:text-right">
          <div className="flex items-center gap-2 md:justify-end">
            <CalendarDays size={16} className="text-sky-600" />
            {formatBookingDate(booking.startsAt)}
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <Clock size={16} className="text-sky-600" />
            {formatBookingTimeRange(booking.startsAt, booking.endsAt)}
          </div>
        </div>
      </div>
    </article>
  );
}

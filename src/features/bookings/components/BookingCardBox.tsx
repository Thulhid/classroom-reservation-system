import { CalendarDays } from "lucide-react";

import BookingCard from "@/features/bookings/components/BookingCard";
import type { BookingSummary } from "@/features/bookings/services/bookingService";

type BookingCardBoxProps = {
  bookings: BookingSummary[];
};

export default function BookingCardBox({ bookings }: BookingCardBoxProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <CalendarDays className="mx-auto text-slate-400" size={42} />
        <h2 className="mt-4 text-xl font-semibold text-slate-800">
          No upcoming bookings
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Pick a classroom and time period from the rooms page when you are ready
          to reserve one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

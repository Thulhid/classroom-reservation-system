import { CalendarDays } from "lucide-react";

import BookingCard from "@/features/bookings/components/BookingCard";
import type { BookingSummary } from "@/features/bookings/types";

type BookingCardBoxProps = {
  bookings: BookingSummary[];
  emptyDescription?: string;
  emptyTitle?: string;
  onBookingDeleted?: () => void;
  onBookingUpdated?: () => void;
};

export default function BookingCardBox({
  bookings,
  emptyDescription = "Pick a classroom and time period from the rooms page when you are ready to reserve one.",
  emptyTitle = "No upcoming bookings",
  onBookingDeleted,
  onBookingUpdated,
}: BookingCardBoxProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <CalendarDays className="mx-auto text-slate-400" size={42} />
        <h2 className="mt-4 text-xl font-semibold text-slate-800">
          {emptyTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onDeleted={onBookingDeleted}
          onUpdated={onBookingUpdated}
        />
      ))}
    </div>
  );
}

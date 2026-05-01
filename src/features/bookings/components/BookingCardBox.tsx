import BookingCard from "@/features/bookings/components/BookingCard";
import type { BookingSummary } from "@/features/bookings/types/bookingTypes";
import Empty from "@/features/shared/components/Empty";

type BookingCardBoxProps = {
  bookings: BookingSummary[];
  emptyDescription?: string;
  emptyTitle?: string;
  onBookingDeleted?: () => void;
  onBookingUpdated?: () => void;
};

export default function BookingCardBox({
  bookings,
  onBookingDeleted,
  onBookingUpdated,
}: BookingCardBoxProps) {
  if (bookings.length === 0) {
    return <Empty resourceName="bookings" />;
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

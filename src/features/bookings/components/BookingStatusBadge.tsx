import { getBookingDisplayStatus } from "@/features/bookings/lib/bookingStatus";
import type { BookingSummary } from "@/features/bookings/types";
import Badge from "@/features/shared/components/Badge";

type BookingStatusBadgeProps = {
  booking: Pick<BookingSummary, "startsAt" | "endsAt">;
};

export default function BookingStatusBadge({
  booking,
}: BookingStatusBadgeProps) {
  const status = getBookingDisplayStatus(booking);

  return (
    <Badge styles={`inline-flex shrink-0 items-center ${status.badgeStyles}`}>
      {status.label}
    </Badge>
  );
}

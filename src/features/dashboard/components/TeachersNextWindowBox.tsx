import {
  BookingPeriod,
  formatBookingDate,
  formatBookingTimeRange,
} from "@/features/bookings/lib/dateTime";
import { BookingSummary } from "@/features/bookings/types/bookingTypes";
import TeachersNextWindowCard from "./TeachersNextWindowCard";
import Empty from "@/features/shared/components/Empty";

export default function TeachersNextWindow({
  upcomingBookings,
  period,
}: {
  upcomingBookings: BookingSummary[];
  period: BookingPeriod;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Next availability window
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          {formatBookingDate(period.startsAt)} at{" "}
          {formatBookingTimeRange(period.startsAt, period.endsAt)}
        </p>
      </div>
      <div className="mt-5">
        {upcomingBookings.length > 0 ? (
          <>
            <h3 className="text-sm font-semibold text-slate-700">
              Your next bookings
            </h3>
            <div className="mt-3 grid gap-3">
              {upcomingBookings.map((booking) => (
                <TeachersNextWindowCard
                  key={booking.id}
                  purpose={booking.purpose}
                  roomName={booking.roomName}
                  startsAt={booking.startsAt}
                  endsAt={booking.endsAt}
                />
              ))}
            </div>
          </>
        ) : (
          <Empty resourceName="upcoming bookings" />
        )}
      </div>
    </div>
  );
}

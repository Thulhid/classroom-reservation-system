import {
  formatBookingDate,
  formatBookingTimeRange,
} from "@/features/bookings/lib/dateTime";

export default function TeachersNextWindowCard({
  id,
  roomName,
  startsAt,
  endsAt,
}: {
  id: string;
  roomName: string;
  startsAt: Date;
  endsAt: Date;
}) {
  return (
    <div
      key={id}
      className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm"
    >
      <p className="font-medium text-slate-800">{roomName}</p>
      <p className="mt-1 text-slate-600">
        {formatBookingDate(startsAt)} at{" "}
        {formatBookingTimeRange(startsAt, endsAt)}
      </p>
    </div>
  );
}

import { Clock, DoorOpen } from "lucide-react";

import {
  formatBookingDate,
  formatBookingTimeRange,
} from "@/features/bookings/lib/dateTime";

export default function TeachersNextWindowCard({
  purpose,
  roomName,
  startsAt,
  endsAt,
}: {
  purpose?: string | null;
  roomName: string;
  startsAt: Date;
  endsAt: Date;
}) {
  const title = purpose?.trim() || "Classroom booking";

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
      <div className="flex min-w-0 items-start gap-3">
        <div className="min-w-0">
          <p className="font-semibold wrap-break-word text-slate-800">
            {title}
          </p>
          <div className="mt-2 flex flex-col gap-1.5 text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
            <span className="inline-flex items-center gap-1.5">
              <DoorOpen size={15} className="text-sky-600" />
              {roomName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} className="text-sky-600" />
              {formatBookingDate(startsAt)} at{" "}
              {formatBookingTimeRange(startsAt, endsAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

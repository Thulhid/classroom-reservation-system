import { Search } from "lucide-react";

import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import type { BookingPeriod } from "@/features/bookings/lib/dateTime";

type AvailabilitySearchFormProps = {
  period: BookingPeriod;
  error?: string | null;
};

export default function AvailabilitySearchForm({
  period,
  error,
}: AvailabilitySearchFormProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-700 sm:mb-5">
        Search Availability
      </h2>
      <form
        action="/rooms"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium text-slate-700">
            Date
          </label>
          <Input id="date" name="date" type="date" defaultValue={period.date} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="startTime"
            className="text-sm font-medium text-slate-700"
          >
            Start time
          </label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            defaultValue={period.startTime}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="endTime"
            className="text-sm font-medium text-slate-700"
          >
            End time
          </label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            defaultValue={period.endTime}
          />
        </div>

        <div className="flex items-end">
          <Button
            buttonType="submit"
            className="h-10 w-full gap-2 px-5 lg:w-auto"
          >
            <Search size={16} />
            Check
          </Button>
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-500 sm:col-span-2 lg:col-span-4">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}

//  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
//         <Building2 size={16} className="text-sky-600" />
//         Showing availability for{" "}
//         <span className="font-medium text-slate-800">
//           {formatBookingDate(period.startsAt)}
//         </span>
//         <span className="font-medium text-slate-800">
//           {formatBookingTimeRange(period.startsAt, period.endsAt)}
//         </span>
//       </div>

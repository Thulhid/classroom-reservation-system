import Link from "next/link";
import { Search, X } from "lucide-react";

import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import type { BookingPeriod } from "@/features/bookings/lib/dateTime";

type RoomSearchBarProps = {
  period: BookingPeriod;
  searchQuery: string;
  resultCount: number;
  totalCount: number;
};

export default function RoomSearchBar({
  period,
  searchQuery,
  resultCount,
  totalCount,
}: RoomSearchBarProps) {
  const clearSearchParams = new URLSearchParams({
    date: period.date,
    startTime: period.startTime,
    endTime: period.endTime,
  });

  return (
    <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-700">Search Rooms</h2>
      </div>

      <form action="/rooms" className="flex gap-3">
        <input type="hidden" name="date" value={period.date} />
        <input type="hidden" name="startTime" value={period.startTime} />
        <input type="hidden" name="endTime" value={period.endTime} />

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />

          <Input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by room number or name"
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button buttonType="submit" className="h-10 px-5">
            Search
          </Button>

          {searchQuery ? (
            <Link
              href={`/rooms?${clearSearchParams.toString()}`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <X size={16} />
              Clear
            </Link>
          ) : null}
        </div>
      </form>
      <p className="mt-4 text-sm font-medium text-slate-500">
        Showing <span className="text-slate-800">{resultCount}</span> of{" "}
        <span className="text-slate-800">{totalCount}</span> rooms
      </p>
    </div>
  );
}

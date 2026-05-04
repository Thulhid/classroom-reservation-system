import { BarChart3 } from "lucide-react";

import type { RoomUtilizationPoint } from "@/features/dashboard/services/dashboardService";

type RoomUtilizationChartProps = {
  data: RoomUtilizationPoint[];
  rangeLabel: string;
};

function getBarWidth(bookedHours: number, maxBookedHours: number) {
  if (maxBookedHours <= 0) {
    return "0%";
  }

  return `${Math.max(8, (bookedHours / maxBookedHours) * 100)}%`;
}

export default function RoomUtilizationChart({
  data,
  rangeLabel,
}: RoomUtilizationChartProps) {
  const maxBookedHours = Math.max(0, ...data.map((room) => room.bookedHours));
  const hasUtilization = data.some((room) => room.bookedHours > 0);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600">
            <BarChart3 size={18} />
            <h2 className="text-lg font-semibold text-slate-800">
              Room utilization
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">{rangeLabel}</p>
        </div>
        <p className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Top {data.length}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {data.map((room) => (
          <div key={room.roomId}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {room.roomName}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Room {room.roomNumber} · {room.bookings} bookings
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-slate-700">
                {room.bookedHours}h
              </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: getBarWidth(room.bookedHours, maxBookedHours),
                }}
              />
            </div>
          </div>
        ))}

        {!hasUtilization ? (
          <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
            No room bookings in this period.
          </p>
        ) : null}
      </div>
    </section>
  );
}

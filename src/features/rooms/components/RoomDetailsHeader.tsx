import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  DoorOpen,
  Users,
  XCircle,
} from "lucide-react";

import type { BookingSummary } from "@/features/bookings/types/bookingTypes";
import {
  formatBookingDate,
  formatBookingTimeRange,
} from "@/features/bookings/lib/dateTime";
import type { Classroom } from "@/features/rooms/services/roomService";

type RoomDetailsHeaderProps = {
  room: Classroom;
  activeBooking: BookingSummary | null;
};

export default function RoomDetailsHeader({
  room,
  activeBooking,
}: RoomDetailsHeaderProps) {
  const isBooked = Boolean(activeBooking);

  return (
    <div className="space-y-5">
      <Link
        href="/rooms"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
      >
        <ArrowLeft size={16} />
        Back to rooms
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-sky-600">
            <DoorOpen size={16} />
            {room.floor}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-800 sm:text-4xl">
            {room.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            View room photos, available objects, and recent booking activity for
            this classroom.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users size={16} />
              Capacity
            </div>
            <p className="mt-1 text-2xl font-semibold text-slate-800">
              {room.capacity}
            </p>
          </div>

          <div
            className={`rounded-lg border p-4 shadow-sm ${
              isBooked
                ? "border-red-100 bg-red-50"
                : "border-emerald-100 bg-emerald-50"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                isBooked ? "text-red-700" : "text-emerald-700"
              }`}
            >
              {isBooked ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
              {isBooked ? "Booked now" : "Available now"}
            </div>
            <p
              className={`mt-1 text-sm ${
                isBooked ? "text-red-800" : "text-emerald-800"
              }`}
            >
              {activeBooking
                ? `${formatBookingDate(activeBooking.startsAt)} at ${formatBookingTimeRange(
                    activeBooking.startsAt,
                    activeBooking.endsAt,
                  )}`
                : "No active booking for this room."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

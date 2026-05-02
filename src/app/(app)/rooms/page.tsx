import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getClassroomAvailability } from "@/features/bookings/services/bookingService";
import { resolveAvailabilityPeriod } from "@/features/bookings/lib/dateTime";
import AvailabilitySearchForm from "@/features/rooms/components/AvailabilitySearchForm";
import RoomCardBox from "@/features/rooms/components/RoomCardBox";
import Badge from "@/features/shared/components/Badge";
import { Suspense } from "react";
import Spinner from "@/features/shared/components/Spinner";

type RoomsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const { period, error } = resolveAvailabilityPeriod(resolvedSearchParams);
  const rooms = await getClassroomAvailability(period);
  const availableRooms = rooms.filter((room) => !room.booking).length;
  const bookedRooms = rooms.length - availableRooms;

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <h1 className="mt-1 text-2xl font-semibold text-slate-800 sm:text-4xl">
          Rooms
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge styles={"bg-emerald-500 text-emerald-50"}>
            Free {availableRooms}
          </Badge>
          <Badge styles={"bg-red-500 text-red-50"}>Booked {bookedRooms}</Badge>
          <Badge styles={"bg-slate-500 text-slate-50"}>
            Total {rooms.length}
          </Badge>
        </div>
      </div>

      <AvailabilitySearchForm period={period} error={error} />

      <Suspense fallback={<Spinner className="mx-auto mt-15" size={50} />}>
        <RoomCardBox rooms={rooms} />
      </Suspense>
    </>
  );
}

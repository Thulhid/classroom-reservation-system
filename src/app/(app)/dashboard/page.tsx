import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/features/shared/ui/button";
import {
  getClassroomAvailability,
  getUpcomingTeacherBookings,
  ROOM_AVAILABILITY_MATRIX_DEFAULT_BLOCKS,
  ROOM_AVAILABILITY_MATRIX_DEFAULT_START_TIME,
  ROOM_AVAILABILITY_MATRIX_MAX_BLOCKS,
  ROOM_AVAILABILITY_MATRIX_MIN_BLOCKS,
} from "@/features/bookings/services/bookingService";
import {
  getDefaultBookingPeriod,
  parseLocalDateTime,
} from "@/features/bookings/lib/dateTime";
import { Suspense } from "react";
import Spinner from "@/features/shared/components/Spinner";
import Stats from "@/features/dashboard/components/Stats";
import TeachersNextWindowBox from "@/features/dashboard/components/TeachersNextWindowBox";
import RoomAvailabilityMatrix from "@/features/dashboard/components/RoomAvailabilityMatrix";

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getMatrixBlockCount(value: string | string[] | undefined) {
  const blockCount = Number(getFirstSearchValue(value));

  if (!Number.isInteger(blockCount)) {
    return ROOM_AVAILABILITY_MATRIX_DEFAULT_BLOCKS;
  }

  return Math.min(
    ROOM_AVAILABILITY_MATRIX_MAX_BLOCKS,
    Math.max(ROOM_AVAILABILITY_MATRIX_MIN_BLOCKS, blockCount),
  );
}

function getMatrixStartTime(value: string | string[] | undefined) {
  const startTime = getFirstSearchValue(value)?.trim();

  return startTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)
    ? startTime
    : ROOM_AVAILABILITY_MATRIX_DEFAULT_START_TIME;
}

function getMatrixDate(
  value: string | string[] | undefined,
  fallbackDate: string,
  startTime: string,
) {
  const date = getFirstSearchValue(value)?.trim() || fallbackDate;

  return parseLocalDateTime(date, startTime) ? date : fallbackDate;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const roleLabel =
    session.user.role === "ADMIN"
      ? "Admin"
      : session.user.role === "TEACHER"
        ? "Teacher"
        : "Student";
  const roomsHref = session.user.role === "ADMIN" ? "/admin/rooms" : "/rooms";
  const period = getDefaultBookingPeriod();
  const matrixStartTime = getMatrixStartTime(
    resolvedSearchParams.matrixStartTime,
  );
  const matrixDate = getMatrixDate(
    resolvedSearchParams.matrixDate,
    period.date,
    matrixStartTime,
  );
  const matrixBlockCount = getMatrixBlockCount(
    resolvedSearchParams.matrixBlocks,
  );
  const rooms = await getClassroomAvailability(period);
  const availableRooms = rooms.filter((room) => !room.booking).length;
  const upcomingBookings =
    session.user.role === "TEACHER"
      ? await getUpcomingTeacherBookings(session.user.id, 3)
      : [];

  return (
    <>
      <div className="flex items-center justify-between gap-4 lg:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">{roleLabel}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-800 sm:text-4xl">
            Welcome, {session.user.firstName}
          </h1>
        </div>

        <div className="flex gap-3">
          <Button link={roomsHref} className="gap-2 px-5">
            Rooms
            <ArrowRight size={16} />
          </Button>
          {session.user.role === "ADMIN" ? (
            <Button
              link="/admin/users"
              variant="outline"
              className="w-full border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-100 sm:w-auto"
            >
              Users
            </Button>
          ) : null}
          {session.user.role === "TEACHER" ? (
            <Button
              link="/bookings"
              variant="secondary"
              className="w-full border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-100 sm:w-auto"
            >
              My Bookings
            </Button>
          ) : null}
        </div>
      </div>

      <Suspense fallback={<Spinner className="mx-auto mt-15" size={50} />}>
        <Stats roomsLength={rooms.length} availableRooms={availableRooms} />

        {session.user.role === "TEACHER" ? (
          <TeachersNextWindowBox
            upcomingBookings={upcomingBookings}
            period={period}
          />
        ) : null}

        {session.user.role !== "ADMIN" ? (
          <RoomAvailabilityMatrix
            blockCount={matrixBlockCount}
            date={matrixDate}
            showMine={session.user.role === "TEACHER"}
            startTime={matrixStartTime}
            viewerUserId={
              session.user.role === "TEACHER" ? session.user.id : undefined
            }
          />
        ) : null}
      </Suspense>
    </>
  );
}

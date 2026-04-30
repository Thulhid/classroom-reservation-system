import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/features/shared/ui/button";
import {
  getClassroomAvailability,
  getUpcomingTeacherBookings,
} from "@/features/bookings/services/bookingService";
import { getDefaultBookingPeriod } from "@/features/bookings/lib/dateTime";
import { Suspense } from "react";
import Spinner from "@/features/shared/components/Spinner";
import Stats from "@/features/dashboard/components/Stats";
import TeachersNextWindowBox from "@/features/dashboard/components/TeachersNextWindowBox";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const roleLabel = session.user.role === "TEACHER" ? "Teacher" : "Student";
  const period = getDefaultBookingPeriod();
  const rooms = await getClassroomAvailability(period);
  const availableRooms = rooms.filter((room) => !room.booking).length;
  const upcomingBookings =
    session.user.role === "TEACHER"
      ? await getUpcomingTeacherBookings(session.user.id, 3)
      : [];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">{roleLabel}</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-800 sm:text-4xl">
              Welcome, {session.user.firstName}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button link="/rooms" className="gap-2 px-5">
              Rooms
              <ArrowRight size={16} />
            </Button>
            {session.user.role === "TEACHER" ? (
              <Button
                link="/bookings"
                variant="secondary"
                className="border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-100"
              >
                My Bookings
              </Button>
            ) : null}
          </div>
        </div>

        <Suspense fallback={<Spinner className="mx-auto mt-15" size={50} />}>
          <Stats roomsLength={rooms.length} availableRooms={availableRooms} />

          {session.user.role === "TEACHER" && (
            <TeachersNextWindowBox
              upcomingBookings={upcomingBookings}
              period={period}
            />
          )}
        </Suspense>
      </section>
    </main>
  );
}

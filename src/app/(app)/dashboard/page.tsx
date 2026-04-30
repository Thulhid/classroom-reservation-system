import { redirect } from "next/navigation";
import { ArrowRight, CalendarCheck, DoorOpen, Users } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/features/shared/ui/button";
import {
  getClassroomAvailability,
  getUpcomingTeacherBookings,
} from "@/features/bookings/services/bookingService";
import {
  formatBookingDate,
  formatBookingTimeRange,
  getDefaultBookingPeriod,
} from "@/features/bookings/lib/dateTime";

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
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              See classroom availability, room objects, and reservation status
              from one place.
            </p>
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

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <DoorOpen className="text-sky-600" size={24} />
            <p className="mt-4 text-sm text-slate-500">Faculty rooms</p>
            <p className="mt-1 text-3xl font-semibold text-slate-800">
              {rooms.length}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
            <Users className="text-emerald-600" size={24} />
            <p className="mt-4 text-sm text-slate-500">Free next hour</p>
            <p className="mt-1 text-3xl font-semibold text-emerald-700">
              {availableRooms}
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-white p-5 shadow-sm">
            <CalendarCheck className="text-red-600" size={24} />
            <p className="mt-4 text-sm text-slate-500">Booked next hour</p>
            <p className="mt-1 text-3xl font-semibold text-red-700">
              {rooms.length - availableRooms}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Next availability window
            </h2>
            <p className="text-sm text-slate-500">
              {formatBookingDate(period.startsAt)} at{" "}
              {formatBookingTimeRange(period.startsAt, period.endsAt)}
            </p>
          </div>

          {session.user.role === "TEACHER" ? (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-slate-700">
                Your next bookings
              </h3>
              {upcomingBookings.length > 0 ? (
                <div className="mt-3 grid gap-3">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm"
                    >
                      <p className="font-medium text-slate-800">
                        {booking.roomName}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {formatBookingDate(booking.startsAt)} at{" "}
                        {formatBookingTimeRange(
                          booking.startsAt,
                          booking.endsAt,
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  You do not have upcoming bookings yet.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-600">
              Students can use the rooms page to see which classrooms are booked
              and what objects are available inside each room.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

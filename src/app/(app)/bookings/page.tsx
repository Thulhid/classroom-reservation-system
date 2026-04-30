import { redirect } from "next/navigation";
import { CalendarPlus } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/features/shared/ui/button";
import BookingCardBox from "@/features/bookings/components/BookingCardBox";
import { getUpcomingTeacherBookings } from "@/features/bookings/services/bookingService";

export default async function BookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER") {
    redirect("/rooms");
  }

  const bookings = await getUpcomingTeacherBookings(session.user.id);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">Teacher schedule</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-800 sm:text-4xl">
              My Bookings
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Your upcoming classroom bookings are listed here. The booking
              rules prevent you from holding two rooms during the same time.
            </p>
          </div>

          <Button link="/rooms" className="w-full gap-2 px-5 sm:w-auto">
            <CalendarPlus size={16} />
            Book room
          </Button>
        </div>

        <BookingCardBox bookings={bookings} />
      </section>
    </main>
  );
}

import { notFound, redirect } from "next/navigation";
import { isWithinInterval } from "date-fns";

import { auth } from "@/auth";
import { resolveAvailabilityPeriod } from "@/features/bookings/lib/dateTime";
import { getRoomBookingHistory } from "@/features/bookings/services/bookingService";
import RoomBookingBox from "@/features/rooms/components/RoomBookingBox";
import RoomBookingHistory from "@/features/rooms/components/RoomBookingHistory";
import RoomDetailsHeader from "@/features/rooms/components/RoomDetailsHeader";
import RoomObjectsBox from "@/features/rooms/components/RoomObjectsBox";
import { getRoomByNumber } from "@/features/rooms/services/roomService";
import ImageCarousel from "@/features/rooms/components/ImageCarousel";

type RoomDetailsPageProps = {
  params: Promise<{
    roomNumber: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RoomDetailsPage({
  params,
  searchParams,
}: RoomDetailsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { roomNumber } = await params;
  const resolvedSearchParams = await searchParams;
  const room = await getRoomByNumber(roomNumber);
  const isTeacher = session.user.role === "TEACHER";

  if (!room) {
    notFound();
  }

  const bookingHistory = await getRoomBookingHistory(
    room.id,
    12,
    isTeacher ? session.user.id : undefined,
  );
  const { period: bookingPeriod } =
    resolveAvailabilityPeriod(resolvedSearchParams);
  const now = new Date();
  const activeBooking =
    bookingHistory.find((booking) =>
      isWithinInterval(now, {
        start: booking.startsAt,
        end: booking.endsAt,
      }),
    ) ?? null;

  return (
    <>
      <RoomDetailsHeader room={room} activeBooking={activeBooking} />

      <ImageCarousel photos={room.photos} />

      <div
        className={`grid gap-5 sm:gap-6 ${isTeacher ? "lg:grid-cols-2" : "lg:grid-cols-[1fr_2fr]"}`}
      >
        {isTeacher ? (
          <RoomBookingBox period={bookingPeriod} room={room} />
        ) : null}
        <RoomObjectsBox amenities={room.amenities} objects={room.objects} />
        {!isTeacher ? <RoomBookingHistory bookings={bookingHistory} /> : null}
      </div>

      {isTeacher ? <RoomBookingHistory bookings={bookingHistory} /> : null}
    </>
  );
}

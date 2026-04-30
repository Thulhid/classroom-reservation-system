import BookingForm from "@/features/bookings/components/BookingForm";
import type { BookingPeriod } from "@/features/bookings/lib/dateTime";
import type { Classroom } from "@/features/rooms/services/roomService";

type RoomBookingBoxProps = {
  period: Pick<BookingPeriod, "date" | "startTime" | "endTime">;
  room: Pick<Classroom, "id" | "name">;
};

export default function RoomBookingBox({ period, room }: RoomBookingBoxProps) {
  return (
    <BookingForm
      rooms={[room]}
      period={period}
      lockedRoomId={room.id}
      title={`Book ${room.name}`}
      description="Reserve this classroom for your selected teaching period."
      variant="compact"
    />
  );
}

import type { ClassroomAvailability } from "@/features/bookings/services/bookingService";
import RoomCard from "@/features/rooms/components/RoomCard";

type RoomCardBoxProps = {
  rooms: ClassroomAvailability[];
};

export default async function RoomCardBox({ rooms }: RoomCardBoxProps) {
  return (
    <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

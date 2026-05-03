import type { ClassroomAvailability } from "@/features/bookings/services/bookingService";
import RoomCard from "@/features/rooms/components/RoomCard";
import Empty from "@/features/shared/components/Empty";

type RoomCardBoxProps = {
  rooms: ClassroomAvailability[];
  searchQuery?: string;
};

export default async function RoomCardBox({ rooms }: RoomCardBoxProps) {
  if (rooms.length === 0) {
    return <Empty resourceName="rooms" />;
  }

  return (
    <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

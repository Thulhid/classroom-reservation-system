import AdminRoomsPanel from "@/features/admin/rooms/components/AdminRoomsPanel";
import { requireAdminUser } from "@/features/admin/rooms/lib/adminRoomAccess";
import { getAdminRooms } from "@/features/admin/rooms/services/adminRoomService";

export default async function AdminRoomsPage() {
  await requireAdminUser();

  const rooms = await getAdminRooms();

  return (
    <>
      <AdminRoomsPanel rooms={rooms} />
    </>
  );
}

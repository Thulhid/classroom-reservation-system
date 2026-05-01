import AdminRoomsPanel from "@/features/rooms/components/admin/AdminRoomsPanel";
import { requireAdminUser } from "@/features/rooms/lib/adminRoomAccess";
import { getAdminRooms } from "@/features/rooms/services/adminRoomService";

export default async function AdminRoomsPage() {
  await requireAdminUser();

  const rooms = await getAdminRooms();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <AdminRoomsPanel rooms={rooms} />
    </main>
  );
}

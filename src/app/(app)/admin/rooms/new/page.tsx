import AdminRoomEditorPage from "@/features/rooms/components/admin/AdminRoomEditorPage";
import { requireAdminUser } from "@/features/rooms/lib/adminRoomAccess";

export default async function AdminNewRoomPage() {
  await requireAdminUser();

  return <AdminRoomEditorPage />;
}

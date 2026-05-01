import { notFound } from "next/navigation";

import AdminRoomEditorPage from "@/features/rooms/components/admin/AdminRoomEditorPage";
import { requireAdminUser } from "@/features/rooms/lib/adminRoomAccess";
import { getAdminRoomById } from "@/features/rooms/services/adminRoomService";

type AdminEditRoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function AdminEditRoomPage({
  params,
}: AdminEditRoomPageProps) {
  await requireAdminUser();

  const { roomId } = await params;
  const room = await getAdminRoomById(roomId);

  if (!room) {
    notFound();
  }

  return <AdminRoomEditorPage room={room} />;
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import AdminRoomForm from "@/features/admin/rooms/components/AdminRoomForm";
import { requireAdminUser } from "@/features/admin/rooms/lib/adminRoomAccess";
import { getAdminRoomById } from "@/features/admin/rooms/services/adminRoomService";

type AdminUpdateRoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function AdminUpdateRoomPage({
  params,
}: AdminUpdateRoomPageProps) {
  await requireAdminUser();

  const { roomId } = await params;
  const room = await getAdminRoomById(roomId);

  if (!room) {
    notFound();
  }

  return (
    <>
      <Link
        href="/admin/rooms"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
      >
        <ArrowLeft className="size-4" />
        Back to rooms
      </Link>

      <AdminRoomForm room={room} />
    </>
  );
}

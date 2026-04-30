import { notFound, redirect } from "next/navigation";

import { getRoomByNumber } from "@/features/rooms/services/roomService";

type RoomNumberRedirectPageProps = {
  params: Promise<{
    roomNumber: string;
  }>;
};

export default async function RoomNumberRedirectPage({
  params,
}: RoomNumberRedirectPageProps) {
  const { roomNumber } = await params;

  if (!(await getRoomByNumber(roomNumber))) {
    notFound();
  }

  redirect(`/rooms/${roomNumber}`);
}

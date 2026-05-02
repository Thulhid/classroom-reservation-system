"use client";

import { CircleOff, Image as ImageIcon, Users } from "lucide-react";
import type { Room } from "@/generated/prisma/client";

import AdminRoomRowActions from "@/features/admin/rooms/components/AdminRoomRowActions";
import CloudinaryImage from "@/features/shared/components/CloudinaryImage";
import { getRoomImageDeliveryProps } from "@/features/rooms/lib/roomImages";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/ui/table";

type AdminRoomsTableProps = {
  rooms: Room[];
};

function getRoomFeatureSummary(room: Room) {
  return [
    room.presentationSystem ? "Presentation" : null,
    room.projector ? "Projector" : null,
    room.internetAccess ? "Wi-Fi" : null,
    room.airConditioned ? "A/C" : null,
  ].filter(Boolean) as string[];
}

export default function AdminRoomsTable({ rooms }: AdminRoomsTableProps) {
  if (rooms.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <CircleOff className="mx-auto size-10 text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          No rooms available
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add your first classroom to start managing names, photos, capacity,
          and facilities from one place.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Room</TableHead>
          <TableHead>Floor</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Setup</TableHead>
          <TableHead className="w-16 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rooms.map((room) => {
          const featureSummary = getRoomFeatureSummary(room);

          return (
            <TableRow key={room.id}>
              <TableCell>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {room.coverImage ? (
                      <CloudinaryImage
                        src={room.coverImage}
                        alt={`${room.name} cover photo`}
                        {...getRoomImageDeliveryProps("tableThumb")}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <ImageIcon className="size-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">
                      {room.name}
                    </p>
                    <p className="mt-1 text-xs tracking-wide text-slate-500 uppercase">
                      Room {room.number}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>{room.floor}</TableCell>

              <TableCell>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  <Users className="size-3.5" />
                  {room.capacity} seats
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {featureSummary.length > 0 ? (
                    featureSummary.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700"
                      >
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      No extra facilities
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <AdminRoomRowActions room={room} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

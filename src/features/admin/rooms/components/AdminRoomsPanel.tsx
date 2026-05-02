"use client";

import { Plus } from "lucide-react";
import type { Room } from "@/generated/prisma/client";

import AdminRoomsTable from "@/features/admin/rooms/components/AdminRoomsTable";
import Badge from "@/features/shared/components/Badge";
import { Button } from "@/features/shared/ui/button";

type AdminRoomsPanelProps = {
  rooms: Room[];
};

export default function AdminRoomsPanel({ rooms }: AdminRoomsPanelProps) {
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const presentationReadyCount = rooms.filter(
    (room) => room.presentationSystem || room.projector,
  ).length;

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-600">Admin panel</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-800 sm:text-4xl">
            Room management
          </h1>
        </div>

        <Button link="/admin/rooms/create" className="gap-2 px-5 py-2 text-sm">
          <Plus className="size-4" />
          Add room
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <Badge styles="bg-sky-500 text-sky-50">Active {rooms.length}</Badge>
        <Badge styles="bg-emerald-500 text-emerald-50">
          Capacity {totalCapacity}
        </Badge>
        <Badge styles="bg-amber-500 text-amber-50">
          Presentation {presentationReadyCount}
        </Badge>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Classroom inventory
          </h2>
        </div>

        <div className="px-2 pb-2 sm:px-4 sm:pb-4">
          <AdminRoomsTable rooms={rooms} />
        </div>
      </div>
    </>
  );
}

"use client";

import { Building2, Plus, Presentation, Users } from "lucide-react";
import type { Room } from "@/generated/prisma/client";

import AdminRoomsTable from "@/features/rooms/components/admin/AdminRoomsTable";
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
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">Admin panel</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-800 sm:text-4xl">
              Room management
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Keep classroom names, room photos, and facility details accurate.
              Deleting a room safely retires it from active booking after
              current and future reservations are cleared.
            </p>
          </div>

          <Button link="/admin/rooms/new" className="gap-2 px-5 py-2 text-sm">
            <Plus className="size-4" />
            Add room
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active rooms</p>
                <p className="mt-3 text-3xl font-semibold text-slate-800">
                  {rooms.length}
                </p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
                <Building2 className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total seat capacity</p>
                <p className="mt-3 text-3xl font-semibold text-slate-800">
                  {totalCapacity}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <Users className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Presentation ready</p>
                <p className="mt-3 text-3xl font-semibold text-slate-800">
                  {presentationReadyCount}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <Presentation className="size-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Classroom inventory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review active rooms, then move into dedicated create and edit
              screens for cleaner room administration.
            </p>
          </div>

          <div className="px-2 pb-2 sm:px-4 sm:pb-4">
            <AdminRoomsTable rooms={rooms} />
          </div>
        </div>
      </section>
    </>
  );
}

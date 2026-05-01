import Link from "next/link";
import { ArrowLeft, PencilLine, Plus } from "lucide-react";
import type { Room } from "@/generated/prisma/client";

import AdminRoomForm from "@/features/rooms/components/admin/AdminRoomForm";

type AdminRoomEditorPageProps = {
  room?: Room | null;
};

export default function AdminRoomEditorPage({
  room,
}: AdminRoomEditorPageProps) {
  const isEditMode = Boolean(room);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <Link
          href="/admin/rooms"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
        >
          <ArrowLeft className="size-4" />
          Back to rooms
        </Link>

        <div className="rounded-[2rem] border border-slate-200 bg-linear-to-br from-white via-white to-sky-50/70 p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              {isEditMode ? (
                <PencilLine className="size-5" />
              ) : (
                <Plus className="size-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-sky-600">Admin panel</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-800 sm:text-4xl">
                {isEditMode ? "Update room" : "Create room"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                {isEditMode
                  ? "Update room details, replace room photos, and keep classroom metadata accurate for booking."
                  : "Create a new classroom entry with direct image uploads, standardized crops, and room setup details."}
              </p>
            </div>
          </div>
        </div>

        <AdminRoomForm room={room} />
      </section>
    </main>
  );
}

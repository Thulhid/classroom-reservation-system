import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import AdminRoomForm from "@/features/admin/rooms/components/AdminRoomForm";
import { requireAdminUser } from "@/features/admin/rooms/lib/adminRoomAccess";

export default async function AdminCreateRoomPage() {
  await requireAdminUser();

  return (
    <>
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
            <Plus className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-sky-600">Admin panel</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-800 sm:text-4xl">
              Create room
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Create a new classroom entry with direct image uploads,
              standardized crops, and room setup details.
            </p>
          </div>
        </div>
      </div>

      <AdminRoomForm />
    </>
  );
}

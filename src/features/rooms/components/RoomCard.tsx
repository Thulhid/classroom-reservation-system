import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  DoorOpen,
  Users,
  XCircle,
} from "lucide-react";

import type { ClassroomAvailability } from "@/features/bookings/services/bookingService";
import CloudinaryImage from "@/features/shared/components/CloudinaryImage";
import Badge from "@/features/shared/components/Badge";

type RoomCardProps = {
  room: ClassroomAvailability;
};

export default function RoomCard({ room }: RoomCardProps) {
  const isBooked = Boolean(room.booking);
  const coverPhoto = room.photos[0];

  return (
    <article className="flex h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex w-full flex-col">
        <div className="relative h-44 bg-slate-200">
          {coverPhoto ? (
            <CloudinaryImage
              src={coverPhoto.src}
              alt={coverPhoto.alt}
              fill
              crop={{
                type: "fill",
                gravity: "center",
              }}
              format="webp"
              quality="auto"
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/35 to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-500">
                <DoorOpen size={16} />
                <span className="text-sm">{room.floor}</span>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-slate-800">
                {room.name}
              </h2>
            </div>

            <Badge
              styles={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                isBooked
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {isBooked ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
              {isBooked ? "Booked" : "Available"}
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Users size={16} className="text-slate-400" />
            Capacity {room.capacity}
          </div>

          <div className="mt-5 flex flex-1 flex-col justify-end">
            <Link
              href={`/rooms/${room.number}`}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              View details
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

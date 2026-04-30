import {
  MonitorPlay,
  Projector,
  Snowflake,
  Wifi,
} from "lucide-react";

import type { ClassroomAmenity } from "@/features/rooms/services/roomService";

type RoomAmenitiesListProps = {
  amenities: ClassroomAmenity[];
  compact?: boolean;
};

function AmenityIcon({ name }: { name: string }) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("projector")) {
    return <Projector size={18} className="text-sky-600" />;
  }

  if (normalizedName.includes("internet")) {
    return <Wifi size={18} className="text-sky-600" />;
  }

  if (normalizedName.includes("climate")) {
    return <Snowflake size={18} className="text-sky-600" />;
  }

  return <MonitorPlay size={18} className="text-sky-600" />;
}

export default function RoomAmenitiesList({
  amenities,
  compact = false,
}: RoomAmenitiesListProps) {
  return (
    <div className={compact ? "grid gap-2 sm:grid-cols-2" : "grid gap-3"}>
      {amenities.map((amenity) => (
        <div
          key={amenity.name}
          className={`flex items-center gap-3 rounded-md border px-3 py-2 ${
            amenity.available
              ? "border-sky-100 bg-sky-50"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <AmenityIcon name={amenity.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {amenity.name}
            </p>
            <p className="truncate text-xs text-slate-500">{amenity.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

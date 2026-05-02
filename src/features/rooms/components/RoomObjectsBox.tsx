import { PanelTop, Presentation, Table2 } from "lucide-react";

import type {
  ClassroomAmenity,
  ClassroomObject,
} from "@/features/rooms/services/roomService";
import RoomAmenitiesList from "@/features/rooms/components/RoomAmenitiesList";

type RoomObjectsBoxProps = {
  amenities: ClassroomAmenity[];
  objects: ClassroomObject[];
};

function getObjectIcon(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("board")) {
    return <PanelTop size={18} className="text-sky-600" />;
  }

  if (normalizedName.includes("desk")) {
    return <Presentation size={18} className="text-sky-600" />;
  }

  return <Table2 size={18} className="text-sky-600" />;
}

export default function RoomObjectsBox({
  amenities,
  objects,
}: RoomObjectsBoxProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-semibold text-slate-800">Inside the room</h2>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-700">Facilities</h3>
        <div className="mt-3">
          <RoomAmenitiesList amenities={amenities} />
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Furniture and equipment
        </h3>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {objects.map((object) => (
          <div
            key={object.name}
            className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              {getObjectIcon(object.name)}
              <span className="truncate text-sm font-medium text-slate-700">
                {object.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {object.quantity}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

import { CalendarCheck, DoorOpen, Users } from "lucide-react";

export default function Stats({
  roomsLength,
  availableRooms,
}: {
  roomsLength: number;
  availableRooms: number;
}) {
  // async function sleep(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
  // sleep(3000);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <DoorOpen className="text-sky-600" size={24} />
        <p className="mt-4 text-sm text-slate-500">Faculty rooms</p>
        <p className="mt-1 text-3xl font-semibold text-slate-800">
          {roomsLength}
        </p>
      </div>
      <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
        <Users className="text-emerald-600" size={24} />
        <p className="mt-4 text-sm text-slate-500">Free next hour</p>
        <p className="mt-1 text-3xl font-semibold text-emerald-700">
          {availableRooms}
        </p>
      </div>
      <div className="rounded-lg border border-red-100 bg-white p-5 shadow-sm">
        <CalendarCheck className="text-red-600" size={24} />
        <p className="mt-4 text-sm text-slate-500">Booked next hour</p>
        <p className="mt-1 text-3xl font-semibold text-red-700">
          {roomsLength - availableRooms}
        </p>
      </div>
    </div>
  );
}

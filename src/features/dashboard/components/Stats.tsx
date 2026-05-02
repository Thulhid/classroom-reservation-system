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
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <DoorOpen className="text-sky-600" size={24} />
        <p className="mt-4 text-sm text-slate-500">Faculty rooms</p>
        <p className="mt-1 text-2xl font-semibold text-slate-800 sm:text-3xl">
          {roomsLength}
        </p>
      </div>
      <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
        <Users className="text-emerald-600" size={24} />
        <p className="mt-4 text-sm text-slate-500">Free next hour</p>
        <p className="mt-1 text-2xl font-semibold text-emerald-700 sm:text-3xl">
          {availableRooms}
        </p>
      </div>
      <div className="rounded-lg border border-red-100 bg-white p-4 shadow-sm sm:p-5">
        <CalendarCheck className="text-red-600" size={24} />
        <p className="mt-4 text-sm text-slate-500">Booked next hour</p>
        <p className="mt-1 text-2xl font-semibold text-red-700 sm:text-3xl">
          {roomsLength - availableRooms}
        </p>
      </div>
    </div>
  );
}

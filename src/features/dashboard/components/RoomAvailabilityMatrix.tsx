import Link from "next/link";
import { CalendarDays, DoorOpen, Users } from "lucide-react";

import {
  formatBookingDate,
  formatBookingTimeRange,
} from "@/features/bookings/lib/dateTime";
import {
  getRoomAvailabilityMatrix,
  ROOM_AVAILABILITY_MATRIX_MAX_BLOCKS,
  ROOM_AVAILABILITY_MATRIX_MIN_BLOCKS,
} from "@/features/bookings/services/bookingService";
import type {
  RoomAvailabilityMatrixCell,
  RoomAvailabilityMatrixCellStatus,
  RoomAvailabilityMatrixRow,
} from "@/features/bookings/types/bookingTypes";
import Badge from "@/features/shared/components/Badge";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import { cn } from "@/lib/utils";

type RoomAvailabilityMatrixProps = {
  blockCount: number;
  date: string;
  showMine?: boolean;
  startTime: string;
  viewerUserId?: string;
};

const roomColumnWidth = 224;
const slotColumnWidth = 118;

const cellStyles: Record<RoomAvailabilityMatrixCellStatus, string> = {
  booked: "border-red-100 bg-red-50 text-red-700",
  free: "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  mine: "border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-100",
};

function getFreeRoomHref(
  room: RoomAvailabilityMatrixRow["room"],
  cell: RoomAvailabilityMatrixCell,
) {
  const params = new URLSearchParams({
    date: cell.date,
    endTime: cell.endTime,
    startTime: cell.startTime,
  });

  return `/rooms/${room.number}?${params.toString()}`;
}

function getDisplayStatus(cell: RoomAvailabilityMatrixCell, showMine: boolean) {
  return cell.status === "mine" && !showMine ? "booked" : cell.status;
}

function getCellLabel(status: RoomAvailabilityMatrixCellStatus) {
  if (status === "free") {
    return "Free";
  }

  if (status === "mine") {
    return "Mine";
  }

  return "Booked";
}

function getCellTitle(
  room: RoomAvailabilityMatrixRow["room"],
  cell: RoomAvailabilityMatrixCell,
  status: RoomAvailabilityMatrixCellStatus,
) {
  const roomLabel = `${room.name} ${room.number}`;
  const timeLabel = formatBookingTimeRange(cell.startsAt, cell.endsAt);

  if (status === "free") {
    return `${roomLabel} is free ${timeLabel}`;
  }

  if (status === "mine") {
    return `${roomLabel} is booked by you ${timeLabel}${
      cell.purpose ? `: ${cell.purpose}` : ""
    }`;
  }

  return `${roomLabel} is booked ${timeLabel}${
    cell.teacherName ? ` by ${cell.teacherName}` : ""
  }`;
}

function MatrixCell({
  cell,
  room,
  showMine,
}: {
  cell: RoomAvailabilityMatrixCell;
  room: RoomAvailabilityMatrixRow["room"];
  showMine: boolean;
}) {
  const status = getDisplayStatus(cell, showMine);
  const className = cn(
    "flex min-h-12 w-full flex-col items-center justify-center rounded-md border px-2 py-2 text-center text-xs font-semibold transition-colors",
    cellStyles[status],
  );
  const label = getCellLabel(status);
  const title = getCellTitle(room, cell, status);

  if (status === "free") {
    return (
      <Link
        href={getFreeRoomHref(room, cell)}
        className={className}
        title={title}
      >
        {label}
      </Link>
    );
  }

  if (status === "mine") {
    return (
      <Link href="/bookings" className={className} title={title}>
        {label}
      </Link>
    );
  }

  return (
    <div className={className} title={title}>
      {label}
    </div>
  );
}

export default async function RoomAvailabilityMatrix({
  blockCount,
  date,
  showMine = false,
  startTime,
  viewerUserId,
}: RoomAvailabilityMatrixProps) {
  const matrix = await getRoomAvailabilityMatrix({
    blockCount,
    date,
    startTime,
    viewerUserId: showMine ? viewerUserId : undefined,
  });
  const firstSlot = matrix.slots[0];
  const lastSlot = matrix.slots.at(-1);
  const tableWidth = roomColumnWidth + matrix.slots.length * slotColumnWidth;
  const slotCounts = matrix.rows.reduce(
    (counts, row) => {
      for (const cell of row.cells) {
        counts[getDisplayStatus(cell, showMine)] += 1;
      }

      return counts;
    },
    {
      booked: 0,
      free: 0,
      mine: 0,
    } satisfies Record<RoomAvailabilityMatrixCellStatus, number>,
  );

  if (!firstSlot || !lastSlot) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sky-600">
            <CalendarDays size={18} />
            <h2 className="text-lg font-semibold text-slate-800">
              Room availability matrix
            </h2>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {formatBookingDate(firstSlot.startsAt)} from{" "}
            {formatBookingTimeRange(firstSlot.startsAt, lastSlot.endsAt)}
          </p>
        </div>

        <form
          action="/dashboard"
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_6rem_auto] xl:w-[36rem]"
        >
          <div className="space-y-2">
            <label
              htmlFor="matrixDate"
              className="text-sm font-medium text-slate-700"
            >
              Date
            </label>
            <Input
              id="matrixDate"
              name="matrixDate"
              type="date"
              defaultValue={date}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="matrixStartTime"
              className="text-sm font-medium text-slate-700"
            >
              Start
            </label>
            <Input
              id="matrixStartTime"
              name="matrixStartTime"
              type="time"
              defaultValue={startTime}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="matrixBlocks"
              className="text-sm font-medium text-slate-700"
            >
              Blocks
            </label>
            <Input
              id="matrixBlocks"
              name="matrixBlocks"
              type="number"
              min={ROOM_AVAILABILITY_MATRIX_MIN_BLOCKS}
              max={ROOM_AVAILABILITY_MATRIX_MAX_BLOCKS}
              defaultValue={blockCount}
            />
          </div>
          <div className="flex items-end">
            <Button buttonType="submit" className="h-10 w-full px-5">
              Apply
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge styles="bg-emerald-500 text-emerald-50">
          Free {slotCounts.free}
        </Badge>
        <Badge styles="bg-red-500 text-red-50">
          Booked {slotCounts.booked}
        </Badge>
        {showMine ? (
          <Badge styles="bg-sky-500 text-sky-50">Mine {slotCounts.mine}</Badge>
        ) : null}
      </div>

      <div className="no-scrollbar mt-5 overflow-x-auto">
        <table
          className="table-fixed border-separate border-spacing-0 text-sm"
          style={{
            minWidth: tableWidth,
            width: tableWidth,
          }}
        >
          <colgroup>
            <col style={{ width: roomColumnWidth }} />
            {matrix.slots.map((slot) => (
              <col key={slot.startTime} style={{ width: slotColumnWidth }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-56 rounded-tl-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-slate-600">
                Room
              </th>
              {matrix.slots.map((slot, index) => (
                <th
                  key={slot.startTime}
                  className={cn(
                    "border-y border-r border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs font-semibold text-slate-600",
                    index === matrix.slots.length - 1 && "rounded-tr-lg",
                  )}
                >
                  {slot.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row, rowIndex) => (
              <tr key={row.room.id}>
                <th
                  scope="row"
                  className={cn(
                    "sticky left-0 z-10 border-x border-b border-slate-200 bg-white px-4 py-3 text-left align-middle",
                    rowIndex === matrix.rows.length - 1 && "rounded-bl-lg",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <DoorOpen size={16} className="shrink-0 text-sky-600" />
                      <span className="truncate">{row.room.name}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
                      <span>{row.room.number}</span>
                      <span>{row.room.floor}</span>
                      <span className="inline-flex items-center gap-1">
                        <Users size={13} />
                        {row.room.capacity}
                      </span>
                    </div>
                  </div>
                </th>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`${row.room.id}-${cell.startTime}`}
                    className={cn(
                      "border-r border-b border-slate-200 bg-white p-2 align-middle",
                      rowIndex === matrix.rows.length - 1 &&
                        cellIndex === row.cells.length - 1 &&
                        "rounded-br-lg",
                    )}
                  >
                    <MatrixCell
                      cell={cell}
                      room={row.room}
                      showMine={showMine}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        Tap a free slot to open the room details page for that time.
        {showMine ? " Tap Mine to manage your booking." : null}
      </p>
    </section>
  );
}

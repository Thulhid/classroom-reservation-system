import {
  differenceInMinutes,
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";

import { prisma } from "@/lib/prisma";

export type BookingsOverTimePoint = {
  date: string;
  label: string;
  bookings: number;
};

export type RoomUtilizationPoint = {
  roomId: string;
  roomName: string;
  roomNumber: string;
  bookedHours: number;
  bookings: number;
};

export type AdminDashboardChartData = {
  bookingsOverTime: BookingsOverTimePoint[];
  roomUtilization: RoomUtilizationPoint[];
  rangeLabel: string;
};

const adminDashboardChartDays = 14;
const maxUtilizationRooms = 6;

function getRange(now = new Date()) {
  const startsAt = startOfDay(subDays(now, adminDashboardChartDays - 1));
  const endsAt = endOfDay(now);

  return {
    startsAt,
    endsAt,
    rangeLabel: `${format(startsAt, "MMM d")} - ${format(endsAt, "MMM d")}`,
  };
}

function getBookingMinutesInsideRange(
  booking: Pick<RoomBookingForUtilization, "endsAt" | "startsAt">,
  startsAt: Date,
  endsAt: Date,
) {
  const clippedStartsAt =
    booking.startsAt > startsAt ? booking.startsAt : startsAt;
  const clippedEndsAt = booking.endsAt < endsAt ? booking.endsAt : endsAt;

  return Math.max(0, differenceInMinutes(clippedEndsAt, clippedStartsAt));
}

type RoomBookingForUtilization = {
  roomId: string;
  startsAt: Date;
  endsAt: Date;
};

export async function getAdminDashboardChartData(): Promise<AdminDashboardChartData> {
  const { endsAt, rangeLabel, startsAt } = getRange();
  const rooms = await prisma.room.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      number: "asc",
    },
    select: {
      id: true,
      name: true,
      number: true,
    },
  });
  const roomIds = rooms.map((room) => room.id);
  const bookings = await prisma.booking.findMany({
    where: {
      roomId: {
        in: roomIds,
      },
      startsAt: {
        lt: endsAt,
      },
      endsAt: {
        gt: startsAt,
      },
    },
    orderBy: {
      startsAt: "asc",
    },
    select: {
      roomId: true,
      startsAt: true,
      endsAt: true,
    },
  });
  const bookingsByDate = new Map<string, number>();
  const utilizationByRoom = new Map<
    string,
    {
      bookedMinutes: number;
      bookings: number;
    }
  >();

  for (const booking of bookings) {
    const date = format(booking.startsAt, "yyyy-MM-dd");
    const roomUtilization = utilizationByRoom.get(booking.roomId) ?? {
      bookedMinutes: 0,
      bookings: 0,
    };

    if (booking.startsAt >= startsAt && booking.startsAt <= endsAt) {
      bookingsByDate.set(date, (bookingsByDate.get(date) ?? 0) + 1);
    }

    roomUtilization.bookedMinutes += getBookingMinutesInsideRange(
      booking,
      startsAt,
      endsAt,
    );
    roomUtilization.bookings += 1;
    utilizationByRoom.set(booking.roomId, roomUtilization);
  }

  const bookingsOverTime = eachDayOfInterval({
    start: startsAt,
    end: endsAt,
  }).map((date) => {
    const dateKey = format(date, "yyyy-MM-dd");

    return {
      date: dateKey,
      label: format(date, "MMM d"),
      bookings: bookingsByDate.get(dateKey) ?? 0,
    };
  });
  const roomUtilization = rooms
    .map((room) => {
      const utilization = utilizationByRoom.get(room.id) ?? {
        bookedMinutes: 0,
        bookings: 0,
      };

      return {
        roomId: room.id,
        roomName: room.name,
        roomNumber: room.number,
        bookedHours: Number((utilization.bookedMinutes / 60).toFixed(1)),
        bookings: utilization.bookings,
      };
    })
    .sort((firstRoom, secondRoom) => {
      if (secondRoom.bookedHours !== firstRoom.bookedHours) {
        return secondRoom.bookedHours - firstRoom.bookedHours;
      }

      return secondRoom.bookings - firstRoom.bookings;
    })
    .slice(0, maxUtilizationRooms);

  return {
    bookingsOverTime,
    rangeLabel,
    roomUtilization,
  };
}

import { isFuture } from "date-fns";

import { prisma } from "@/lib/prisma";
import {
  type BookingPeriod,
  type BookingPeriodInput,
  parseBookingPeriod,
} from "@/features/bookings/lib/dateTime";
import {
  type Classroom,
  getRooms,
  roomExists,
} from "@/features/rooms/services/roomService";

export type BookingSummary = {
  id: string;
  roomId: string;
  roomName: string;
  purpose: string | null;
  startsAt: Date;
  endsAt: Date;
  teacherName: string;
};

export type ClassroomAvailability = Classroom & {
  booking: BookingSummary | null;
  nextBooking: BookingSummary | null;
};

type CreateBookingInput = BookingPeriodInput & {
  roomId?: string;
  purpose?: string;
};

class BookingError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

function getTeacherDisplayName(teacher: {
  firstName: string;
  lastName: string;
}) {
  return `${teacher.firstName} ${teacher.lastName}`.trim() || "Teacher";
}

function toBookingSummary(
  booking: {
    id: string;
    roomId: string;
    purpose: string | null;
    startsAt: Date;
    endsAt: Date;
    teacher: {
      firstName: string;
      lastName: string;
    };
  },
  roomNameById = new Map<string, string>(),
): BookingSummary {
  return {
    id: booking.id,
    roomId: booking.roomId,
    roomName: roomNameById.get(booking.roomId) ?? booking.roomId,
    purpose: booking.purpose,
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    teacherName: getTeacherDisplayName(booking.teacher),
  };
}

async function getRoomNameById(roomIds: string[]) {
  const uniqueRoomIds = [...new Set(roomIds)];

  if (uniqueRoomIds.length === 0) {
    return new Map<string, string>();
  }

  const rooms = await prisma.room.findMany({
    where: {
      id: {
        in: uniqueRoomIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return new Map(rooms.map((room) => [room.id, room.name]));
}

function getOverlapWhere(period: Pick<BookingPeriod, "startsAt" | "endsAt">) {
  return {
    startsAt: {
      lt: period.endsAt,
    },
    endsAt: {
      gt: period.startsAt,
    },
  };
}

export function getBookingErrorResponse(error: unknown) {
  if (error instanceof BookingError) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  return {
    message: "Could not complete booking request.",
    status: 500,
  };
}

export async function getClassroomAvailability(
  period: BookingPeriod,
): Promise<ClassroomAvailability[]> {
  const rooms = await getRooms();
  const roomIds = rooms.map((room) => room.id);
  const roomNameById = new Map(rooms.map((room) => [room.id, room.name]));
  const [periodBookings, upcomingBookings] = await Promise.all([
    prisma.booking.findMany({
      where: {
        roomId: {
          in: roomIds,
        },
        ...getOverlapWhere(period),
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    }),
    prisma.booking.findMany({
      where: {
        roomId: {
          in: roomIds,
        },
        startsAt: {
          gte: period.endsAt,
        },
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
      take: 30,
    }),
  ]);

  const bookingByRoom = new Map<string, BookingSummary>();
  const nextBookingByRoom = new Map<string, BookingSummary>();

  for (const booking of periodBookings.map((booking) =>
    toBookingSummary(booking, roomNameById),
  )) {
    if (!bookingByRoom.has(booking.roomId)) {
      bookingByRoom.set(booking.roomId, booking);
    }
  }

  for (const booking of upcomingBookings.map((booking) =>
    toBookingSummary(booking, roomNameById),
  )) {
    if (!nextBookingByRoom.has(booking.roomId)) {
      nextBookingByRoom.set(booking.roomId, booking);
    }
  }

  return rooms.map((room) => ({
    ...room,
    booking: bookingByRoom.get(room.id) ?? null,
    nextBooking: nextBookingByRoom.get(room.id) ?? null,
  }));
}

export async function getUpcomingTeacherBookings(
  userId: string,
  take?: number,
) {
  const teacher = await prisma.teacher.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!teacher) {
    return [];
  }

  const bookings = await prisma.booking.findMany({
    where: {
      teacherId: teacher.id,
      endsAt: {
        gte: new Date(),
      },
    },
    include: {
      teacher: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      startsAt: "asc",
    },
    ...(take ? { take } : {}),
  });

  const roomNameById = await getRoomNameById(
    bookings.map((booking) => booking.roomId),
  );

  return bookings.map((booking) => toBookingSummary(booking, roomNameById));
}

export async function getRoomBookingHistory(roomId: string, take = 12) {
  const bookings = await prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      teacher: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      startsAt: "desc",
    },
    take,
  });

  const roomNameById = await getRoomNameById([roomId]);

  return bookings.map((booking) => toBookingSummary(booking, roomNameById));
}

export async function createBookingForTeacher(
  userId: string,
  input: CreateBookingInput,
) {
  const roomId = input.roomId?.trim() ?? "";
  const purpose = input.purpose?.trim() || null;

  if (!(await roomExists(roomId))) {
    throw new BookingError("Please choose a valid classroom.");
  }

  if (purpose && purpose.length > 120) {
    throw new BookingError("Purpose must be 120 characters or less.");
  }

  const { error, period } = parseBookingPeriod(input);

  if (!period) {
    throw new BookingError(error);
  }

  if (!isFuture(period.startsAt)) {
    throw new BookingError("Booking start time must be in the future.");
  }

  const teacher = await prisma.teacher.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!teacher) {
    throw new BookingError("Only teachers can create bookings.", 403);
  }

  const booking = await prisma.$transaction(async (tx) => {
    const conflict = await tx.booking.findFirst({
      where: {
        OR: [
          {
            teacherId: teacher.id,
            ...getOverlapWhere(period),
          },
          {
            roomId,
            ...getOverlapWhere(period),
          },
        ],
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    if (conflict?.teacherId === teacher.id) {
      throw new BookingError(
        "You already have a room booked during this time period.",
      );
    }

    if (conflict) {
      throw new BookingError(
        "This classroom is already booked during that time.",
      );
    }

    return tx.booking.create({
      data: {
        roomId,
        purpose,
        startsAt: period.startsAt,
        endsAt: period.endsAt,
        teacherId: teacher.id,
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  });

  const roomNameById = await getRoomNameById([booking.roomId]);

  return toBookingSummary(booking, roomNameById);
}

import { addMinutes, format, isFuture } from "date-fns";

import { prisma } from "@/lib/prisma";
import {
  type BookingPeriod,
  type BookingPeriodInput,
  parseBookingPeriod,
  parseLocalDateTime,
  toDateInputValue,
  toTimeInputValue,
} from "@/features/bookings/lib/dateTime";
import {
  defaultTeacherBookingsQuery,
  TEACHER_BOOKINGS_PAGE_SIZE,
  type BookingStatusFilter,
  type TeacherBookingsQuery,
} from "@/features/bookings/lib/bookingQuery";
import type {
  BookingsPagination,
  BookingSummary,
  RoomAvailabilityMatrixData,
  RoomAvailabilityMatrixSlot,
  TeacherBookingsPage,
} from "@/features/bookings/types/bookingTypes";
import {
  type Classroom,
  getRooms,
  roomExists,
} from "@/features/rooms/services/roomService";

export type ClassroomAvailability = Classroom & {
  booking: BookingSummary | null;
  nextBooking: BookingSummary | null;
};

type CreateBookingInput = BookingPeriodInput & {
  roomId?: string;
  purpose?: string;
};

type UpdateBookingInput = BookingPeriodInput & {
  purpose?: string;
};

type RoomAvailabilityMatrixInput = {
  blockCount?: number;
  date: string;
  slotMinutes?: number;
  startTime?: string;
  viewerUserId?: string;
};

class BookingError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export const ROOM_AVAILABILITY_MATRIX_DEFAULT_BLOCKS = 10;
export const ROOM_AVAILABILITY_MATRIX_DEFAULT_START_TIME = "08:00";
export const ROOM_AVAILABILITY_MATRIX_MAX_BLOCKS = 10;
export const ROOM_AVAILABILITY_MATRIX_MIN_BLOCKS = 5;
const defaultMatrixSlotMinutes = 60;

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
      userId?: string;
    };
  },
  roomNameById = new Map<string, string>(),
  options: {
    canDelete?: boolean;
    canEdit?: boolean;
    viewerUserId?: string;
  } = {},
): BookingSummary {
  const canDelete =
    options.canDelete ??
    Boolean(
      options.viewerUserId && booking.teacher.userId === options.viewerUserId,
    );
  const canEdit = options.canEdit ?? (canDelete && isFuture(booking.startsAt));

  return {
    canDelete,
    canEdit,
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

function getSlotLabel(startsAt: Date, slotMinutes: number) {
  return format(startsAt, slotMinutes < 60 ? "h:mm a" : "h a");
}

function clampMatrixBlockCount(blockCount?: number) {
  if (!Number.isFinite(blockCount)) {
    return ROOM_AVAILABILITY_MATRIX_DEFAULT_BLOCKS;
  }

  return Math.min(
    ROOM_AVAILABILITY_MATRIX_MAX_BLOCKS,
    Math.max(
      ROOM_AVAILABILITY_MATRIX_MIN_BLOCKS,
      Math.trunc(blockCount ?? ROOM_AVAILABILITY_MATRIX_DEFAULT_BLOCKS),
    ),
  );
}

function getMatrixSlots({
  blockCount,
  date,
  slotMinutes = defaultMatrixSlotMinutes,
  startTime = ROOM_AVAILABILITY_MATRIX_DEFAULT_START_TIME,
}: Omit<RoomAvailabilityMatrixInput, "viewerUserId">) {
  const startsAt = parseLocalDateTime(date, startTime);
  const minutes = Math.max(15, slotMinutes);
  const blocks = clampMatrixBlockCount(blockCount);

  if (!startsAt) {
    return [];
  }

  const slots: RoomAvailabilityMatrixSlot[] = [];
  let slotStartsAt = startsAt;

  while (slots.length < blocks) {
    const slotEndsAt = addMinutes(slotStartsAt, minutes);

    slots.push({
      date: toDateInputValue(slotStartsAt),
      endsAt: slotEndsAt,
      endTime: toTimeInputValue(slotEndsAt),
      label: getSlotLabel(slotStartsAt, minutes),
      startsAt: slotStartsAt,
      startTime: toTimeInputValue(slotStartsAt),
    });

    slotStartsAt = slotEndsAt;
  }

  return slots;
}

function isOverlappingSlot(
  booking: Pick<BookingSummary, "endsAt" | "startsAt">,
  slot: Pick<RoomAvailabilityMatrixSlot, "endsAt" | "startsAt">,
) {
  return booking.startsAt < slot.endsAt && booking.endsAt > slot.startsAt;
}

function getStatusWhere(status: BookingStatusFilter, now = new Date()) {
  if (status === "all") {
    return {};
  }

  if (status === "completed") {
    return {
      endsAt: {
        lt: now,
      },
    };
  }

  if (status === "ongoing") {
    return {
      startsAt: {
        lte: now,
      },
      endsAt: {
        gte: now,
      },
    };
  }

  return {
    startsAt: {
      gt: now,
    },
  };
}

function getEmptyPagination(pageSize = TEACHER_BOOKINGS_PAGE_SIZE) {
  return {
    page: 1,
    pageSize,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  } satisfies BookingsPagination;
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
            userId: true,
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
            userId: true,
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
          userId: true,
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

  return bookings.map((booking) =>
    toBookingSummary(booking, roomNameById, { canDelete: true }),
  );
}

export async function getRoomAvailabilityMatrix({
  blockCount,
  date,
  slotMinutes,
  startTime,
  viewerUserId,
}: RoomAvailabilityMatrixInput): Promise<RoomAvailabilityMatrixData> {
  const slots = getMatrixSlots({ blockCount, date, slotMinutes, startTime });
  const rooms = await getRooms();

  if (slots.length === 0 || rooms.length === 0) {
    return {
      date,
      rows: rooms.map((room) => ({
        cells: [],
        room: {
          capacity: room.capacity,
          floor: room.floor,
          id: room.id,
          name: room.name,
          number: room.number,
        },
      })),
      slots,
    };
  }

  const matrixStartsAt = slots[0].startsAt;
  const matrixEndsAt = slots.at(-1)?.endsAt ?? slots[0].endsAt;
  const roomIds = rooms.map((room) => room.id);
  const roomNameById = new Map(rooms.map((room) => [room.id, room.name]));
  const bookings = await prisma.booking.findMany({
    where: {
      roomId: {
        in: roomIds,
      },
      startsAt: {
        lt: matrixEndsAt,
      },
      endsAt: {
        gt: matrixStartsAt,
      },
    },
    include: {
      teacher: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
        },
      },
    },
    orderBy: {
      startsAt: "asc",
    },
  });

  const bookingsByRoom = new Map<string, BookingSummary[]>();

  for (const booking of bookings.map((booking) =>
    toBookingSummary(booking, roomNameById, { viewerUserId }),
  )) {
    const roomBookings = bookingsByRoom.get(booking.roomId) ?? [];
    roomBookings.push(booking);
    bookingsByRoom.set(booking.roomId, roomBookings);
  }

  return {
    date,
    slots,
    rows: rooms.map((room) => {
      const roomBookings = bookingsByRoom.get(room.id) ?? [];

      return {
        room: {
          capacity: room.capacity,
          floor: room.floor,
          id: room.id,
          name: room.name,
          number: room.number,
        },
        cells: slots.map((slot) => {
          const matchingBookings = roomBookings.filter((booking) =>
            isOverlappingSlot(booking, slot),
          );
          const booking =
            matchingBookings.find((booking) => booking.canDelete) ??
            matchingBookings[0];

          if (!booking) {
            return {
              ...slot,
              status: "free",
            };
          }

          return {
            ...slot,
            bookingId: booking.id,
            purpose: booking.purpose,
            status: booking.canDelete ? "mine" : "booked",
            teacherName: booking.teacherName,
          };
        }),
      };
    }),
  };
}

export async function getTeacherBookingsPage(
  userId: string,
  query: Partial<TeacherBookingsQuery> = {},
): Promise<TeacherBookingsPage> {
  const teacher = await prisma.teacher.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!teacher) {
    return {
      bookings: [],
      pagination: getEmptyPagination(),
    };
  }

  const status = query.status ?? defaultTeacherBookingsQuery.status;
  const sort = query.sort ?? defaultTeacherBookingsQuery.sort;
  const requestedPage = query.page ?? defaultTeacherBookingsQuery.page;
  const pageSize = TEACHER_BOOKINGS_PAGE_SIZE;
  const where = {
    teacherId: teacher.id,
    ...getStatusWhere(status),
  };

  const totalItems = await prisma.booking.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const pagination = {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  } satisfies BookingsPagination;

  if (totalItems === 0) {
    return {
      bookings: [],
      pagination,
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      teacher: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
        },
      },
    },
    orderBy: [{ startsAt: sort }, { id: sort }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const roomNameById = await getRoomNameById(
    bookings.map((booking) => booking.roomId),
  );

  return {
    bookings: bookings.map((booking) =>
      toBookingSummary(booking, roomNameById, { canDelete: true }),
    ),
    pagination,
  };
}

export async function getRoomBookingHistory(
  roomId: string,
  take = 12,
  viewerUserId?: string,
) {
  const bookings = await prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      teacher: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
        },
      },
    },
    orderBy: {
      startsAt: "desc",
    },
    take,
  });

  const roomNameById = await getRoomNameById([roomId]);

  return bookings.map((booking) =>
    toBookingSummary(booking, roomNameById, { viewerUserId }),
  );
}

export async function deleteBookingForTeacher(
  userId: string,
  bookingId: string,
) {
  const bookingIdValue = bookingId.trim();

  if (!bookingIdValue) {
    throw new BookingError("Booking is required.");
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
    throw new BookingError("Only teachers can delete bookings.", 403);
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingIdValue,
      teacherId: teacher.id,
    },
    select: {
      id: true,
    },
  });

  if (!booking) {
    throw new BookingError("Booking could not be found.", 404);
  }

  await prisma.booking.delete({
    where: {
      id: booking.id,
    },
  });

  return {
    id: booking.id,
  };
}

export async function updateBookingForTeacher(
  userId: string,
  bookingId: string,
  input: UpdateBookingInput,
) {
  const bookingIdValue = bookingId.trim();
  const purpose = input.purpose?.trim() || null;

  if (!bookingIdValue) {
    throw new BookingError("Booking is required.");
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
    throw new BookingError("Only teachers can update bookings.", 403);
  }

  const booking = await prisma.$transaction(async (tx) => {
    const existingBooking = await tx.booking.findFirst({
      where: {
        id: bookingIdValue,
        teacherId: teacher.id,
      },
      select: {
        id: true,
        roomId: true,
      },
    });

    if (!existingBooking) {
      throw new BookingError("Booking could not be found.", 404);
    }

    const conflict = await tx.booking.findFirst({
      where: {
        id: {
          not: existingBooking.id,
        },
        OR: [
          {
            teacherId: teacher.id,
            ...getOverlapWhere(period),
          },
          {
            roomId: existingBooking.roomId,
            ...getOverlapWhere(period),
          },
        ],
      },
      select: {
        teacherId: true,
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

    return tx.booking.update({
      where: {
        id: existingBooking.id,
      },
      data: {
        purpose,
        startsAt: period.startsAt,
        endsAt: period.endsAt,
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
            userId: true,
          },
        },
      },
    });
  });

  const roomNameById = await getRoomNameById([booking.roomId]);

  return toBookingSummary(booking, roomNameById, { canDelete: true });
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
            userId: true,
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
            userId: true,
          },
        },
      },
    });
  });

  const roomNameById = await getRoomNameById([booking.roomId]);

  return toBookingSummary(booking, roomNameById, { canDelete: true });
}

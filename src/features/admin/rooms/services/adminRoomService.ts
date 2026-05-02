import { Prisma, type Room } from "@/generated/prisma/client";
import type { AdminRoomPayload } from "@/features/admin/rooms/validators/adminRoomFormSchema";
import { prisma } from "@/lib/prisma";

export class AdminRoomServiceError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

function getStoredImages(coverImage: string, images: string[]) {
  const seen = new Set([coverImage.toLowerCase()]);

  return images.filter((image) => {
    const key = image.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getRoomData(payload: AdminRoomPayload) {
  return {
    ...payload,
    images: getStoredImages(payload.coverImage, payload.images),
  };
}

export async function getAdminRooms(): Promise<Room[]> {
  return prisma.room.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      number: "asc",
    },
  });
}

export async function getAdminRoomById(roomId: string) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
      isActive: true,
    },
  });
}

export async function createAdminRoom(payload: AdminRoomPayload) {
  try {
    return await prisma.room.create({
      data: {
        id: crypto.randomUUID(),
        isActive: true,
        ...getRoomData(payload),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AdminRoomServiceError(
        "A room with this number already exists.",
        409,
      );
    }

    throw error;
  }
}

export async function updateAdminRoom(roomId: string, payload: AdminRoomPayload) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!room || !room.isActive) {
    throw new AdminRoomServiceError("Room could not be found.", 404);
  }

  try {
    return await prisma.room.update({
      where: {
        id: roomId,
      },
      data: getRoomData(payload),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AdminRoomServiceError(
        "A room with this number already exists.",
        409,
      );
    }

    throw error;
  }
}

export async function deleteAdminRoom(roomId: string) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    select: {
      id: true,
      isActive: true,
      name: true,
    },
  });

  if (!room || !room.isActive) {
    throw new AdminRoomServiceError("Room could not be found.", 404);
  }

  const activeBookingCount = await prisma.booking.count({
    where: {
      roomId,
      endsAt: {
        gte: new Date(),
      },
    },
  });

  if (activeBookingCount > 0) {
    throw new AdminRoomServiceError(
      "This room has active or upcoming bookings. Clear those bookings before deleting the room.",
      409,
    );
  }

  await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      isActive: false,
    },
  });

  return room;
}

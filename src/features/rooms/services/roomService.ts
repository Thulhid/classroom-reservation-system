import type { Room } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type ClassroomObject = {
  name: string;
  quantity: number;
};

export type ClassroomAmenity = {
  name: string;
  value: string;
  available: boolean;
};

export type ClassroomPhoto = {
  src: string;
  alt: string;
};

export type Classroom = Room & {
  photos: ClassroomPhoto[];
  amenities: ClassroomAmenity[];
  objects: ClassroomObject[];
};

function getPhotos(room: Room): ClassroomPhoto[] {
  const seen = new Set<string>();
  const imageSources = [room.coverImage, ...room.images]
    .filter((src): src is string => Boolean(src))
    .filter((src) => {
      if (seen.has(src)) {
        return false;
      }

      seen.add(src);
      return true;
    });

  return imageSources.map((src, index) => ({
    src,
    alt:
      index === 0
        ? `${room.name} classroom cover photo`
        : `${room.name} classroom photo ${index}`,
  }));
}

function getAmenities(room: Room): ClassroomAmenity[] {
  return [
    {
      name: "Presentation system",
      value: room.presentationSystem ? "Available" : "Not available",
      available: room.presentationSystem,
    },
    {
      name: "Projector",
      value: room.projector ? "Available" : "Not available",
      available: room.projector,
    },
    {
      name: "Internet access",
      value: room.internetAccess ? "Wi-Fi available" : "Not available",
      available: room.internetAccess,
    },
    {
      name: "Climate control",
      value: room.airConditioned ? "Air-conditioned" : "Non-air-conditioned",
      available: room.airConditioned,
    },
  ];
}

function getObjects(room: Room): ClassroomObject[] {
  return [
    { name: "Tables", quantity: room.tables },
    { name: "Lecturer desk", quantity: room.lecturerDesk },
    { name: "White boards", quantity: room.whiteBoards },
  ];
}

export function toClassroom(room: Room): Classroom {
  return {
    ...room,
    photos: getPhotos(room),
    amenities: getAmenities(room),
    objects: getObjects(room),
  };
}

export async function getRooms() {
  const rooms = await prisma.room.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      number: "asc",
    },
  });

  return rooms.map(toClassroom);
}

export async function getRoomByNumber(roomNumber: string) {
  const room = await prisma.room.findFirst({
    where: {
      number: roomNumber,
      isActive: true,
    },
  });

  return room ? toClassroom(room) : null;
}

export async function roomExists(roomId: string) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  return Boolean(room);
}

import bcrypt from "bcryptjs";

import { Role } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";

const TEST_PASSWORD = "password123";
const ROOM_COVER_IMAGE = "classroom/cover";
const ROOM_IMAGES = [
  "classroom/classroom-1",
  "classroom/classroom-2",
  "classroom/classroom-3",
];

const roomImages = ROOM_IMAGES.slice(0, 5);

const rooms = [
  {
    id: "R101",
    number: "101",
    name: "Room 101",
    floor: "Ground floor",
    capacity: 40,
    presentationSystem: true,
    projector: true,
    internetAccess: true,
    airConditioned: true,
    tables: 20,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R102",
    number: "102",
    name: "Room 102",
    floor: "Ground floor",
    capacity: 35,
    presentationSystem: true,
    projector: true,
    internetAccess: true,
    airConditioned: false,
    tables: 18,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R103",
    number: "103",
    name: "Room 103",
    floor: "Ground floor",
    capacity: 45,
    presentationSystem: false,
    projector: true,
    internetAccess: true,
    airConditioned: true,
    tables: 22,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R201",
    number: "201",
    name: "Room 201",
    floor: "First floor",
    capacity: 40,
    presentationSystem: true,
    projector: true,
    internetAccess: true,
    airConditioned: true,
    tables: 20,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R202",
    number: "202",
    name: "Room 202",
    floor: "First floor",
    capacity: 50,
    presentationSystem: true,
    projector: true,
    internetAccess: true,
    airConditioned: true,
    tables: 25,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R203",
    number: "203",
    name: "Room 203",
    floor: "First floor",
    capacity: 30,
    presentationSystem: false,
    projector: false,
    internetAccess: true,
    airConditioned: false,
    tables: 15,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R301",
    number: "301",
    name: "Room 301",
    floor: "Second floor",
    capacity: 40,
    presentationSystem: true,
    projector: true,
    internetAccess: true,
    airConditioned: true,
    tables: 20,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R302",
    number: "302",
    name: "Room 302",
    floor: "Second floor",
    capacity: 55,
    presentationSystem: true,
    projector: true,
    internetAccess: true,
    airConditioned: true,
    tables: 28,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R303",
    number: "303",
    name: "Room 303",
    floor: "Second floor",
    capacity: 36,
    presentationSystem: true,
    projector: false,
    internetAccess: true,
    airConditioned: false,
    tables: 18,
    lecturerDesk: 1,
    whiteBoards: 1,
  },
  {
    id: "R304",
    number: "304",
    name: "Room 304",
    floor: "Second floor",
    capacity: 60,
    presentationSystem: true,
    projector: true,
    internetAccess: true,
    airConditioned: true,
    tables: 30,
    lecturerDesk: 1,
    whiteBoards: 2,
  },
];

async function main() {
  const password = await bcrypt.hash(TEST_PASSWORD, 10);

  await Promise.all(
    rooms.map((room) =>
      prisma.room.upsert({
        where: {
          id: room.id,
        },
        update: {
          ...room,
          coverImage: ROOM_COVER_IMAGE,
          images: roomImages,
          isActive: true,
        },
        create: {
          ...room,
          coverImage: ROOM_COVER_IMAGE,
          images: roomImages,
          isActive: true,
        },
      })
    )
  );

  const student = await prisma.user.upsert({
    where: {
      uniID: "STU001",
    },
    update: {
      email: "student@classroom.test",
      password,
      role: Role.STUDENT,
      student: {
        upsert: {
          create: {
            firstName: "Demo",
            lastName: "Student",
          },
          update: {
            firstName: "Demo",
            lastName: "Student",
          },
        },
      },
    },
    create: {
      email: "student@classroom.test",
      uniID: "STU001",
      password,
      role: Role.STUDENT,
      student: {
        create: {
          firstName: "Demo",
          lastName: "Student",
        },
      },
    },
    select: {
      uniID: true,
      role: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: {
      uniID: "TCH001",
    },
    update: {
      email: "teacher@classroom.test",
      password,
      role: Role.TEACHER,
      teacher: {
        upsert: {
          create: {
            firstName: "Demo",
            lastName: "Teacher",
          },
          update: {
            firstName: "Demo",
            lastName: "Teacher",
          },
        },
      },
    },
    create: {
      email: "teacher@classroom.test",
      uniID: "TCH001",
      password,
      role: Role.TEACHER,
      teacher: {
        create: {
          firstName: "Demo",
          lastName: "Teacher",
        },
      },
    },
    select: {
      uniID: true,
      role: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: {
      uniID: "ADM001",
    },
    update: {
      email: "admin@classroom.test",
      password,
      role: Role.ADMIN,
      admin: {
        upsert: {
          create: {
            firstName: "System",
            lastName: "Admin",
          },
          update: {
            firstName: "System",
            lastName: "Admin",
          },
        },
      },
    },
    create: {
      email: "admin@classroom.test",
      uniID: "ADM001",
      password,
      role: Role.ADMIN,
      admin: {
        create: {
          firstName: "System",
          lastName: "Admin",
        },
      },
    },
    select: {
      uniID: true,
      role: true,
    },
  });

  console.log(`Seeded ${rooms.length} rooms and test users:`);
  console.table([
    { ...student, password: TEST_PASSWORD },
    { ...teacher, password: TEST_PASSWORD },
    { ...admin, password: TEST_PASSWORD },
  ]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

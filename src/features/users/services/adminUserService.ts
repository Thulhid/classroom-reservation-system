import "server-only";

import bcrypt from "bcryptjs";
import { Prisma, Role } from "@/generated/prisma/client";

import type {
  AdminManagedUser,
  ManagedUserRole,
} from "@/features/users/lib/adminUsers";
import type {
  AdminCreateUserPayload,
  AdminUserPayload,
} from "@/features/users/validators/adminUserFormSchema";
import { prisma } from "@/lib/prisma";

export class AdminUserServiceError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

function getUniqueFieldMessage(error: Prisma.PrismaClientKnownRequestError) {
  const target = Array.isArray(error.meta?.target) ? error.meta.target[0] : "";

  if (target === "email") {
    return "A user with this email address already exists.";
  }

  if (target === "uniID") {
    return "A user with this university ID already exists.";
  }

  return "A user with these details already exists.";
}

function mapStudentAccount(student: {
  firstName: string;
  lastName: string;
  user: {
    id: string;
    email: string;
    uniID: string;
    image: string | null;
  };
}): AdminManagedUser {
  return {
    id: student.user.id,
    role: "STUDENT",
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.user.email,
    uniID: student.user.uniID,
    image: student.user.image,
    bookingCount: 0,
  };
}

function mapTeacherAccount(teacher: {
  firstName: string;
  lastName: string;
  user: {
    id: string;
    email: string;
    uniID: string;
    image: string | null;
  };
  _count: {
    bookings: number;
  };
}): AdminManagedUser {
  return {
    id: teacher.user.id,
    role: "TEACHER",
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.user.email,
    uniID: teacher.user.uniID,
    image: teacher.user.image,
    bookingCount: teacher._count.bookings,
  };
}

export async function getAdminUsers(
  role: ManagedUserRole,
): Promise<AdminManagedUser[]> {
  if (role === "TEACHER") {
    const teachers = await prisma.teacher.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      select: {
        firstName: true,
        lastName: true,
        user: {
          select: {
            id: true,
            email: true,
            uniID: true,
            image: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return teachers.map(mapTeacherAccount);
  }

  const students = await prisma.student.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      firstName: true,
      lastName: true,
      user: {
        select: {
          id: true,
          email: true,
          uniID: true,
          image: true,
        },
      },
    },
  });

  return students.map(mapStudentAccount);
}

export async function getAdminUserById(
  userId: string,
  role: ManagedUserRole,
): Promise<AdminManagedUser | null> {
  if (role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({
      where: {
        userId,
      },
      select: {
        firstName: true,
        lastName: true,
        user: {
          select: {
            id: true,
            email: true,
            uniID: true,
            image: true,
            role: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!teacher || teacher.user.role !== Role.TEACHER) {
      return null;
    }

    return mapTeacherAccount(teacher);
  }

  const student = await prisma.student.findUnique({
    where: {
      userId,
    },
    select: {
      firstName: true,
      lastName: true,
      user: {
        select: {
          id: true,
          email: true,
          uniID: true,
          image: true,
          role: true,
        },
      },
    },
  });

  if (!student || student.user.role !== Role.STUDENT) {
    return null;
  }

  return mapStudentAccount(student);
}

async function createStudentAccount(payload: AdminCreateUserPayload) {
  const password = await bcrypt.hash(payload.password, 10);

  const student = await prisma.student.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      user: {
        create: {
          email: payload.email,
          uniID: payload.uniID,
          password,
          role: Role.STUDENT,
        },
      },
    },
    select: {
      firstName: true,
      lastName: true,
      user: {
        select: {
          id: true,
          email: true,
          uniID: true,
          image: true,
        },
      },
    },
  });

  return mapStudentAccount(student);
}

async function createTeacherAccount(payload: AdminCreateUserPayload) {
  const password = await bcrypt.hash(payload.password, 10);

  const teacher = await prisma.teacher.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      user: {
        create: {
          email: payload.email,
          uniID: payload.uniID,
          password,
          role: Role.TEACHER,
        },
      },
    },
    select: {
      firstName: true,
      lastName: true,
      user: {
        select: {
          id: true,
          email: true,
          uniID: true,
          image: true,
        },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  return mapTeacherAccount(teacher);
}

export async function createAdminUser(payload: AdminCreateUserPayload) {
  try {
    return payload.role === "TEACHER"
      ? await createTeacherAccount(payload)
      : await createStudentAccount(payload);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AdminUserServiceError(getUniqueFieldMessage(error), 409);
    }

    throw error;
  }
}

async function updateStudentAccount(userId: string, payload: AdminUserPayload) {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        email: payload.email,
        uniID: payload.uniID,
      },
    });

    const student = await tx.student.update({
      where: {
        userId,
      },
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      select: {
        firstName: true,
        lastName: true,
        user: {
          select: {
            id: true,
            email: true,
            uniID: true,
            image: true,
          },
        },
      },
    });

    return mapStudentAccount(student);
  });
}

async function updateTeacherAccount(userId: string, payload: AdminUserPayload) {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        email: payload.email,
        uniID: payload.uniID,
      },
    });

    const teacher = await tx.teacher.update({
      where: {
        userId,
      },
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      select: {
        firstName: true,
        lastName: true,
        user: {
          select: {
            id: true,
            email: true,
            uniID: true,
            image: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return mapTeacherAccount(teacher);
  });
}

export async function updateAdminUser(userId: string, payload: AdminUserPayload) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user || (user.role !== Role.STUDENT && user.role !== Role.TEACHER)) {
    throw new AdminUserServiceError("User account could not be found.", 404);
  }

  try {
    return user.role === Role.TEACHER
      ? await updateTeacherAccount(userId, payload)
      : await updateStudentAccount(userId, payload);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AdminUserServiceError(getUniqueFieldMessage(error), 409);
    }

    throw error;
  }
}

export async function deleteAdminUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
      email: true,
    },
  });

  if (!user || (user.role !== Role.STUDENT && user.role !== Role.TEACHER)) {
    throw new AdminUserServiceError("User account could not be found.", 404);
  }

  if (user.role === Role.TEACHER) {
    const teacher = await prisma.teacher.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!teacher) {
      throw new AdminUserServiceError("Teacher profile could not be found.", 404);
    }

    const bookingCount = await prisma.booking.count({
      where: {
        teacherId: teacher.id,
      },
    });

    if (bookingCount > 0) {
      throw new AdminUserServiceError(
        "Teachers with booking history cannot be deleted. Clear or archive their reservations first.",
        409,
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.teacher.delete({
        where: {
          userId,
        },
      });

      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    return user;
  }

  const student = await prisma.student.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    throw new AdminUserServiceError("Student profile could not be found.", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.student.delete({
      where: {
        userId,
      },
    });

    await tx.user.delete({
      where: {
        id: userId,
      },
    });
  });

  return user;
}

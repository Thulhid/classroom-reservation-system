import bcrypt from "bcryptjs";

import { Prisma, Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type SignUpRequestBody = {
  firstName?: string;
  lastName?: string;
  universityId?: string;
  universityEmail?: string;
  password?: string;
  confirmPassword?: string;
  role?: "student" | "teacher";
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as SignUpRequestBody;
  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const uniID = body.universityId?.trim();
  const email = body.universityEmail?.trim().toLowerCase();
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";
  const role = body.role === "teacher" ? Role.TEACHER : Role.STUDENT;

  if (!firstName || !lastName || !uniID || !email || !password) {
    return Response.json(
      { message: "Please complete all required fields." },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return Response.json(
      { message: "Password and confirm password do not match." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        uniID,
        password: hashedPassword,
        role,
        ...(role === Role.TEACHER
          ? {
              teacher: {
                create: {
                  firstName,
                  lastName,
                },
              },
            }
          : {
              student: {
                create: {
                  firstName,
                  lastName,
                },
              },
            }),
      },
      select: {
        id: true,
        email: true,
        uniID: true,
        role: true,
      },
    });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { message: "A user with this university ID or email already exists." },
        { status: 409 }
      );
    }

    return Response.json(
      { message: "Could not create your account. Please try again." },
      { status: 500 }
    );
  }
}

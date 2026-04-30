import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type UpdatePasswordRequestBody = {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as UpdatePasswordRequestBody;
  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";
  const confirmNewPassword = body.confirmNewPassword ?? "";

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return Response.json(
      { message: "Please complete all password fields." },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return Response.json(
      { message: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  if (newPassword !== confirmNewPassword) {
    return Response.json(
      { message: "New password and confirmation do not match." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  const currentPasswordMatches = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!currentPasswordMatches) {
    return Response.json(
      { message: "Current password is incorrect." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return Response.json({ message: "Password updated successfully." });
}

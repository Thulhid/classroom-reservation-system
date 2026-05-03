import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import {
  getUpdatePasswordValidationMessage,
  parseUpdatePasswordPayload,
} from "@/features/profile/validators/updatePasswordSchema";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = parseUpdatePasswordPayload(body);

  if (!parsed.success) {
    return Response.json(
      { message: getUpdatePasswordValidationMessage(parsed.error) },
      { status: 400 },
    );
  }

  const { currentPassword, newPassword } = parsed.data;

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
    user.password,
  );

  if (!currentPasswordMatches) {
    return Response.json(
      { message: "Current password is incorrect." },
      { status: 400 },
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

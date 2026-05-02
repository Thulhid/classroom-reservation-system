import "server-only";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  createPasswordResetChallenge,
  createResetPin,
  isPasswordResetChallengeError,
  verifyPasswordResetChallenge,
} from "@/features/forgot-password/lib/passwordResetChallenge";
import { sendPasswordResetPinEmail } from "@/features/forgot-password/lib/passwordResetEmail";
import {
  getForgotPasswordValidationMessage,
  parseForgotPasswordRequestPayload,
  parseForgotPasswordResetPayload,
} from "@/features/forgot-password/validators/forgotPasswordSchema";

const RESET_PIN_EXPIRY_MINUTES = 10;
const FORGOT_PASSWORD_SENT_MESSAGE =
  "If the account exists, a reset PIN was sent to the registered email.";

export class ForgotPasswordServiceError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

function getDisplayName(user: {
  role: "ADMIN" | "STUDENT" | "TEACHER";
  admin: { firstName: string; lastName: string } | null;
  student: { firstName: string; lastName: string } | null;
  teacher: { firstName: string; lastName: string } | null;
}) {
  const profile =
    user.role === "ADMIN"
      ? user.admin
      : user.role === "TEACHER"
        ? user.teacher
        : user.student;

  return profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : undefined;
}

export async function requestForgotPasswordPin(payload: unknown) {
  const parsed = parseForgotPasswordRequestPayload(payload);

  if (!parsed.success) {
    throw new ForgotPasswordServiceError(
      getForgotPasswordValidationMessage(parsed.error),
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      uniID: parsed.data.universityId,
    },
    include: {
      admin: true,
      student: true,
      teacher: true,
    },
  });

  if (!user) {
    const fakePin = createResetPin();

    return {
      message: FORGOT_PASSWORD_SENT_MESSAGE,
      challengeToken: createPasswordResetChallenge(randomUUID(), fakePin),
    };
  }

  const pin = createResetPin();
  const challengeToken = createPasswordResetChallenge(user.id, pin);

  await sendPasswordResetPinEmail({
    to: user.email,
    name: getDisplayName(user),
    pin,
    expiresInMinutes: RESET_PIN_EXPIRY_MINUTES,
  });

  return {
    message: FORGOT_PASSWORD_SENT_MESSAGE,
    challengeToken,
  };
}

export async function resetForgottenPassword(payload: unknown) {
  const parsed = parseForgotPasswordResetPayload(payload);

  if (!parsed.success) {
    throw new ForgotPasswordServiceError(
      getForgotPasswordValidationMessage(parsed.error),
    );
  }

  let userId: string;

  try {
    userId = verifyPasswordResetChallenge(
      parsed.data.challengeToken,
      parsed.data.pin,
    ).userId;
  } catch (error) {
    if (isPasswordResetChallengeError(error)) {
      throw new ForgotPasswordServiceError(error.message);
    }

    throw error;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new ForgotPasswordServiceError("Invalid or expired reset PIN.");
  }

  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password reset successfully.",
  };
}

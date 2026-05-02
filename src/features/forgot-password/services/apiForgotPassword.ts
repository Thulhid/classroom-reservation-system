type ResetPasswordPayload = {
  challengeToken: string;
  pin: string;
  newPassword: string;
  confirmNewPassword: string;
};

type ForgotPasswordResponse = {
  message?: string;
  challengeToken?: string;
};

type SendResetPINResult =
  | {
      success: true;
      message: string;
      challengeToken: string;
    }
  | {
      success: false;
      message: string;
    };

type ResetPasswordResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export async function sendResetPIN(
  universityId: string,
): Promise<SendResetPINResult> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      universityId,
    }),
  });
  const result = (await response.json()) as ForgotPasswordResponse;

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not reset password.",
    };
  }

  if (!result.challengeToken) {
    return {
      success: false,
      message: "Could not start password reset.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Check your email for the reset PIN.",
    challengeToken: result.challengeToken,
  };
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResult> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as ForgotPasswordResponse;

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not reset password.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Password reset successfully.",
  };
}

import { useState } from "react";

import { resetPassword as resetPasswordService } from "../services/apiForgotPassword";

type ResetPasswordPayload = {
  challengeToken: string;
  pin: string;
  newPassword: string;
  confirmNewPassword: string;
};

export function useResetPassword() {
  const [isResetting, setIsResetting] = useState(false);

  async function resetPassword(payload: ResetPasswordPayload) {
    setIsResetting(true);

    try {
      return await resetPasswordService(payload);
    } finally {
      setIsResetting(false);
    }
  }

  return {
    isResetting,
    resetPassword,
  };
}

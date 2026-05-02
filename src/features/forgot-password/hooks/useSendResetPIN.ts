import { useState } from "react";

import { sendResetPIN as sendResetPINService } from "../services/apiForgotPassword";

export function useSendResetPIN() {
  const [isSending, setIsSending] = useState(false);

  async function sendResetPIN(universityId: string) {
    setIsSending(true);

    try {
      return await sendResetPINService(universityId);
    } finally {
      setIsSending(false);
    }
  }

  return {
    isSending,
    sendResetPIN,
  };
}

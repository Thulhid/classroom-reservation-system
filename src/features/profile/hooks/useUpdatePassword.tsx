import { useState } from "react";

import { updatePassword as updatePasswordService } from "@/features/profile/services/apiProfile";
import type { UpdatePasswordPayload } from "@/features/profile/validators/updatePasswordSchema";

export function useUpdatePassword() {
  const [isUpdating, setIsUpdating] = useState(false);

  async function updatePassword(payload: UpdatePasswordPayload) {
    setIsUpdating(true);

    try {
      return await updatePasswordService(payload);
    } finally {
      setIsUpdating(false);
    }
  }

  return {
    isUpdating,
    updatePassword,
  };
}

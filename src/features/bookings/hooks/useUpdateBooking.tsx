import { useState } from "react";

import {
  type UpdateBookingPayload,
  updateBooking as updateBookingService,
} from "@/features/bookings/services/bookingMutationService";

export function useUpdateBooking() {
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateBooking(
    bookingId: string,
    payload: UpdateBookingPayload,
  ) {
    setIsUpdating(true);

    try {
      return await updateBookingService(bookingId, payload);
    } finally {
      setIsUpdating(false);
    }
  }

  return {
    isUpdating,
    updateBooking,
  };
}

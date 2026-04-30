import { useState } from "react";

import { deleteBooking as deleteBookingService } from "@/features/bookings/services/bookingMutationService";

export function useDeleteBooking() {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteBooking(bookingId: string) {
    setIsDeleting(true);
    const result = await deleteBookingService(bookingId);
    setIsDeleting(false);

    return result;
  }

  return {
    deleteBooking,
    isDeleting,
  };
}

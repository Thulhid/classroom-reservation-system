export type UpdateBookingPayload = {
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
};

type BookingMutationResponse = {
  message?: string;
};

export async function deleteBooking(bookingId: string) {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
  const result = (await response.json()) as BookingMutationResponse;

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not delete booking.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Booking deleted successfully.",
  };
}

export async function updateBooking(
  bookingId: string,
  payload: UpdateBookingPayload,
) {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as BookingMutationResponse;

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not update booking.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Booking updated successfully.",
  };
}

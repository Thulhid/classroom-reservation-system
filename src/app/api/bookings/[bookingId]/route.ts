import { auth } from "@/auth";
import {
  deleteBookingForTeacher,
  getBookingErrorResponse,
  updateBookingForTeacher,
} from "@/features/bookings/services/bookingService";

type UpdateBookingRequestBody = {
  purpose?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
};

type BookingRouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: BookingRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (session.user.role !== "TEACHER") {
    return Response.json(
      { message: "Only teachers can update classroom bookings." },
      { status: 403 },
    );
  }

  const { bookingId } = await params;
  const body = (await request.json()) as UpdateBookingRequestBody;

  try {
    const booking = await updateBookingForTeacher(
      session.user.id,
      bookingId,
      body,
    );

    return Response.json({
      booking,
      message: "Booking updated successfully.",
    });
  } catch (error) {
    const response = getBookingErrorResponse(error);

    return Response.json(
      { message: response.message },
      { status: response.status },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: BookingRouteContext,
) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (session.user.role !== "TEACHER") {
    return Response.json(
      { message: "Only teachers can delete classroom bookings." },
      { status: 403 },
    );
  }

  const { bookingId } = await params;

  try {
    const booking = await deleteBookingForTeacher(session.user.id, bookingId);

    return Response.json({
      booking,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    const response = getBookingErrorResponse(error);

    return Response.json(
      { message: response.message },
      { status: response.status },
    );
  }
}

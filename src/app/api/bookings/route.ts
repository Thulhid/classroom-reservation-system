import { auth } from "@/auth";
import {
  createBookingForTeacher,
  getBookingErrorResponse,
} from "@/features/bookings/services/bookingService";

type CreateBookingRequestBody = {
  roomId?: string;
  purpose?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (session.user.role !== "TEACHER") {
    return Response.json(
      { message: "Only teachers can create classroom bookings." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as CreateBookingRequestBody;

  try {
    const booking = await createBookingForTeacher(session.user.id, body);

    return Response.json({ booking }, { status: 201 });
  } catch (error) {
    const response = getBookingErrorResponse(error);

    return Response.json(
      { message: response.message },
      { status: response.status },
    );
  }
}

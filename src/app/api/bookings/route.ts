import { auth } from "@/auth";
import {
  createBookingForTeacher,
  getBookingErrorResponse,
  getTeacherBookingsPage,
} from "@/features/bookings/services/bookingService";
import {
  parseBookingPage,
  parseBookingSortOrder,
  parseBookingStatusFilter,
} from "@/features/bookings/lib/bookingQuery";

type CreateBookingRequestBody = {
  roomId?: string;
  purpose?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
};

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (session.user.role !== "TEACHER") {
    return Response.json(
      { message: "Only teachers can view classroom bookings." },
      { status: 403 },
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const bookingsPage = await getTeacherBookingsPage(session.user.id, {
    status: parseBookingStatusFilter(searchParams.get("status")),
    sort: parseBookingSortOrder(searchParams.get("sort")),
    page: parseBookingPage(searchParams.get("page")),
  });

  return Response.json(bookingsPage);
}

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

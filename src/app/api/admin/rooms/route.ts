import { getAdminApiGuard } from "@/features/rooms/lib/adminRoomAccess";
import {
  getAdminRoomValidationMessage,
  parseAdminRoomPayload,
} from "@/features/rooms/validators/adminRoomFormSchema";
import {
  AdminRoomServiceError,
  createAdminRoom,
} from "@/features/rooms/services/adminRoomService";

export const runtime = "nodejs";

function getAdminRoomErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof AdminRoomServiceError) {
    return Response.json({ message: error.message }, { status: error.status });
  }

  return Response.json({ message: fallbackMessage }, { status: 500 });
}

export async function POST(request: Request) {
  const guard = await getAdminApiGuard();

  if (!guard.ok) {
    return guard.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = parseAdminRoomPayload(body);

  if (!parsed.success) {
    return Response.json(
      { message: getAdminRoomValidationMessage(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const room = await createAdminRoom(parsed.data);

    return Response.json(
      {
        room,
        message: "Room created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    return getAdminRoomErrorResponse(error, "Could not create room.");
  }
}

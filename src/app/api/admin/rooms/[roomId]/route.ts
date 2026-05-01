import { getAdminApiGuard } from "@/features/rooms/lib/adminRoomAccess";
import {
  getAdminRoomValidationMessage,
  parseAdminRoomPayload,
} from "@/features/rooms/validators/adminRoomFormSchema";
import {
  AdminRoomServiceError,
  deleteAdminRoom,
  updateAdminRoom,
} from "@/features/rooms/services/adminRoomService";

export const runtime = "nodejs";

type AdminRoomRouteContext = {
  params: Promise<{
    roomId: string;
  }>;
};

function getAdminRoomErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof AdminRoomServiceError) {
    return Response.json({ message: error.message }, { status: error.status });
  }

  return Response.json({ message: fallbackMessage }, { status: 500 });
}

export async function PUT(
  request: Request,
  { params }: AdminRoomRouteContext,
) {
  const guard = await getAdminApiGuard();

  if (!guard.ok) {
    return guard.response;
  }

  const { roomId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = parseAdminRoomPayload(body);

  if (!parsed.success) {
    return Response.json(
      { message: getAdminRoomValidationMessage(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const room = await updateAdminRoom(roomId, parsed.data);

    return Response.json({
      room,
      message: "Room updated successfully.",
    });
  } catch (error) {
    return getAdminRoomErrorResponse(error, "Could not update room.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: AdminRoomRouteContext,
) {
  const guard = await getAdminApiGuard();

  if (!guard.ok) {
    return guard.response;
  }

  const { roomId } = await params;

  try {
    const room = await deleteAdminRoom(roomId);

    return Response.json({
      room,
      message: "Room deleted successfully.",
    });
  } catch (error) {
    return getAdminRoomErrorResponse(error, "Could not delete room.");
  }
}

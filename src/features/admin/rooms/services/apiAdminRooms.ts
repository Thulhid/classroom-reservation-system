import type { AdminRoomPayload } from "@/features/admin/rooms/validators/adminRoomFormSchema";

type AdminRoomMutationResponse = {
  message?: string;
};

async function parseResponse(response: Response) {
  return (await response.json()) as AdminRoomMutationResponse;
}

export async function createAdminRoom(payload: AdminRoomPayload) {
  const response = await fetch("/api/admin/rooms", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await parseResponse(response);

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not create room.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Room created successfully.",
  };
}

export async function updateAdminRoom(
  roomId: string,
  payload: AdminRoomPayload,
) {
  const response = await fetch(`/api/admin/rooms/${roomId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await parseResponse(response);

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not update room.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Room updated successfully.",
  };
}

export async function deleteAdminRoom(roomId: string) {
  const response = await fetch(`/api/admin/rooms/${roomId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
  const result = await parseResponse(response);

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not delete room.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Room deleted successfully.",
  };
}

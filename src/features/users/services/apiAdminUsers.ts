import type {
  AdminCreateUserPayload,
  AdminUserPayload,
} from "@/features/users/validators/adminUserFormSchema";

type AdminUserMutationResponse = {
  message?: string;
};

async function parseResponse(response: Response) {
  return (await response.json()) as AdminUserMutationResponse;
}

export async function createAdminUser(payload: AdminCreateUserPayload) {
  const response = await fetch("/api/admin/users", {
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
      message: result.message ?? "Could not create user account.",
    };
  }

  return {
    success: true,
    message: result.message ?? "User account created successfully.",
  };
}

export async function updateAdminUser(
  userId: string,
  payload: AdminUserPayload,
) {
  const response = await fetch(`/api/admin/users/${userId}`, {
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
      message: result.message ?? "Could not update user account.",
    };
  }

  return {
    success: true,
    message: result.message ?? "User account updated successfully.",
  };
}

export async function deleteAdminUser(userId: string) {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
  const result = await parseResponse(response);

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not delete user account.",
    };
  }

  return {
    success: true,
    message: result.message ?? "User account deleted successfully.",
  };
}

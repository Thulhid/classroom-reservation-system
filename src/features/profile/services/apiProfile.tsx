import type { UpdatePasswordPayload } from "@/features/profile/validators/updatePasswordSchema";

type ProfileMutationResponse = {
  message?: string;
};

export async function updateProfilePhoto(publicId: string) {
  const response = await fetch("/api/profile/image", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: publicId,
    }),
  });
  const result = (await response.json()) as {
    image?: string;
    message?: string;
  };

  if (!response.ok) {
    return {
      success: false,

      message: result.message,
    };
  }

  if (!result.image) {
    return {
      success: false,

      message: "Profile photo was saved, but no image was returned.",
    };
  }

  return {
    success: true,
    image: result.image,
  };
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  const response = await fetch("/api/profile/password", {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as ProfileMutationResponse;

  if (!response.ok) {
    return {
      success: false,
      message: result.message ?? "Could not update password.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Password updated successfully.",
  };
}

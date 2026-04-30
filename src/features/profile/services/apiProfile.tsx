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

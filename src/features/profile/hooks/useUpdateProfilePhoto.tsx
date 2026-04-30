import { updateProfilePhoto as updateProfilePhotoService } from "@/features/profile/services/profileService";
import { useState } from "react";

export function useUpdateProfilePhoto() {
  const [isSaving, setIsSaving] = useState(false);

  async function updateProfilePhoto(publicId: string) {
    setIsSaving(true);
    const result = await updateProfilePhotoService(publicId);
    setIsSaving(false);

    return result;
  }
  return { isSaving, updateProfilePhoto };
}

"use client";

import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import {
  CldImage,
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useState } from "react";

import { Button } from "@/features/shared/ui/button";
import { useSession } from "next-auth/react";
import { useUpdateProfilePhoto } from "../hooks/useUpdateProfilePhoto";

type ProfilePhotoUploaderProps = {
  image?: string | null;
  initials: string;
  name: string;
};

type CloudinaryUploadInfo = {
  public_id?: string;
};

const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ProfilePhotoUploader({
  image,
  initials,
  name,
}: ProfilePhotoUploaderProps) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(image);
  const [error, setError] = useState("");
  const { isSaving, updateProfilePhoto } = useUpdateProfilePhoto();
  const isUploadConfigured = Boolean(cloudinaryUploadPreset);
  const { update } = useSession();

  async function handleUploadSuccess(results: CloudinaryUploadWidgetResults) {
    setError("");

    const info = results.info as CloudinaryUploadInfo | undefined;
    const publicId = info?.public_id;

    if (!publicId) {
      setError("Could not read uploaded image.");
      return;
    }

    const result = await updateProfilePhoto(publicId);

    if (!result.success) {
      setError(result?.message || "Could not save profile photo.");
      return;
    }

    setCurrentImage(result.image);
    await update({ image: result.image });
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-3xl font-semibold text-sky-700 ring-4 ring-sky-50 sm:size-32">
        {currentImage ? (
          <CldImage
            src={currentImage}
            alt={`${name} profile photo`}
            width="160"
            height="160"
            crop={{
              type: "thumb",
              gravity: "face",
            }}
            format="webp"
            quality="auto"
            className="size-full object-cover"
          />
        ) : initials ? (
          initials.toUpperCase()
        ) : (
          <UserRound size={52} />
        )}
      </div>

      <CldUploadWidget
        uploadPreset={cloudinaryUploadPreset}
        onSuccess={handleUploadSuccess}
        onError={(uploadError) => {
          if (typeof uploadError === "string") {
            setError(uploadError);
            return;
          }

          setError(
            uploadError?.statusText ?? "Could not upload profile photo.",
          );
        }}
        options={{
          sources: ["local", "camera"],
          multiple: false,
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          cropping: true,
          croppingAspectRatio: 1,
          croppingDefaultSelectionRatio: 1,
          croppingShowDimensions: true,
          showSkipCropButton: false,
          folder: "classroom-reservation-system/user-profiles",
        }}
      >
        {({ open, isLoading }) => (
          <Button
            buttonType="button"
            variant="secondary"
            disabled={isLoading || isSaving || !isUploadConfigured}
            className="mt-6 border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              if (!isUploadConfigured) {
                setError("Cloudinary upload preset is not configured.");
                return;
              }

              open();
            }}
          >
            {isSaving ? "Saving..." : "Change Photo"}
          </Button>
        )}
      </CldUploadWidget>

      {error ? (
        <p className="mt-3 text-center text-sm font-medium text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

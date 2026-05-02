"use client";

import { useMemo, useState } from "react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import CloudinaryImage from "@/features/shared/components/CloudinaryImage";
import { Button } from "@/features/shared/ui/button";

type CloudinaryUploadInfo = {
  public_id?: string;
};

type AdminRoomImageFieldProps = {
  buttonLabel: string;
  description: string;
  disabled?: boolean;
  emptyLabel: string;
  error?: string;
  helperText?: string;
  images: string[];
  label: string;
  maxItems?: number;
  onChange: (images: string[]) => void;
};

const roomUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_ROOM_UPLOAD_PRESET ??
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const ROOM_IMAGE_ASPECT_RATIO = 16 / 9;
const ROOM_IMAGE_FOLDER = "classroom-reservation-system/rooms";

function getUniqueImages(images: string[]) {
  const seen = new Set<string>();

  return images.filter((image) => {
    const key = image.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export default function AdminRoomImageField({
  buttonLabel,
  description,
  disabled = false,
  emptyLabel,
  error,
  helperText,
  images,
  label,
  maxItems = 1,
  onChange,
}: AdminRoomImageFieldProps) {
  const [uploadError, setUploadError] = useState("");
  const [isReplacing, setIsReplacing] = useState(false);
  const isUploadConfigured = Boolean(roomUploadPreset);
  const remainingSlots = Math.max(0, maxItems - images.length);
  const canUpload = remainingSlots > 0 || maxItems === 1;
  const previewImages = useMemo(() => getUniqueImages(images), [images]);

  function handleUploadSuccess(results: CloudinaryUploadWidgetResults) {
    setUploadError("");
    setIsReplacing(false);

    const info = results.info as CloudinaryUploadInfo | undefined;
    const publicId = info?.public_id?.trim();

    if (!publicId) {
      setUploadError("Could not read uploaded image.");
      return;
    }

    const nextImages =
      maxItems === 1
        ? [publicId]
        : getUniqueImages([...previewImages, publicId]).slice(0, maxItems);

    onChange(nextImages);
  }

  function handleRemove(imageToRemove: string) {
    onChange(previewImages.filter((image) => image !== imageToRemove));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
        {previewImages.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {previewImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/9] bg-slate-100">
                  <CloudinaryImage
                    src={image}
                    alt={`${label} preview ${index + 1}`}
                    fill
                    crop={{
                      type: "fill",
                      gravity: "center",
                    }}
                    format="webp"
                    quality="auto"
                    sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {maxItems === 1 ? "Cover image" : `Image ${index + 1}`}
                    </p>
                    <p className="truncate text-xs text-slate-500">{image}</p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${label.toLowerCase()} image`}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition-colors hover:border-red-200 hover:bg-red-100 hover:text-red-700 disabled:pointer-events-none disabled:opacity-50"
                    disabled={disabled}
                    onClick={() => handleRemove(image)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
            <ImagePlus className="mx-auto size-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-700">
              {emptyLabel}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Uploaded room images are delivered as `.webp` and cropped to a
              consistent wide classroom frame.
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CldUploadWidget
            uploadPreset={roomUploadPreset}
            onSuccess={handleUploadSuccess}
            onError={(uploadError) => {
              setIsReplacing(false);

              if (typeof uploadError === "string") {
                setUploadError(uploadError);
                return;
              }

              setUploadError(
                uploadError?.statusText ?? "Could not upload room image.",
              );
            }}
            options={{
              sources: ["local", "camera"],
              multiple: false,
              maxFiles: 1,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
              cropping: true,
              croppingAspectRatio: ROOM_IMAGE_ASPECT_RATIO,
              croppingDefaultSelectionRatio: ROOM_IMAGE_ASPECT_RATIO,
              croppingShowDimensions: true,
              showSkipCropButton: false,
              folder: ROOM_IMAGE_FOLDER,
            }}
          >
            {({ open, isLoading }) => (
              <Button
                buttonType="button"
                variant="outline"
                disabled={
                  disabled || isLoading || !isUploadConfigured || !canUpload
                }
                className="gap-2 border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-white"
                onClick={() => {
                  if (!isUploadConfigured) {
                    setUploadError(
                      "Cloudinary room upload preset is not configured.",
                    );
                    return;
                  }

                  setUploadError("");
                  setIsReplacing(true);
                  open();
                }}
              >
                {isLoading || isReplacing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImagePlus className="size-4" />
                    {buttonLabel}
                  </>
                )}
              </Button>
            )}
          </CldUploadWidget>

          {helperText ? (
            <p className="text-xs leading-5 text-slate-500">{helperText}</p>
          ) : null}
        </div>

        {uploadError ? (
          <p className="mt-3 text-sm font-medium text-red-500">{uploadError}</p>
        ) : error ? (
          <p className="mt-3 text-sm font-medium text-red-500">{error}</p>
        ) : null}
      </div>
    </div>
  );
}

import type {
  CldImageProps,
  CloudinaryUploadWidgetOptions,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

type RoomImageVariant = "adminPreview" | "card" | "carousel" | "tableThumb";

type RoomImageDeliveryProps = Pick<
  CldImageProps,
  "crop" | "format" | "height" | "quality" | "sizes" | "width"
>;

type CloudinaryUploadInfo = {
  public_id?: string;
};

export const roomImageUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_ROOM_UPLOAD_PRESET ??
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const ROOM_IMAGE_ASPECT_RATIO = 16 / 9;
export const ROOM_IMAGE_FOLDER = "classroom-reservation-system/rooms";

const roomImageCrop = {
  type: "fill",
  gravity: "center",
} as const;

const roomImageDeliveryByVariant = {
  adminPreview: {
    width: 1280,
    height: 720,
    sizes: "(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 100vw",
  },
  card: {
    width: 960,
    height: 540,
    sizes: "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw",
  },
  carousel: {
    width: 1600,
    height: 900,
    sizes: "(min-width: 1024px) 1200px, 100vw",
  },
  tableThumb: {
    width: 160,
    height: 160,
    sizes: "56px",
  },
} satisfies Record<
  RoomImageVariant,
  Pick<RoomImageDeliveryProps, "height" | "sizes" | "width">
>;

export const roomImageUploadOptions = {
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
  tags: ["room"],
} satisfies CloudinaryUploadWidgetOptions;

export function getUniqueRoomImages(images: string[]) {
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

export function getUploadedRoomImagePublicId(
  results: CloudinaryUploadWidgetResults,
) {
  const info = results.info as CloudinaryUploadInfo | undefined;

  return info?.public_id?.trim() ?? "";
}

export function getRoomImageDeliveryProps(
  variant: RoomImageVariant,
): RoomImageDeliveryProps {
  return {
    ...roomImageDeliveryByVariant[variant],
    crop: roomImageCrop,
    format: "webp",
    quality: "auto",
  };
}

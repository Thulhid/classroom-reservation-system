import { z } from "zod";

const photoReferenceSchema = z
  .string()
  .trim()
  .min(1, "Photo reference is required.")
  .max(200, "Photo reference is too long.");

export const adminRoomFormSchema = z.object({
  number: z
    .string()
    .trim()
    .min(1, "Room number is required.")
    .max(24, "Room number is too long."),
  name: z
    .string()
    .trim()
    .min(1, "Room name is required.")
    .max(80, "Room name is too long."),
  floor: z
    .string()
    .trim()
    .min(1, "Floor is required.")
    .max(40, "Floor is too long."),
  capacity: z.number().int().min(1, "Capacity must be at least 1."),
  coverImage: photoReferenceSchema,
  images: z.array(photoReferenceSchema).max(10, "Add up to 10 room photos."),
  presentationSystem: z.boolean(),
  projector: z.boolean(),
  internetAccess: z.boolean(),
  airConditioned: z.boolean(),
  tables: z.number().int().min(0, "Tables cannot be negative."),
  lecturerDesk: z
    .number()
    .int()
    .min(0, "Lecturer desks cannot be negative."),
  whiteBoards: z.number().int().min(0, "White boards cannot be negative."),
});

export type AdminRoomFormValues = z.infer<typeof adminRoomFormSchema>;
export type AdminRoomPayload = AdminRoomFormValues;

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }

  return value;
}

function toBoolean(value: unknown) {
  return value === true || value === "true" || value === "on" || value === 1;
}

function toImageReferences(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();

  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean)
    .filter((entry) => {
      const key = entry.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

export function parseAdminRoomPayload(input: unknown) {
  const data =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  return adminRoomFormSchema.safeParse({
    number: data.number,
    name: data.name,
    floor: data.floor,
    capacity: toNumber(data.capacity),
    coverImage: data.coverImage,
    images: toImageReferences(data.images),
    presentationSystem: toBoolean(data.presentationSystem),
    projector: toBoolean(data.projector),
    internetAccess: toBoolean(data.internetAccess),
    airConditioned: toBoolean(data.airConditioned),
    tables: toNumber(data.tables),
    lecturerDesk: toNumber(data.lecturerDesk),
    whiteBoards: toNumber(data.whiteBoards),
  });
}

export function getAdminRoomValidationMessage(error: z.ZodError) {
  return (
    error.issues[0]?.message ?? "Please review the room details and try again."
  );
}

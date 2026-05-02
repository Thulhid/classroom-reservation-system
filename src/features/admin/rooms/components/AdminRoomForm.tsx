"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DoorOpen, ImagePlus, Loader2, PencilLine, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, type UseFormRegister, useForm } from "react-hook-form";
import type { Room } from "@/generated/prisma/client";

import AdminRoomImageField from "@/features/admin/rooms/components/AdminRoomImageField";
import {
  createAdminRoom,
  updateAdminRoom,
} from "@/features/admin/rooms/services/apiAdminRooms";
import { showErrorToast, showSuccessToast } from "@/features/shared/lib/toast";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import {
  adminRoomFormSchema,
  type AdminRoomFormValues,
} from "@/features/admin/rooms/validators/adminRoomFormSchema";

type AdminRoomFormProps = {
  room?: Room | null;
};

function RoomToggleField({
  description,
  label,
  name,
  register,
}: {
  description: string;
  label: string;
  name: keyof Pick<
    Room,
    "presentationSystem" | "projector" | "internetAccess" | "airConditioned"
  >;
  register: UseFormRegister<AdminRoomFormValues>;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/60">
      <input
        type="checkbox"
        {...register(name)}
        className="mt-0.5 size-4 rounded border-slate-300 text-sky-600 focus:ring focus:ring-sky-500"
      />
      <span>
        <span className="block text-sm font-medium text-slate-800">
          {label}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  );
}

export default function AdminRoomForm({ room }: AdminRoomFormProps) {
  const router = useRouter();
  const isUpdateMode = Boolean(room);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminRoomFormValues>({
    resolver: zodResolver(adminRoomFormSchema),
    defaultValues: {
      number: room?.number ?? "",
      name: room?.name ?? "",
      floor: room?.floor ?? "",
      capacity: room?.capacity ?? 40,
      coverImage: room?.coverImage ?? "",
      images: room?.images ?? [],
      presentationSystem: room?.presentationSystem ?? false,
      projector: room?.projector ?? false,
      internetAccess: room?.internetAccess ?? true,
      airConditioned: room?.airConditioned ?? false,
      tables: room?.tables ?? 0,
      lecturerDesk: room?.lecturerDesk ?? 1,
      whiteBoards: room?.whiteBoards ?? 1,
    },
  });

  async function onSubmit(data: AdminRoomFormValues) {
    try {
      const result = room
        ? await updateAdminRoom(room.id, data)
        : await createAdminRoom(data);

      if (!result.success) {
        showErrorToast(result.message ?? "Could not save room details.");
        return;
      }

      showSuccessToast(result.message);
      router.push("/admin/rooms");
      router.refresh();
    } catch {
      showErrorToast("Could not save room details.");
    }
  }

  function onInvalid() {
    showErrorToast("Please review the room details.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <DoorOpen className="size-4 text-sky-600" />
          Basic details
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label
              htmlFor="number"
              className="text-sm font-medium text-slate-700"
            >
              Room number
            </label>
            <Input
              id="number"
              placeholder="301"
              {...register("number")}
              disabled={isSubmitting}
              required
            />
            {errors.number ? (
              <p className="text-sm text-red-600">{errors.number.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Room name
            </label>
            <Input
              id="name"
              placeholder="Smart Classroom 301"
              {...register("name")}
              disabled={isSubmitting}
              required
            />
            {errors.name ? (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="capacity"
              className="text-sm font-medium text-slate-700"
            >
              Capacity
            </label>
            <Input
              id="capacity"
              type="number"
              min={1}
              placeholder="40"
              {...register("capacity", { valueAsNumber: true })}
              disabled={isSubmitting}
              required
            />
            {errors.capacity ? (
              <p className="text-sm text-red-600">{errors.capacity.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="floor"
              className="text-sm font-medium text-slate-700"
            >
              Floor
            </label>
            <Input
              id="floor"
              placeholder="Second floor"
              {...register("floor")}
              disabled={isSubmitting}
              required
            />
            {errors.floor ? (
              <p className="text-sm text-red-600">{errors.floor.message}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <ImagePlus className="size-4 text-sky-600" />
          Room photos
        </div>

        <div className="mt-5 space-y-6">
          <Controller
            control={control}
            name="coverImage"
            render={({ field, fieldState }) => (
              <AdminRoomImageField
                label="Cover image"
                description="Upload the primary room image used across room cards, tables, and detail pages."
                emptyLabel="No cover image uploaded yet."
                buttonLabel={
                  field.value ? "Replace cover image" : "Upload cover image"
                }
                helperText="Use a wide classroom shot. The uploader enforces a consistent crop."
                images={field.value ? [field.value] : []}
                maxItems={1}
                error={fieldState.error?.message}
                disabled={isSubmitting}
                onChange={(images) => field.onChange(images[0] ?? "")}
              />
            )}
          />

          <Controller
            control={control}
            name="images"
            render={({ field, fieldState }) => (
              <AdminRoomImageField
                label="Additional gallery images"
                description="Upload supporting room photos for the classroom detail carousel."
                emptyLabel="No additional room images uploaded yet."
                buttonLabel="Upload gallery image"
                helperText="Add up to 10 additional images. Each upload is cropped to the same wide presentation frame."
                images={field.value ?? []}
                maxItems={10}
                error={fieldState.error?.message}
                disabled={isSubmitting}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-800">Facilities</div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <RoomToggleField
            name="presentationSystem"
            label="Presentation system"
            description="Built-in display or presentation control system."
            register={register}
          />
          <RoomToggleField
            name="projector"
            label="Projector"
            description="Dedicated projector hardware ready for teaching."
            register={register}
          />
          <RoomToggleField
            name="internetAccess"
            label="Internet access"
            description="Wi-Fi or network access available in the room."
            register={register}
          />
          <RoomToggleField
            name="airConditioned"
            label="Air conditioned"
            description="Climate-controlled room for longer sessions."
            register={register}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-800">
          Furniture and fixtures
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label
              htmlFor="tables"
              className="text-sm font-medium text-slate-700"
            >
              Tables
            </label>
            <Input
              id="tables"
              type="number"
              min={0}
              {...register("tables", { valueAsNumber: true })}
              disabled={isSubmitting}
              required
            />
            {errors.tables ? (
              <p className="text-sm text-red-600">{errors.tables.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lecturerDesk"
              className="text-sm font-medium text-slate-700"
            >
              Lecturer desks
            </label>
            <Input
              id="lecturerDesk"
              type="number"
              min={0}
              {...register("lecturerDesk", { valueAsNumber: true })}
              disabled={isSubmitting}
              required
            />
            {errors.lecturerDesk ? (
              <p className="text-sm text-red-600">
                {errors.lecturerDesk.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="whiteBoards"
              className="text-sm font-medium text-slate-700"
            >
              White boards
            </label>
            <Input
              id="whiteBoards"
              type="number"
              min={0}
              {...register("whiteBoards", { valueAsNumber: true })}
              disabled={isSubmitting}
              required
            />
            {errors.whiteBoards ? (
              <p className="text-sm text-red-600">
                {errors.whiteBoards.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          link="/admin/rooms"
          variant="outline"
          className="justify-center border-slate-300 px-5 py-2 text-sm text-slate-700"
        >
          Cancel
        </Button>
        <Button
          buttonType="submit"
          disabled={isSubmitting}
          className="gap-2 px-5 py-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : isUpdateMode ? (
            <>
              <PencilLine className="size-4" />
              Save changes
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Create room
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarPlus, DoorOpen, FileText } from "lucide-react";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import { Textarea } from "@/features/shared/ui/textarea";
import { showErrorToast, showSuccessToast } from "@/features/shared/lib/toast";
import type { Classroom } from "@/features/rooms/services/roomService";
import type { BookingPeriod } from "@/features/bookings/lib/dateTime";
import { createBooking } from "@/features/bookings/services/apiBookings";
import {
  bookingFormSchema,
  BookingFormValues,
} from "../validators/createBookingSchema";

type BookingFormRoom = Pick<Classroom, "id" | "name">;

type BookingFormProps = {
  rooms: BookingFormRoom[];
  period: Pick<BookingPeriod, "date" | "startTime" | "endTime">;
  lockedRoomId?: string;
  title?: string;
  description?: string;
  variant?: "wide" | "compact";
};

export default function BookingForm({
  rooms,
  period,
  lockedRoomId,
  title = "Book a classroom",
  description,
  variant = "wide",
}: BookingFormProps) {
  const router = useRouter();
  const lockedRoom = rooms.find((room) => room.id === lockedRoomId);
  const isCompact = variant === "compact";
  const defaultRoomId = lockedRoom?.id ?? rooms[0]?.id ?? "";
  const roomInputId = isCompact ? "compactRoomId" : "roomId";
  const dateInputId = isCompact ? "compactBookingDate" : "bookingDate";
  const startTimeInputId = isCompact
    ? "compactBookingStartTime"
    : "bookingStartTime";
  const endTimeInputId = isCompact ? "compactBookingEndTime" : "bookingEndTime";
  const purposeInputId = isCompact ? "compactPurpose" : "purpose";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      roomId: defaultRoomId,
      date: period.date,
      startTime: period.startTime,
      endTime: period.endTime,
      purpose: "",
    },
  });

  async function onSubmit(data: BookingFormValues) {
    const response = await createBooking(data);

    if (!response.success) {
      showErrorToast(response.message);
      return;
    }

    showSuccessToast(response.message);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-sky-100 bg-sky-50 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 text-slate-800">
        <CalendarPlus size={20} className="text-sky-600" />
        <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
      </div>
      {description ? (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      ) : null}

      <div
        className={
          isCompact
            ? "mt-4 grid gap-4"
            : "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5"
        }
      >
        {lockedRoom ? (
          <input type="hidden" value={lockedRoom.id} {...register("roomId")} />
        ) : (
          <div className="space-y-2">
            <label
              htmlFor={roomInputId}
              className="text-sm font-medium text-slate-700"
            >
              Classroom
            </label>
            <div className="relative">
              <DoorOpen
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
              />
              <select
                id={roomInputId}
                {...register("roomId")}
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-4 py-2 pl-10 text-sm text-slate-700 transition-colors duration-300 focus:ring focus:ring-blue-500 focus:outline-none"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.roomId ? (
              <p className="text-sm text-red-600">{errors.roomId.message}</p>
            ) : null}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor={dateInputId}
            className="text-sm font-medium text-slate-700"
          >
            Date
          </label>
          <Input id={dateInputId} type="date" {...register("date")} />
          {errors.date ? (
            <p className="text-sm text-red-600">{errors.date.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor={startTimeInputId}
            className="text-sm font-medium text-slate-700"
          >
            Start
          </label>
          <Input id={startTimeInputId} type="time" {...register("startTime")} />
          {errors.startTime ? (
            <p className="text-sm text-red-600">{errors.startTime.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor={endTimeInputId}
            className="text-sm font-medium text-slate-700"
          >
            End
          </label>
          <Input id={endTimeInputId} type="time" {...register("endTime")} />
          {errors.endTime ? (
            <p className="text-sm text-red-600">{errors.endTime.message}</p>
          ) : null}
        </div>

        <div
          className={
            isCompact ? "space-y-2" : "space-y-2 md:col-span-2 xl:col-span-1"
          }
        >
          <label
            htmlFor={purposeInputId}
            className="text-sm font-medium text-slate-700"
          >
            Purpose
          </label>
          <div className="relative">
            <FileText
              size={16}
              className="pointer-events-none absolute top-3 left-3 text-slate-400"
            />
            <Textarea
              id={purposeInputId}
              placeholder="Lecture, lab, tutorial..."
              maxLength={120}
              className="pl-10"
              {...register("purpose")}
            />
          </div>
          {errors.purpose ? (
            <p className="text-sm text-red-600">{errors.purpose.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex sm:mt-10 sm:justify-end">
        <Button
          buttonType="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          <CalendarPlus size={16} />
          {isSubmitting ? "Booking..." : "Book room"}
        </Button>
      </div>
    </form>
  );
}

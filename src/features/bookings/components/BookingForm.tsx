"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, DoorOpen, FileText } from "lucide-react";

import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import { Textarea } from "@/features/shared/ui/textarea";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/lib/toast";
import type { Classroom } from "@/features/rooms/services/roomService";
import type { BookingPeriod } from "@/features/bookings/lib/dateTime";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lockedRoom = rooms.find((room) => room.id === lockedRoomId);
  const isCompact = variant === "compact";
  const roomInputId = isCompact ? "compactRoomId" : "roomId";
  const dateInputId = isCompact ? "compactBookingDate" : "bookingDate";
  const startTimeInputId = isCompact
    ? "compactBookingStartTime"
    : "bookingStartTime";
  const endTimeInputId = isCompact ? "compactBookingEndTime" : "bookingEndTime";
  const purposeInputId = isCompact ? "compactPurpose" : "purpose";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      roomId: String(formData.get("roomId") ?? ""),
      purpose: String(formData.get("purpose") ?? ""),
      date: String(formData.get("date") ?? ""),
      startTime: String(formData.get("startTime") ?? ""),
      endTime: String(formData.get("endTime") ?? ""),
    };

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { message?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      showErrorToast(result.message ?? "Could not create booking.");
      return;
    }

    showSuccessToast("Booking created successfully.");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-sky-100 bg-sky-50 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 text-slate-800">
        <CalendarPlus size={20} className="text-sky-600" />
        <h2 className="text-lg font-semibold">{title}</h2>
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
          <input type="hidden" name="roomId" value={lockedRoom.id} />
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
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                id={roomInputId}
                name="roomId"
                defaultValue={rooms[0]?.id}
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-4 py-2 pl-10 text-sm text-slate-700 transition-colors duration-300 focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor={dateInputId}
            className="text-sm font-medium text-slate-700"
          >
            Date
          </label>
          <Input
            id={dateInputId}
            name="date"
            type="date"
            defaultValue={period.date}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={startTimeInputId}
            className="text-sm font-medium text-slate-700"
          >
            Start
          </label>
          <Input
            id={startTimeInputId}
            name="startTime"
            type="time"
            defaultValue={period.startTime}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={endTimeInputId}
            className="text-sm font-medium text-slate-700"
          >
            End
          </label>
          <Input
            id={endTimeInputId}
            name="endTime"
            type="time"
            defaultValue={period.endTime}
            required
          />
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
              className="pointer-events-none absolute left-3 top-3 text-slate-400"
            />
            <Textarea
              id={purposeInputId}
              name="purpose"
              placeholder="Lecture, lab, tutorial..."
              maxLength={120}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          buttonType="submit"
          disabled={isSubmitting}
          className={isCompact ? "w-full gap-2 px-5" : "gap-2 px-5"}
        >
          <CalendarPlus size={16} />
          {isSubmitting ? "Booking..." : "Book room"}
        </Button>
      </div>
    </form>
  );
}

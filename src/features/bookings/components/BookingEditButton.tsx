"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  FileText,
  Loader2,
  PencilLine,
} from "lucide-react";

import { useUpdateBooking } from "@/features/bookings/hooks/useUpdateBooking";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/lib/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/ui/dialog";
import { Input } from "@/features/shared/ui/input";
import { Textarea } from "@/features/shared/ui/textarea";
import { cn } from "@/lib/utils";

type BookingEditButtonProps = {
  bookingId: string;
  bookingName?: string | null;
  initialDate: string;
  initialEndTime: string;
  initialPurpose?: string | null;
  initialStartTime: string;
  className?: string;
  onUpdated?: () => void;
};

export default function BookingEditButton({
  bookingId,
  bookingName,
  initialDate,
  initialEndTime,
  initialPurpose,
  initialStartTime,
  className,
  onUpdated,
}: BookingEditButtonProps) {
  const router = useRouter();
  const formId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const { isUpdating, updateBooking } = useUpdateBooking();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      purpose: String(formData.get("purpose") ?? ""),
      date: String(formData.get("date") ?? ""),
      startTime: String(formData.get("startTime") ?? ""),
      endTime: String(formData.get("endTime") ?? ""),
    };

    try {
      const result = await updateBooking(bookingId, payload);

      if (!result.success) {
        showErrorToast(result.message ?? "Could not update booking.");
        return;
      }

      showSuccessToast(result.message);
      setIsOpen(false);
      onUpdated?.();
      router.refresh();
    } catch {
      showErrorToast("Could not update booking.");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isUpdating) {
          setIsOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-sky-100 bg-sky-50 text-sky-600 transition-colors hover:border-sky-200 hover:bg-sky-100 hover:text-sky-700 disabled:pointer-events-none disabled:opacity-60",
            className,
          )}
          title="Edit booking"
          aria-label="Edit booking"
          disabled={isUpdating}
        >
          <PencilLine size={16} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit booking</DialogTitle>
          <DialogDescription>
            Update
            {bookingName ? ` "${bookingName}"` : " this classroom booking"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-3">
              <label
                htmlFor={`${formId}-purpose`}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <FileText size={16} className="text-sky-600" />
                Purpose
              </label>
              <Textarea
                id={`${formId}-purpose`}
                name="purpose"
                defaultValue={initialPurpose ?? ""}
                maxLength={120}
                placeholder="Lecture, lab, tutorial..."
                disabled={isUpdating}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${formId}-date`}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <CalendarDays size={16} className="text-sky-600" />
                Date
              </label>
              <Input
                id={`${formId}-date`}
                name="date"
                type="date"
                defaultValue={initialDate}
                disabled={isUpdating}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${formId}-start-time`}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <Clock size={16} className="text-sky-600" />
                Start
              </label>
              <Input
                id={`${formId}-start-time`}
                name="startTime"
                type="time"
                defaultValue={initialStartTime}
                disabled={isUpdating}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${formId}-end-time`}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <Clock size={16} className="text-sky-600" />
                End
              </label>
              <Input
                id={`${formId}-end-time`}
                name="endTime"
                type="time"
                defaultValue={initialEndTime}
                disabled={isUpdating}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
              disabled={isUpdating}
            >
              Cancel
            </DialogClose>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sky-600 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:pointer-events-none disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <PencilLine className="size-4" />
                  Save changes
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

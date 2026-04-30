"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDeleteBooking } from "@/features/bookings/hooks/useDeleteBooking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/features/shared/ui/alert-dialog";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/lib/toast";
import { cn } from "@/lib/utils";

type BookingDeleteButtonProps = {
  bookingId: string;
  bookingName?: string | null;
  className?: string;
  onDeleted?: () => void;
};

export default function BookingDeleteButton({
  bookingId,
  bookingName,
  className,
  onDeleted,
}: BookingDeleteButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { deleteBooking, isDeleting } = useDeleteBooking();

  async function handleDelete() {
    const result = await deleteBooking(bookingId);

    if (!result.success) {
      showErrorToast(result.message ?? "Could not delete booking.");
      return;
    }

    showSuccessToast(result.message);
    setIsOpen(false);
    onDeleted?.();
    router.refresh();
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-600 transition-colors hover:border-red-200 hover:bg-red-100 hover:text-red-700 disabled:pointer-events-none disabled:opacity-60",
            className,
          )}
          title="Delete booking"
          aria-label="Delete booking"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove
            {bookingName ? ` "${bookingName}"` : " this classroom booking"} from
            the schedule. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete booking
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

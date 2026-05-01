"use client";

import { Ellipsis, Loader2, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Room } from "@/generated/prisma/client";

import { deleteAdminRoom } from "@/features/rooms/services/apiAdminRooms";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/lib/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/ui/dropdown-menu";

type AdminRoomRowActionsProps = {
  room: Room;
};

export default function AdminRoomRowActions({
  room,
}: AdminRoomRowActionsProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteAdminRoom(room.id);

      if (!result.success) {
        setIsDeleting(false);
        showErrorToast(result.message ?? "Could not delete room.");
        return;
      }

      showSuccessToast(result.message);
      setIsDeleting(false);
      setIsDeleteOpen(false);
      router.refresh();
    } catch {
      setIsDeleting(false);
      showErrorToast("Could not delete room.");
    }
  }

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Open actions for ${room.name}`}
            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            <Ellipsis className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Room actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setIsMenuOpen(false);
              router.push(`/admin/rooms/${room.id}/edit`);
            }}
          >
            <PencilLine className="size-4" />
            Edit room
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
            onSelect={(event) => {
              event.preventDefault();
              setIsMenuOpen(false);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="size-4" />
            Delete room
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this room?</AlertDialogTitle>
            <AlertDialogDescription>
              {room.name} will be removed from the active room catalog. Rooms
              with current or upcoming bookings cannot be deleted until those
              bookings are cleared.
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
                  Delete room
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { Ellipsis, Loader2, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AdminManagedUser } from "@/features/admin/users/types/AdminTypes";
import {
  getManagedUserLabel,
  getManagedUsersRoute,
} from "@/features/admin/users/lib/adminUsers";
import { deleteAdminUser } from "@/features/admin/users/services/apiAdminUsers";
import { showErrorToast, showSuccessToast } from "@/features/shared/lib/toast";
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

type AdminUserRowActionsProps = {
  user: AdminManagedUser;
};

function getDeleteDescription(user: AdminManagedUser) {
  if (user.role === "TEACHER") {
    return "This teacher account and all bookings linked to this teacher will be permanently removed from the system.";
  }

  return "This student account will be permanently removed from the system. Passwords are not edited here, but the account itself will no longer be able to sign in.";
}

export default function AdminUserRowActions({
  user,
}: AdminUserRowActionsProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const roleLabel = getManagedUserLabel(user.role);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteAdminUser(user.id);

      if (!result.success) {
        setIsDeleting(false);
        showErrorToast(result.message ?? "Could not delete user account.");
        return;
      }

      showSuccessToast(result.message);
      setIsDeleting(false);
      setIsDeleteOpen(false);
      router.refresh();
    } catch {
      setIsDeleting(false);
      showErrorToast("Could not delete user account.");
    }
  }

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Open actions for ${user.firstName} ${user.lastName}`}
            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            <Ellipsis className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>{roleLabel} actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setIsMenuOpen(false);
              router.push(
                `${getManagedUsersRoute(user.role)}/${user.id}/update`,
              );
            }}
          >
            <PencilLine className="size-4" />
            Update account
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
            Delete account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this {roleLabel.toLowerCase()}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getDeleteDescription(user)}
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
                  Delete account
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

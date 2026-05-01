"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { ManagedUserRole } from "@/features/users/lib/adminUsers";
import { getManagedUserLabel } from "@/features/users/lib/adminUsers";
import AdminUserDetailsFields from "@/features/users/components/admin/AdminUserDetailsFields";
import AdminUserPasswordFields from "@/features/users/components/admin/AdminUserPasswordFields";
import { createAdminUser } from "@/features/users/services/apiAdminUsers";
import {
  adminCreateUserFormSchema,
  type AdminCreateUserFormValues,
} from "@/features/users/validators/adminUserFormSchema";
import { showErrorToast, showSuccessToast } from "@/features/shared/lib/toast";
import { Button } from "@/features/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/ui/dialog";

type AdminCreateUserDialogProps = {
  role: ManagedUserRole;
};

function getDefaultValues(role: ManagedUserRole): AdminCreateUserFormValues {
  return {
    role,
    firstName: "",
    lastName: "",
    uniID: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
}

export default function AdminCreateUserDialog({
  role,
}: AdminCreateUserDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const roleLabel = getManagedUserLabel(role);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreateUserFormValues>({
    resolver: zodResolver(adminCreateUserFormSchema),
    defaultValues: getDefaultValues(role),
  });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);

    if (!nextOpen) {
      reset(getDefaultValues(role));
    }
  }

  async function onSubmit(data: AdminCreateUserFormValues) {
    try {
      const result = await createAdminUser(data);

      if (!result.success) {
        showErrorToast(result.message ?? "Could not create user account.");
        return;
      }

      showSuccessToast(result.message ?? "User account created successfully.");
      handleOpenChange(false);
      router.refresh();
    } catch {
      showErrorToast("Could not create user account.");
    }
  }

  function onInvalid() {
    showErrorToast("Please review the new account details.");
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button buttonType="button" className="gap-2 px-5 py-2 text-sm">
          <Plus className="size-4" />
          Add {roleLabel.toLowerCase()}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-sky-600" />
            Create {roleLabel.toLowerCase()} account
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
        >
          <input type="hidden" {...register("role")} />

          <AdminUserDetailsFields
            disabled={isSubmitting}
            fields={{
              firstName: register("firstName"),
              lastName: register("lastName"),
              uniID: register("uniID"),
              email: register("email"),
            }}
            errors={{
              firstName: errors.firstName?.message,
              lastName: errors.lastName?.message,
              uniID: errors.uniID?.message,
              email: errors.email?.message,
            }}
          />

          <AdminUserPasswordFields
            disabled={isSubmitting}
            fields={{
              password: register("password"),
              confirmPassword: register("confirmPassword"),
            }}
            errors={{
              password: errors.password?.message,
              confirmPassword: errors.confirmPassword?.message,
            }}
          />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              buttonType="button"
              variant="outline"
              disabled={isSubmitting}
              className="justify-center border-slate-300 px-5 py-2 text-sm text-slate-700"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              buttonType="submit"
              disabled={isSubmitting}
              className="gap-2 px-5 py-2 text-sm"
            >
              {isSubmitting
                ? "Creating..."
                : `Create ${roleLabel.toLowerCase()}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

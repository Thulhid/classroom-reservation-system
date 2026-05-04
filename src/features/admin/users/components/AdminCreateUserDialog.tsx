"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { ManagedUserRole } from "@/features/admin/users/types/AdminTypes";
import { getManagedUserLabel } from "@/features/admin/users/lib/adminUsers";
import { createAdminUser } from "@/features/admin/users/services/apiAdminUsers";
import {
  adminCreateUserFormSchema,
  type AdminCreateUserFormValues,
} from "@/features/admin/users/validators/adminUserFormSchema";
import { useShowPassword } from "@/features/shared/hooks/useShowPassword";
import { showErrorToast, showSuccessToast } from "@/features/shared/lib/toast";
import { Button } from "@/features/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/ui/dialog";
import { Input } from "@/features/shared/ui/input";

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
  const fieldIdPrefix = `${role.toLowerCase()}CreateUser`;
  const { IsEyeOpen: isPasswordVisible, setIsEyeOpen: setIsPasswordVisible } =
    useShowPassword();
  const {
    IsEyeOpen: isConfirmPasswordVisible,
    setIsEyeOpen: setIsConfirmPasswordVisible,
  } = useShowPassword();
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
      setIsPasswordVisible(false);
      setIsConfirmPasswordVisible(false);
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`${fieldIdPrefix}FirstName`}
                className="text-sm font-medium text-slate-700"
              >
                First name
              </label>
              <Input
                id={`${fieldIdPrefix}FirstName`}
                placeholder="First name"
                {...register("firstName")}
                disabled={isSubmitting}
                required
              />
              {errors.firstName ? (
                <p className="text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${fieldIdPrefix}LastName`}
                className="text-sm font-medium text-slate-700"
              >
                Last name
              </label>
              <Input
                id={`${fieldIdPrefix}LastName`}
                placeholder="Last name"
                {...register("lastName")}
                disabled={isSubmitting}
                required
              />
              {errors.lastName ? (
                <p className="text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${fieldIdPrefix}UniID`}
                className="text-sm font-medium text-slate-700"
              >
                University ID
              </label>
              <Input
                id={`${fieldIdPrefix}UniID`}
                placeholder={
                  role === "STUDENT" ? "TGUSTU202601" : "TGUTCH202601"
                }
                {...register("uniID")}
                disabled={isSubmitting}
                required
              />
              {errors.uniID ? (
                <p className="text-sm text-red-600">{errors.uniID.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${fieldIdPrefix}Email`}
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <Input
                id={`${fieldIdPrefix}Email`}
                type="email"
                placeholder="teacher@classroom.test"
                {...register("email")}
                disabled={isSubmitting}
                required
              />
              {errors.email ? (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${fieldIdPrefix}Password`}
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id={`${fieldIdPrefix}Password`}
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Set an initial password"
                  className="pr-10 pl-10"
                  {...register("password")}
                  disabled={isSubmitting}
                  required
                />
                {isPasswordVisible ? (
                  <Eye
                    size={18}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-600"
                    onClick={() => setIsPasswordVisible(false)}
                  />
                ) : (
                  <EyeOff
                    size={18}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-600"
                    onClick={() => setIsPasswordVisible(true)}
                  />
                )}
              </div>
              {errors.password ? (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${fieldIdPrefix}ConfirmPassword`}
                className="text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id={`${fieldIdPrefix}ConfirmPassword`}
                  type={"password"}
                  autoComplete="new-password"
                  placeholder="Repeat the password"
                  className="pr-10 pl-10"
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {errors.confirmPassword ? (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>
          </div>

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

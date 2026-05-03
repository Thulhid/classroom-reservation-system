"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useUpdatePassword } from "@/features/profile/hooks/useUpdatePassword";
import {
  updatePasswordFormSchema,
  type UpdatePasswordFormValues,
} from "@/features/profile/validators/updatePasswordSchema";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";

export default function UpdatePasswordForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { isUpdating, updatePassword } = useUpdatePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const isMutating = isSubmitting || isUpdating;

  async function onSubmit(data: UpdatePasswordFormValues) {
    setMessage("");
    setError("");

    const result = await updatePassword(data);

    if (!result.success) {
      setError(result.message ?? "Could not update password.");
      return;
    }

    reset();
    setMessage(result.message ?? "Password updated successfully.");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 w-full max-w-xl space-y-5"
    >
      <h2 className="text-xl font-semibold text-slate-800">Update Password</h2>

      <div className="space-y-2">
        <label htmlFor="currentPassword" className="text-sm text-slate-700">
          Current Password
        </label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
          disabled={isMutating}
        />
        {errors.currentPassword ? (
          <p className="text-sm text-red-600">
            {errors.currentPassword.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm text-slate-700">
          New Password
        </label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
          disabled={isMutating}
        />
        {errors.newPassword ? (
          <p className="text-sm text-red-600">{errors.newPassword.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmNewPassword" className="text-sm text-slate-700">
          Confirm New Password
        </label>
        <Input
          id="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmNewPassword")}
          disabled={isMutating}
        />
        {errors.confirmNewPassword ? (
          <p className="text-sm text-red-600">
            {errors.confirmNewPassword.message}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-500">{error}</p>
      ) : null}
      {message ? (
        <p className="text-sm font-medium text-emerald-600">{message}</p>
      ) : null}

      <Button buttonType="submit" disabled={isMutating} className="mt-5">
        {isMutating ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}

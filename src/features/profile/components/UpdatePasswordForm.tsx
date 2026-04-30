"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";

export default function UpdatePasswordForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/profile/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmNewPassword: formData.get("confirmNewPassword"),
      }),
    });

    const result = (await response.json()) as { message?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.message ?? "Could not update password.");
      return;
    }

    event.currentTarget.reset();
    setMessage(result.message ?? "Password updated successfully.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Update Password
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Keep your classroom booking account secure.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="currentPassword" className="text-sm text-slate-700">
          Current Password
        </label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm text-slate-700">
          New Password
        </label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmNewPassword" className="text-sm text-slate-700">
          Confirm New Password
        </label>
        <Input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
      {message ? (
        <p className="text-sm font-medium text-emerald-600">{message}</p>
      ) : null}

      <Button buttonType="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}

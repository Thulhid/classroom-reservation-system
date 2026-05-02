"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Send,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { useShowPassword } from "@/features/shared/hooks/useShowPassword";
import { showErrorToast, showSuccessToast } from "@/features/shared/lib/toast";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import { useSendResetPIN } from "../hooks/useSendResetPIN";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [universityId, setUniversityId] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const { isSending, sendResetPIN } = useSendResetPIN();
  const { isResetting, resetPassword } = useResetPassword();
  const {
    IsEyeOpen: isNewPasswordEyeOpen,
    setIsEyeOpen: setIsNewPasswordEyeOpen,
  } = useShowPassword();

  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await sendResetPIN(universityId);

    if (!result.success) {
      showErrorToast("Could not start password reset.");
      return;
    }

    setChallengeToken(result.challengeToken);
    setStep("reset");
    showSuccessToast(result.message);
  }

  async function handleResetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = await resetPassword({
      challengeToken,
      pin: String(formData.get("pin") ?? ""),
      newPassword: String(formData.get("newPassword") ?? ""),
      confirmNewPassword: String(formData.get("confirmNewPassword") ?? ""),
    });

    if (!result.success) {
      showErrorToast(result.message);
      return;
    }

    window.sessionStorage.setItem("showPasswordProfileNotice", "true");
    showSuccessToast(result.message);
    router.push("/login");
  }

  return (
    <div className="mx-auto my-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white px-5 py-8 shadow-xl sm:rounded-3xl sm:px-10 sm:py-10 sm:shadow-2xl">
      <div className="flex justify-center">
        <KeyRound strokeWidth={2} size={40} className="text-sky-500" />
      </div>
      <div className="mt-5 text-center">
        <h1 className="text-3xl font-semibold text-slate-700 sm:text-4xl">
          Reset password
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          {step === "request"
            ? "We will send a secure PIN to your registered email"
            : "Enter your email PIN and choose a new password"}
        </p>
      </div>

      {step === "request" ? (
        <form onSubmit={handleRequestSubmit} className="mt-8 space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="universityId">University ID</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="universityId"
                type="text"
                value={universityId}
                onChange={(event) => setUniversityId(event.target.value)}
                placeholder="Enter University ID"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            variant="primary"
            buttonType="submit"
            disabled={isSending}
            className="w-full"
          >
            <Send size={16} />
            {isSending ? "Sending..." : "Send PIN"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="mt-8 space-y-5">
          <div className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            A 6 digit PIN was sent to the email registered for{" "}
            <span className="font-semibold break-all">{universityId}</span>. It
            expires in 10 minutes.
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pin">Email PIN</label>
            <Input
              id="pin"
              name="pin"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword">New Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="newPassword"
                name="newPassword"
                type={isNewPasswordEyeOpen ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter new password"
                className="pr-10 pl-10"
                required
              />
              {isNewPasswordEyeOpen ? (
                <Eye
                  size={18}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-600"
                  onClick={() => setIsNewPasswordEyeOpen(false)}
                />
              ) : (
                <EyeOff
                  size={18}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-600"
                  onClick={() => setIsNewPasswordEyeOpen(true)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmNewPassword">Confirm Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm new password"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            variant="primary"
            buttonType="submit"
            disabled={isResetting}
            className="w-full"
          >
            {isResetting ? "Resetting..." : "Reset Password"}
          </Button>

          <button
            type="button"
            className="w-full cursor-pointer text-sm font-medium text-slate-600 hover:text-sky-700 hover:underline"
            onClick={() => setStep("request")}
          >
            Use a different University ID
          </button>
        </form>
      )}

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-700 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>
    </div>
  );
}

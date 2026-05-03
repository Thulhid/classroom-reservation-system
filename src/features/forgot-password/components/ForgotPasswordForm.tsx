"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useShowPassword } from "@/features/shared/hooks/useShowPassword";
import { showErrorToast, showSuccessToast } from "@/features/shared/lib/toast";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import { useSendResetPIN } from "../hooks/useSendResetPIN";
import { useResetPassword } from "../hooks/useResetPassword";
import {
  forgotPasswordRequestSchema,
  forgotPasswordResetSchema,
  type ForgotPasswordRequestPayload,
  type ForgotPasswordResetPayload,
} from "../validators/forgotPasswordSchema";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [universityId, setUniversityId] = useState("");
  const { isSending, sendResetPIN } = useSendResetPIN();
  const { isResetting, resetPassword } = useResetPassword();
  const {
    IsEyeOpen: isNewPasswordEyeOpen,
    setIsEyeOpen: setIsNewPasswordEyeOpen,
  } = useShowPassword();
  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    formState: { errors: requestErrors, isSubmitting: isRequestSubmitting },
  } = useForm<ForgotPasswordRequestPayload>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      universityId: "",
    },
  });
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    reset: resetResetForm,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
  } = useForm<ForgotPasswordResetPayload>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: {
      challengeToken: "",
      pin: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const isRequestPending = isRequestSubmitting || isSending;
  const isResetPending = isResetSubmitting || isResetting;

  async function onRequestSubmit(data: ForgotPasswordRequestPayload) {
    const result = await sendResetPIN(data.universityId);

    if (!result.success) {
      showErrorToast("Could not start password reset.");
      return;
    }

    setUniversityId(data.universityId);
    resetResetForm({
      challengeToken: result.challengeToken,
      pin: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setStep("reset");
    showSuccessToast(result.message);
  }

  async function onResetSubmit(data: ForgotPasswordResetPayload) {
    const result = await resetPassword(data);

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
        <form
          onSubmit={handleRequestSubmit(onRequestSubmit)}
          className="mt-8 space-y-5"
        >
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
                placeholder="Enter University ID"
                className="pl-10"
                {...registerRequest("universityId")}
                disabled={isRequestPending}
              />
            </div>
            {requestErrors.universityId ? (
              <p className="text-sm text-red-600">
                {requestErrors.universityId.message}
              </p>
            ) : null}
          </div>

          <Button
            variant="primary"
            buttonType="submit"
            disabled={isRequestPending}
            className="w-full"
          >
            <Send size={16} />
            {isRequestPending ? "Sending..." : "Send PIN"}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleResetSubmit(onResetSubmit)}
          className="mt-8 space-y-5"
        >
          <input type="hidden" {...registerReset("challengeToken")} />

          <div className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            A 6 digit PIN was sent to the email registered for{" "}
            <span className="font-semibold break-all">{universityId}</span>. It
            expires in 10 minutes.
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pin">Email PIN</label>
            <Input
              id="pin"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              {...registerReset("pin")}
              disabled={isResetPending}
            />
            {resetErrors.pin ? (
              <p className="text-sm text-red-600">{resetErrors.pin.message}</p>
            ) : null}
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
                type={isNewPasswordEyeOpen ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter new password"
                className="pr-10 pl-10"
                {...registerReset("newPassword")}
                disabled={isResetPending}
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
            {resetErrors.newPassword ? (
              <p className="text-sm text-red-600">
                {resetErrors.newPassword.message}
              </p>
            ) : null}
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
                type="password"
                autoComplete="new-password"
                placeholder="Confirm new password"
                className="pl-10"
                {...registerReset("confirmNewPassword")}
                disabled={isResetPending}
              />
            </div>
            {resetErrors.confirmNewPassword ? (
              <p className="text-sm text-red-600">
                {resetErrors.confirmNewPassword.message}
              </p>
            ) : null}
          </div>

          <Button
            variant="primary"
            buttonType="submit"
            disabled={isResetPending}
            className="w-full"
          >
            {isResetPending ? "Resetting..." : "Reset Password"}
          </Button>

          <button
            type="button"
            className="w-full cursor-pointer text-sm font-medium text-slate-600 hover:text-sky-700 hover:underline"
            disabled={isResetPending}
            onClick={() => {
              setStep("request");
              setUniversityId("");
              resetResetForm({
                challengeToken: "",
                pin: "",
                newPassword: "",
                confirmNewPassword: "",
              });
            }}
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

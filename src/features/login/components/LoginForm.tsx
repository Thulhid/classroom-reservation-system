"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";

import { useShowPassword } from "@/features/shared/hooks/useShowPassword";
import { showErrorToast } from "@/features/shared/lib/toast";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";

import {
  loginFormSchema,
  type LoginFormValues,
} from "../validators/loginFormSchema";

export default function LoginForm() {
  const router = useRouter();
  const { IsEyeOpen, setIsEyeOpen } = useShowPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      universityId: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    const result = await signIn("credentials", {
      universityId: data.universityId,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      showErrorToast("Invalid university ID or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto my-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white px-5 py-8 shadow-xl sm:rounded-3xl sm:px-10 sm:py-10 sm:shadow-2xl"
    >
      <div className="flex justify-center">
        <Lock strokeWidth={2} size={40} className="text-sky-500" />
      </div>
      <div className="flex justify-center">
        <div className="mt-5 flex flex-col text-center">
          <h1 className="text-3xl font-semibold text-slate-700 sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Login to your account to continue
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:mt-10">
        <div className="flex flex-col gap-2">
          <label htmlFor="universityId">University ID</label>
          <div className="relative">
            <User
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="universityId"
              type="text"
              placeholder="Enter University ID"
              className="pl-10"
              {...register("universityId")}
            />
          </div>
          {errors.universityId ? (
            <p className="text-sm text-red-600">
              {errors.universityId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="password"
              type={IsEyeOpen ? "text" : "password"}
              placeholder="Enter Password"
              className="pr-10 pl-10"
              {...register("password")}
            />
            {IsEyeOpen ? (
              <Eye
                size={18}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-600"
                onClick={() => setIsEyeOpen(false)}
              />
            ) : (
              <EyeOff
                size={18}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-600"
                onClick={() => setIsEyeOpen(true)}
              />
            )}
          </div>
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          ) : null}
          <span className="mt-1 cursor-pointer place-self-end text-sm text-slate-700 hover:underline">
            Forgot Password?
          </span>
        </div>

        <div className="mt-4 flex sm:mt-6 sm:justify-center">
          <Button
            variant="primary"
            buttonType="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </form>
  );
}

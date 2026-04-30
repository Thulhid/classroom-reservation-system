"use client";

import { Button } from "@/features/shared/ui/button";
import Link from "next/link";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useShowPassword } from "@/features/shared/hooks/useShowPassword";
import { Input } from "@/features/shared/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showErrorToast } from "@/features/shared/lib/toast";

type LoginFormValues = {
  universityId: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const { IsEyeOpen, setIsEyeOpen } = useShowPassword();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      universityId: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      universityId: data.universityId,
      password: data.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      showErrorToast("Invalid university ID or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <div className="min-h-70 bg-[url(/login/login-bg.jpg)] bg-cover bg-center lg:min-h-screen lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center bg-sky-700/60 px-8 py-12">
          <div className="w-full max-w-md">
            <h1 className="mb-10 text-center text-3xl font-semibold text-slate-50">
              Smart <strong className="text-sky-400">Classroom</strong> Booking
              System
            </h1>
            <p className="text-slate-200">
              reserve classroom easily, manage schedules efficiently, and make
              the most of your campus resources.
            </p>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-auto w-full max-w-md rounded-3xl bg-white px-6 py-10 shadow-2xl sm:px-10"
      >
        <div className="flex justify-center">
          <Lock strokeWidth={2} size={40} className="text-sky-500" />
        </div>
        <div className="flex justify-center">
          <div className="mt-5 flex flex-col text-center">
            <h1 className="text-4xl font-semibold text-slate-700">
              Welcome back
            </h1>
            <p className="text-slate-500">Login to your account to continue</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="universityId">University ID</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="universityId"
                type="text"
                placeholder="Enter University ID"
                className="pl-10"
                {...register("universityId")}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="password"
                type={IsEyeOpen ? "text" : "password"}
                placeholder="Enter Password"
                className="pl-10 pr-10"
                {...register("password")}
              />
              {IsEyeOpen ? (
                <Eye
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 cursor-pointer"
                  onClick={() => setIsEyeOpen(false)}
                />
              ) : (
                <EyeOff
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 cursor-pointer"
                  onClick={() => setIsEyeOpen(true)}
                />
              )}
            </div>
            <span className="mt-1 place-self-end cursor-pointer text-sm text-slate-700 hover:underline">
              Forgot Password?
            </span>
          </div>
          <div className="mt-6 m-auto">
            <Button
              variant="primary"
              buttonType="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-sky-600 transition-colors hover:text-sky-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

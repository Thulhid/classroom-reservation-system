"use client";

import { Button } from "@/features/shared/ui/button";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, UserRoundCog } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useShowPassword } from "@/features/shared/hooks/useShowPassword";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/ui/select";
import { Input } from "@/features/shared/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignUpFormValues = {
  firstName: string;
  lastName: string;
  universityId: string;
  universityEmail: string;
  password: string;
  confirmPassword: string;
  role: "student" | "teacher";
};

export default function SignUpPage() {
  const router = useRouter();
  const { IsEyeOpen, setIsEyeOpen } = useShowPassword();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, register, handleSubmit } = useForm<SignUpFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      universityId: "",
      universityEmail: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setErrorMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = (await response.json()) as { message?: string };
      setIsSubmitting(false);
      setErrorMessage(result.message ?? "Could not create your account.");
      return;
    }

    const signInResult = await signIn("credentials", {
      universityId: data.universityId,
      password: data.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (signInResult?.error) {
      router.push("/login");
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
              Join the <strong className="text-sky-400">Smart Classroom</strong>{" "}
              Booking System
            </h1>
            <p className="text-slate-200">
              Create your account to manage reservations, stay organized, and
              access campus classrooms with less friction.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-auto w-full max-w-2xl rounded-3xl bg-white px-6 py-10 shadow-2xl sm:px-10"
      >
        <div className="flex justify-center">
          <Lock strokeWidth={2} size={40} className="text-sky-500" />
        </div>
        <div className="mt-5 text-center">
          <h1 className="text-4xl font-semibold text-slate-700">
            Create account
          </h1>
          <p className="text-slate-500">
            Sign up as a student or teacher to get started
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName">First Name</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                className="pl-10"
                {...register("firstName")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName">Last Name</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                className="pl-10"
                {...register("lastName")}
              />
            </div>
          </div>

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
                placeholder="Enter university ID"
                className="pl-10"
                {...register("universityId")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="universityEmail">University Email</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="universityEmail"
                type="email"
                placeholder="Enter university email"
                className="pl-10"
                {...register("universityEmail")}
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
                placeholder="Create password"
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
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="pl-10"
                {...register("confirmPassword")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role">Role</label>
            <div className="relative">
              <UserRoundCog
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
              />
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role" className="pl-10">
                      <SelectValue placeholder="Select account role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Button variant="primary" buttonType="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
          {errorMessage ? (
            <p className="text-center text-sm font-medium text-red-500">
              {errorMessage}
            </p>
          ) : null}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-sky-600 transition-colors hover:text-sky-700"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

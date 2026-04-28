"use client";

import Button from "@/features/shared/components/Button";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
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
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const { register, handleSubmit } = useForm<SignUpFormValues>({
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

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
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
              <input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                className="input pl-10 placeholder:text-slate-500"
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
              <input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                className="input pl-10 placeholder:text-slate-500"
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
              <input
                id="universityId"
                type="text"
                placeholder="Enter university ID"
                className="input pl-10 placeholder:text-slate-500"
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
              <input
                id="universityEmail"
                type="email"
                placeholder="Enter university email"
                className="input pl-10 placeholder:text-slate-500"
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
              <input
                id="password"
                type={isEyeOpen ? "text" : "password"}
                placeholder="Create password"
                className="input pl-10 placeholder:text-slate-500"
                {...register("password")}
              />
              {isEyeOpen ? (
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
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="input pl-10 placeholder:text-slate-500"
                {...register("confirmPassword")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition-colors hover:border-sky-300">
                <input
                  type="radio"
                  value="student"
                  className="h-4 w-4 accent-sky-500"
                  {...register("role")}
                />
                <span className="font-medium text-slate-700">Student</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition-colors hover:border-sky-300">
                <input
                  type="radio"
                  value="teacher"
                  className="h-4 w-4 accent-sky-500"
                  {...register("role")}
                />
                <span className="font-medium text-slate-700">Teacher</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Button variant="primary" buttonType="submit">
            Sign Up
          </Button>
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

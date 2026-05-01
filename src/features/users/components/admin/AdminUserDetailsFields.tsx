import { IdCard, UserRound } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/features/shared/ui/input";

type AdminUserDetailsFieldsProps = {
  disabled: boolean;
  fields: {
    firstName: UseFormRegisterReturn;
    lastName: UseFormRegisterReturn;
    uniID: UseFormRegisterReturn;
    email: UseFormRegisterReturn;
  };
  errors: {
    firstName?: string;
    lastName?: string;
    uniID?: string;
    email?: string;
  };
};

export default function AdminUserDetailsFields({
  disabled,
  fields,
  errors,
}: AdminUserDetailsFieldsProps) {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <UserRound className="size-4 text-sky-600" />
          Profile details
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-slate-700"
            >
              First name
            </label>
            <Input
              id="firstName"
              placeholder="First name"
              {...fields.firstName}
              disabled={disabled}
              required
            />
            {errors.firstName ? (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-slate-700"
            >
              Last name
            </label>
            <Input
              id="lastName"
              placeholder="Last name"
              {...fields.lastName}
              disabled={disabled}
              required
            />
            {errors.lastName ? (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IdCard className="size-4 text-sky-600" />
          Account identity
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="uniID"
              className="text-sm font-medium text-slate-700"
            >
              University ID
            </label>
            <Input
              id="uniID"
              placeholder="TCH001"
              {...fields.uniID}
              disabled={disabled}
              required
            />
            {errors.uniID ? (
              <p className="text-sm text-red-600">{errors.uniID}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="teacher@classroom.test"
              {...fields.email}
              disabled={disabled}
              required
            />
            {errors.email ? (
              <p className="text-sm text-red-600">{errors.email}</p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

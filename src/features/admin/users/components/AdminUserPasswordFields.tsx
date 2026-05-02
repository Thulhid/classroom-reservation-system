import { KeyRound } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/features/shared/ui/input";

type AdminUserPasswordFieldsProps = {
  disabled: boolean;
  fields: {
    password: UseFormRegisterReturn;
    confirmPassword: UseFormRegisterReturn;
  };
  errors: {
    password?: string;
    confirmPassword?: string;
  };
};

export default function AdminUserPasswordFields({
  disabled,
  fields,
  errors,
}: AdminUserPasswordFieldsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <KeyRound className="size-4 text-sky-600" />
        Initial password
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Set an initial password"
            {...fields.password}
            disabled={disabled}
            required
          />
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat the password"
            {...fields.confirmPassword}
            disabled={disabled}
            required
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

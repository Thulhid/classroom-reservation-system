"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  PencilLine,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import type { AdminManagedUser } from "@/features/users/lib/adminUsers";
import {
  getManagedUserLabel,
  getManagedUsersRoute,
} from "@/features/users/lib/adminUsers";
import AdminUserAvatar from "@/features/users/components/admin/AdminUserAvatar";
import AdminUserDetailsFields from "@/features/users/components/admin/AdminUserDetailsFields";
import { updateAdminUser } from "@/features/users/services/apiAdminUsers";
import {
  adminUserFormSchema,
  type AdminUserFormValues,
} from "@/features/users/validators/adminUserFormSchema";
import { showErrorToast, showSuccessToast } from "@/features/shared/lib/toast";
import { Button } from "@/features/shared/ui/button";

type AdminUserFormProps = {
  user: AdminManagedUser;
};

export default function AdminUserForm({ user }: AdminUserFormProps) {
  const router = useRouter();
  const roleLabel = getManagedUserLabel(user.role);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      uniID: user.uniID,
      email: user.email,
    },
  });

  async function onSubmit(data: AdminUserFormValues) {
    try {
      const result = await updateAdminUser(user.id, data);

      if (!result.success) {
        showErrorToast(result.message ?? "Could not save account details.");
        return;
      }

      showSuccessToast(result.message);
      router.push(getManagedUsersRoute(user.role));
      router.refresh();
    } catch {
      showErrorToast("Could not save account details.");
    }
  }

  function onInvalid() {
    showErrorToast("Please review the account details.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <AdminUserAvatar
              firstName={user.firstName}
              lastName={user.lastName}
              image={user.image}
              size="lg"
            />

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                <ShieldCheck className="size-4 text-sky-600" />
                {roleLabel} account
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-800">
                {user.firstName} {user.lastName}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Password changes are intentionally excluded from this admin
                screen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdminUserDetailsFields
        disabled={isSubmitting}
        fields={{
          firstName: register("firstName"),
          lastName: register("lastName"),
          uniID: register("uniID"),
          email: register("email"),
        }}
        errors={{
          firstName: errors.firstName?.message,
          lastName: errors.lastName?.message,
          uniID: errors.uniID?.message,
          email: errors.email?.message,
        }}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          link={getManagedUsersRoute(user.role)}
          variant="outline"
          className="justify-center border-slate-300 px-5 py-2 text-sm text-slate-700"
        >
          Cancel
        </Button>
        <Button
          buttonType="submit"
          disabled={isSubmitting}
          className="gap-2 px-5 py-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <PencilLine className="size-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

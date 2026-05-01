import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { AdminManagedUser } from "@/features/users/lib/adminUsers";
import {
  getManagedUserLabel,
  getManagedUsersRoute,
} from "@/features/users/lib/adminUsers";
import AdminUserForm from "@/features/users/components/admin/AdminUserForm";

type AdminUserEditorPageProps = {
  user: AdminManagedUser;
};

export default function AdminUserEditorPage({
  user,
}: AdminUserEditorPageProps) {
  const roleLabel = getManagedUserLabel(user.role);

  return (
    <section className="space-y-6">
      <Link
        href={getManagedUsersRoute(user.role)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
      >
        <ArrowLeft className="size-4" />
        Back to {roleLabel.toLowerCase()}s
      </Link>

      <AdminUserForm user={user} />
    </section>
  );
}

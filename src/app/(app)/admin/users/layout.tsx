import { requireAdminUser } from "@/features/shared/lib/adminAccess";
import AdminUsersLayoutShell from "@/features/users/components/admin/AdminUsersLayoutShell";

type AdminUsersLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminUsersLayout({
  children,
}: AdminUsersLayoutProps) {
  await requireAdminUser();

  return <AdminUsersLayoutShell>{children}</AdminUsersLayoutShell>;
}

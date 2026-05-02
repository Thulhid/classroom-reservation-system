import { requireAdminUser } from "@/features/admin/lib/adminAccess";
import AdminUsersLayoutShell from "@/features/admin/users/components/AdminUsersLayoutShell";

type AdminUsersLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminUsersLayout({
  children,
}: AdminUsersLayoutProps) {
  await requireAdminUser();

  return <AdminUsersLayoutShell>{children}</AdminUsersLayoutShell>;
}

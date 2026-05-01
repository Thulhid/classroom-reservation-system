import { notFound } from "next/navigation";

import AdminUserEditorPage from "@/features/users/components/admin/AdminUserEditorPage";
import { getAdminUserById } from "@/features/users/services/adminUserService";

type AdminEditTeacherPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function AdminEditTeacherPage({
  params,
}: AdminEditTeacherPageProps) {
  const { userId } = await params;
  const user = await getAdminUserById(userId, "TEACHER");

  if (!user) {
    notFound();
  }

  return <AdminUserEditorPage user={user} />;
}

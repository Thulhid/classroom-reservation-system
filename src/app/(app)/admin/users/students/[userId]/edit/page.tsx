import { notFound } from "next/navigation";

import AdminUserEditorPage from "@/features/users/components/admin/AdminUserEditorPage";
import { getAdminUserById } from "@/features/users/services/adminUserService";

type AdminEditStudentPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function AdminEditStudentPage({
  params,
}: AdminEditStudentPageProps) {
  const { userId } = await params;
  const user = await getAdminUserById(userId, "STUDENT");

  if (!user) {
    notFound();
  }

  return <AdminUserEditorPage user={user} />;
}

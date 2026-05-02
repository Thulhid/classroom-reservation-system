import AdminUsersPanel from "@/features/admin/users/components/AdminUsersPanel";
import { getAdminUsers } from "@/features/admin/users/services/adminUserService";

export default async function AdminStudentsPage() {
  const users = await getAdminUsers("STUDENT");

  return <AdminUsersPanel role="STUDENT" users={users} />;
}

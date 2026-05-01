import AdminUsersPanel from "@/features/users/components/admin/AdminUsersPanel";
import { getAdminUsers } from "@/features/users/services/adminUserService";

export default async function AdminStudentsPage() {
  const users = await getAdminUsers("STUDENT");

  return <AdminUsersPanel role="STUDENT" users={users} />;
}

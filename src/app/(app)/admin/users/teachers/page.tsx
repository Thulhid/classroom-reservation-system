import AdminUsersPanel from "@/features/admin/users/components/AdminUsersPanel";
import { getAdminUsers } from "@/features/admin/users/services/adminUserService";

export default async function AdminTeachersPage() {
  const users = await getAdminUsers("TEACHER");

  return <AdminUsersPanel role="TEACHER" users={users} />;
}

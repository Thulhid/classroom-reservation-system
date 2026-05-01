import AdminUsersPanel from "@/features/users/components/admin/AdminUsersPanel";
import { getAdminUsers } from "@/features/users/services/adminUserService";

export default async function AdminTeachersPage() {
  const users = await getAdminUsers("TEACHER");

  return <AdminUsersPanel role="TEACHER" users={users} />;
}

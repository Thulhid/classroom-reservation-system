import type { AdminManagedUser } from "@/features/users/lib/adminUsers";
import AdminUserAvatar from "@/features/users/components/admin/AdminUserAvatar";
import AdminUserRowActions from "@/features/users/components/admin/AdminUserRowActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/ui/table";

type AdminUsersTableProps = {
  users: AdminManagedUser[];
};

function getUserSupportingText(user: AdminManagedUser) {
  if (user.role === "TEACHER") {
    return user.bookingCount > 0
      ? `${user.bookingCount} booking${user.bookingCount === 1 ? "" : "s"} on record`
      : "No bookings on record";
  }

  return "Student account";
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>User</TableHead>
          <TableHead>University ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="w-16 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex min-w-0 items-center gap-3">
                <AdminUserAvatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  image={user.image}
                />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {getUserSupportingText(user)}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium tracking-wide text-slate-700 uppercase">
                {user.uniID}
              </span>
            </TableCell>

            <TableCell>
              <p className="max-w-xs truncate text-sm text-slate-700">
                {user.email}
              </p>
            </TableCell>

            <TableCell className="text-right">
              <AdminUserRowActions user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

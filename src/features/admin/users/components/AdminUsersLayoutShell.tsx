import AdminUsersTabs from "@/features/admin/users/components/AdminUsersTabs";

type AdminUsersLayoutShellProps = {
  children: React.ReactNode;
};

export default function AdminUsersLayoutShell({
  children,
}: AdminUsersLayoutShellProps) {
  return (
    <>
      <AdminUsersTabs />

      {children}
    </>
  );
}

import AdminUsersTabs from "@/features/users/components/admin/AdminUsersTabs";

type AdminUsersLayoutShellProps = {
  children: React.ReactNode;
};

export default function AdminUsersLayoutShell({
  children,
}: AdminUsersLayoutShellProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <AdminUsersTabs />

        {children}
      </section>
    </main>
  );
}

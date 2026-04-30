import UpdatePasswordForm from "./UpdatePasswordForm";

export default function UpdatePassword({
  uniID,
  roleLabel,
}: {
  uniID: string;
  roleLabel: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">University ID</p>
          <p className="mt-1 font-semibold text-slate-800">{uniID}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Role</p>
          <p className="mt-1 font-semibold text-slate-800">{roleLabel}</p>
        </div>
      </div>

      <UpdatePasswordForm />
    </section>
  );
}

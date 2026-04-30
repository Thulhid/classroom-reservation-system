import { redirect } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";

import { auth, signOut } from "@/auth";
import { Button } from "@/features/shared/ui/button";
import { prisma } from "@/lib/prisma";
import ProfilePhotoUploader from "@/features/profile/components/ProfilePhotoUploader";
import UpdatePasswordForm from "@/features/profile/components/UpdatePasswordForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      image: true,
    },
  });
  const initials = `${user.firstName.at(0) ?? ""}${user.lastName.at(0) ?? ""}`;
  const fullName = `${user.firstName} ${user.lastName}`;
  const roleLabel = user.role === "TEACHER" ? "Teacher" : "Student";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">Account Settings</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-800 sm:text-4xl">
              My Profile
            </h1>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              buttonType="submit"
              className="w-full gap-2 bg-slate-800 hover:bg-slate-900 sm:w-auto"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </form>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <aside className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex flex-col items-center text-center">
              <ProfilePhotoUploader
                image={dbUser?.image ?? user.image}
                initials={initials}
                name={fullName}
              />

              <h2 className="mt-5 text-2xl font-semibold text-slate-800">
                {fullName}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-500">
                {user.email}
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                <ShieldCheck size={16} className="text-sky-600" />
                {roleLabel}
              </div>
            </div>
          </aside>

          <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">University ID</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {user.uniID}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-1 font-semibold text-slate-800">{roleLabel}</p>
              </div>
            </div>

            <UpdatePasswordForm />
          </section>
        </div>
      </section>
    </main>
  );
}

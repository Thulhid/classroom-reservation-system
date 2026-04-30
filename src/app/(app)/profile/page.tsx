import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Button } from "@/features/shared/ui/button";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import Spinner from "@/features/shared/components/Spinner";
import ProfileDetails from "@/features/profile/components/ProfileDetails";
import UpdatePassword from "@/features/profile/components/UpdatePassword";

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
            <Button buttonType="submit" variant={"danger"}>
              <LogOut size={16} />
              Sign Out
            </Button>
          </form>
        </div>
        <Suspense fallback={<Spinner className="mx-auto mt-15" size={50} />}>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <ProfileDetails
              email={user.email}
              dbUserImage={dbUser?.image}
              userImage={user.image}
              initials={initials}
              fullName={fullName}
              roleLabel={roleLabel}
            />
            <UpdatePassword uniID={user.uniID} roleLabel={roleLabel} />
          </div>
        </Suspense>
      </section>
    </main>
  );
}

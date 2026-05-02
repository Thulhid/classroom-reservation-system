import { auth } from "@/auth";
import { isAdminUser } from "@/features/admin/lib/adminAccess";
import Navbar from "@/features/shared/components/NavBar";
import Providers from "@/features/shared/components/Provider";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      image: true,
    },
  });
  const user = {
    ...session.user,
    image: dbUser?.image ?? session.user.image,
  };
  return (
    <>
      <Navbar user={user} isAdmin={isAdminUser(user)} />
      <Providers>
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-[1440px] space-y-6">
            {children}
          </div>
        </main>
      </Providers>
    </>
  );
}

import { auth } from "@/auth";
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
      <Navbar user={user} />
      <Providers>{children}</Providers>
    </>
  );
}

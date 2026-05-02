import "server-only";

import type { Session } from "next-auth";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

type AdminUser = Pick<Session["user"], "role"> | null | undefined;

export function isAdminUser(user: AdminUser) {
  return user?.role === "ADMIN";
}

export async function requireAdminUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!isAdminUser(session.user)) {
    redirect("/dashboard");
  }

  return session.user;
}

export async function getAdminApiGuard(
  forbiddenMessage = "Only admins can access this route.",
) {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false as const,
      response: Response.json({ message: "Unauthorized." }, { status: 401 }),
    };
  }

  if (!isAdminUser(session.user)) {
    return {
      ok: false as const,
      response: Response.json({ message: forbiddenMessage }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
    user: session.user,
  };
}

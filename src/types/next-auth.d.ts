import type { DefaultSession } from "next-auth";

type UserRole = "ADMIN" | "STUDENT" | "TEACHER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      uniID: string;
      role: UserRole;
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }

  interface User {
    uniID: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    uniID: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    image?: string | null;
  }
}

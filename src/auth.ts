import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

type SessionUpdateData = {
  image?: unknown;
};

function getUpdatedImage(session: unknown) {
  if (!session || typeof session !== "object" || !("image" in session)) {
    return undefined;
  }

  const image = (session as SessionUpdateData).image;

  return typeof image === "string" ? image.trim() : undefined;
}

function getUserProfile(user: {
  role: Role;
  admin: {
    firstName: string;
    lastName: string;
  } | null;
  student: {
    firstName: string;
    lastName: string;
  } | null;
  teacher: {
    firstName: string;
    lastName: string;
  } | null;
}) {
  switch (user.role) {
    case Role.ADMIN:
      return user.admin;
    case Role.TEACHER:
      return user.teacher;
    default:
      return user.student;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        universityId: { label: "University ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const universityId =
          typeof credentials?.universityId === "string"
            ? credentials.universityId.trim()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!universityId || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            uniID: universityId,
          },
          include: {
            admin: true,
            student: true,
            teacher: true,
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          return null;
        }

        const profile = getUserProfile(user);
        const firstName = profile?.firstName ?? "";
        const lastName = profile?.lastName ?? "";

        return {
          id: user.id,
          email: user.email,
          image: user.image,
          name: `${firstName} ${lastName}`.trim() || user.uniID,
          uniID: user.uniID,
          role: user.role,
          firstName,
          lastName,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.uniID = user.uniID;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
      }

      if (trigger === "update") {
        const image = getUpdatedImage(session);

        if (image !== undefined) {
          token.image = image || null;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (
        session.user &&
        typeof token.id === "string" &&
        typeof token.uniID === "string" &&
        typeof token.firstName === "string" &&
        typeof token.lastName === "string" &&
        (token.role === "ADMIN" ||
          token.role === "STUDENT" ||
          token.role === "TEACHER")
      ) {
        session.user.id = token.id;
        session.user.uniID = token.uniID;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.image =
          typeof token.image === "string" ? token.image : null;
      }

      return session;
    },
  },
});

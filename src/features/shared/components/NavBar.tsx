"use client";

import Link from "next/link";
import { CircleUserRound, GraduationCap } from "lucide-react";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { CldImage } from "next-cloudinary";

type NavbarProps = {
  user: Session["user"];
  isAdmin: boolean;
};

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const pathname = usePathname();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const roomsHref = isAdmin ? "/admin/rooms" : "/rooms";
  const usersHref = "/admin/users";

  function linkClass(path: string) {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);

    return isActive
      ? "text-sky-500"
      : "text-slate-600 hover:text-sky-500";
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="text-sky-500" />
          <span className="text-lg font-semibold text-slate-800">
            SmartClassroom
          </span>
        </Link>

        <div className="order-last flex w-full items-center gap-4 overflow-x-auto text-nowrap md:order-none md:w-auto md:gap-6">
          <Link
            href="/dashboard"
            className={`text-sm ${linkClass("/dashboard")}`}
          >
            Dashboard
          </Link>
          <Link href={roomsHref} className={`text-sm ${linkClass(roomsHref)}`}>
            Rooms
          </Link>
          {isAdmin ? (
            <Link
              href={usersHref}
              className={`text-sm ${linkClass(usersHref)}`}
            >
              Users
            </Link>
          ) : null}
          {user.role === "TEACHER" && (
            <Link
              href="/bookings"
              className={`text-sm ${linkClass("/bookings")}`}
            >
              My Bookings
            </Link>
          )}
        </div>

        <Link
          href="/profile"
          className="flex min-w-0 cursor-pointer items-center gap-3"
        >
          {user.image ? (
            <CldImage
              src={user.image}
              alt={fullName ? `${fullName} profile photo` : "Profile photo"}
              width={30}
              height={30}
              crop={{
                type: "thumb",
                gravity: "face",
              }}
              format="webp"
              quality="auto"
              className="size-[30px] rounded-full object-cover"
            />
          ) : (
            <CircleUserRound size={30} strokeWidth={1} />
          )}
          <span className="max-w-36 truncate text-sm font-medium text-slate-600 sm:max-w-none">
            {user.firstName} {user.lastName}
          </span>
        </Link>
      </nav>
    </header>
  );
}

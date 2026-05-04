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
    const baseClassName =
      "border-b-2 pb-1 text-sm font-medium transition-colors";

    return isActive
      ? `${baseClassName} border-sky-500 text-sky-600`
      : `${baseClassName} border-transparent text-slate-600 hover:border-sky-200 hover:text-sky-500`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <GraduationCap className="shrink-0 text-sky-500" />
          <span className="max-w-44 truncate text-base font-semibold text-slate-800 sm:max-w-none sm:text-lg">
            SmartClassroom
          </span>
        </Link>

        <div className="order-last -mx-1 flex w-full items-center gap-3 overflow-x-auto px-1 pb-1 text-nowrap md:order-none md:mx-0 md:w-auto md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link href={roomsHref} className={linkClass(roomsHref)}>
            Rooms
          </Link>
          {isAdmin ? (
            <Link href={usersHref} className={linkClass(usersHref)}>
              Users
            </Link>
          ) : null}
          {user.role === "TEACHER" && (
            <Link href="/bookings" className={linkClass("/bookings")}>
              My Bookings
            </Link>
          )}
        </div>

        <Link
          href="/profile"
          className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-3"
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
              className="size-[30px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <CircleUserRound size={30} strokeWidth={1} className="shrink-0" />
          )}
          <span className="hidden max-w-40 truncate text-sm font-medium text-slate-600 sm:block lg:max-w-none">
            {user.firstName} {user.lastName}
          </span>
        </Link>
      </nav>
    </header>
  );
}

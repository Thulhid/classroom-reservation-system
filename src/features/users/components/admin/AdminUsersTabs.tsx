"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Presentation } from "lucide-react";

const tabs = [
  {
    href: "/admin/users/students",
    label: "Students",
    icon: GraduationCap,
  },
  {
    href: "/admin/users/teachers",
    label: "Teachers",
    icon: Presentation,
  },
];

export default function AdminUsersTabs() {
  const pathname = usePathname();

  return (
    <div className="w-fit overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={
                isActive
                  ? "inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-sky-500 px-4 py-3 text-sm font-medium text-white shadow-sm"
                  : "inline-flex items-center justify-center gap-2 rounded-[1.25rem] px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-sky-600"
              }
            >
              <Icon className="size-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

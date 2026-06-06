"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconBook,
  IconUsers,
  IconArrowLeft,
  IconShield,
} from "@tabler/icons-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard, exact: true },
  { href: "/admin/books", label: "Books", icon: IconBook, exact: false },
  { href: "/admin/users", label: "Users", icon: IconUsers, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-slate-900 min-h-screen flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#06377a] flex items-center justify-center shrink-0">
            <IconShield size={15} stroke={2} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">Shroff Admin</p>
            <p className="text-[10px] text-slate-500 leading-tight">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#06377a] text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={16} stroke={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="px-3 py-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <IconArrowLeft size={16} stroke={1.75} />
          Back to site
        </Link>
      </div>
    </aside>
  );
}

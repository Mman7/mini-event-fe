"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Store,
} from "lucide-react";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/registrations", label: "Registrations", icon: ClipboardList },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-base-300 bg-base-100 p-4">
      <Link
        href="/admin"
        className="mb-8 flex items-center gap-3 px-3 py-2"
        onClick={onNavigate}
      >
        <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-content">
          <LayoutDashboard size={18} aria-hidden="true" />
        </span>
        <span>
          <strong className="block font-display text-base">Mini Event</strong>
          <span className="text-xs text-base-content/55">Admin console</span>
        </span>
      </Link>
      <nav className="space-y-1" aria-label="Admin navigation">
        {navigation.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`btn w-full justify-start gap-3 ${isActive ? "btn-primary" : "btn-ghost"}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-base-300 pt-4">
        <Link
          href="/"
          className="btn btn-ghost w-full justify-start gap-3"
          onClick={onNavigate}
        >
          <Store size={18} aria-hidden="true" />
          Back to Website
        </Link>
      </div>
    </aside>
  );
}

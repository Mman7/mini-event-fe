"use client";

import { useState } from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AdminGate } from "@/src/components/admin/AdminGate";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { AdminTopbar } from "@/src/components/admin/AdminTopbar";

function pageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.includes("/registrations")) return "Registration Management";
  if (pathname.includes("/events/create")) return "Create Event";
  if (pathname.includes("/events/")) return "Edit Event";
  return "Event Management";
}

function AdminLayoutContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminGate>
      <div className="min-h-screen bg-base-200 lg:flex">
        <div
          className={`fixed inset-0 z-40 bg-neutral/50 lg:hidden ${isSidebarOpen ? "" : "pointer-events-none opacity-0"}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 transition-transform lg:static lg:block ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>
        <div className="min-w-0 flex-1">
          <AdminTopbar
            title={pageTitle(pathname)}
            onMenu={() => setIsSidebarOpen(true)}
          />
          <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGate>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base-200" />}>
      {<AdminLayoutContent>{children}</AdminLayoutContent>}
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import { ClipboardList, LogIn, LogOut } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";

export function AccountMenu() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <span className="skeleton h-8 w-24 rounded-btn" aria-hidden="true" />
    );
  }

  if (!user) {
    return (
      <Link href="/login" className="btn btn-primary btn-sm gap-2">
        <LogIn size={16} aria-hidden="true" />
        Login
      </Link>
    );
  }

  return (
    <div className="dropdown dropdown-end dropdown-hover">
      <button type="button" className="btn btn-ghost btn-sm gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold uppercase text-primary-content">
          {user.name.charAt(0)}
        </span>
        <span className="max-w-32 truncate">{user.name}</span>
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
      >
        <li className="menu-title truncate">{user.email}</li>
        <li>
          <Link href="/registrations">
            <ClipboardList size={16} aria-hidden="true" />
            My registrations
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={async () => {
              await authClient.signOut();
              window.location.replace("/");
            }}
          >
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
}

"use client";

import { Menu } from "lucide-react";
import { AccountMenu } from "@/src/components/layout/AccountMenu";
import { ThemeToggle } from "@/src/components/layout/ThemeToggle";

export function AdminTopbar({
  title,
  onMenu,
}: {
  title: string;
  onMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex  min-h-16 items-center justify-between border-b border-base-300 bg-base-100/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn btn-ghost btn-square lg:hidden"
          onClick={onMenu}
          aria-label="Open admin navigation"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <h1 className="font-display text-xl hidden md:flex font-bold">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}

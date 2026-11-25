import Link from "next/link";
import { AccountMenu } from "@/src/components/layout/AccountMenu";
import { ThemeToggle } from "@/src/components/layout/ThemeToggle";
import { Flower } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-base-300/70 bg-base-100/90 backdrop-blur-xl">
      <div className="navbar mx-auto min-h-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <Link
            href="/"
            className="group inline-flex items-center gap-3"
            aria-label="Mini Event home"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-content shadow-sm transition-transform group-hover:-rotate-3">
              <Flower />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-bold tracking-tight">
                Mini Event
              </span>
              <span className="hidden text-[11px] text-base-content/60 sm:block">
                Mini booking core
              </span>
            </span>
          </Link>
        </div>
        <nav
          className="flex items-center gap-1"
          aria-label="Primary navigation"
        >
          <Link href="/" className="btn btn-ghost btn-sm hidden sm:inline-flex">
            All events
          </Link>
          <ThemeToggle />
          <AccountMenu />
        </nav>
      </div>
    </header>
  );
}

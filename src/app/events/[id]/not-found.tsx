import Link from "next/link";
import { ArrowLeft, CalendarX2 } from "lucide-react";
import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";

export default function EventNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <section className="w-full max-w-lg rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm sm:p-10">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-error/10 text-error">
            <CalendarX2 size={28} aria-hidden="true" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Event not found
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
            This event is unavailable
          </h1>
          <p className="mt-3 text-base leading-7 text-base-content/65">
            The event may have been removed or the link may be incorrect.
          </p>
          <Link href="/" className="btn btn-primary mt-7 gap-2">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to all events
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

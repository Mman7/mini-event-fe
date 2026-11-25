import { Suspense } from "react";
import { CatalogStats } from "@/src/components/events/CatalogStats";
import { EventList } from "@/src/components/events/EventList";
import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { getEvents } from "@/src/lib/api/event.api";
import type { Event } from "@/src/types/event.types";

async function loadEvents(): Promise<Event[] | null> {
  try {
    return await getEvents();
  } catch {
    return null;
  }
}

async function EventCatalog() {
  const events = await loadEvents();
  if (!events) {
    return (
      <ErrorState message="We could not load the event catalog. Please try again shortly." />
    );
  }

  return (
    <div className="space-y-6">
      <CatalogStats events={events} />
      <EventList events={events} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <section className="relative mb-8 overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl"
            />
            <div className="relative max-w-3xl">
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Find your next event and{" "}
                <span className="text-primary">reserve your seat.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-base-content/65 sm:text-lg">
                Browse upcoming sessions, check availability at a glance, and
                register in a few simple steps.
              </p>
            </div>
          </section>
          <Suspense fallback={<LoadingState />}>
            <EventCatalog />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

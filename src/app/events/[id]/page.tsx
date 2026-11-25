import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EventRegistrationForm } from "@/src/components/events/EventRegistrationForm";
import { EventStatusBadge } from "@/src/components/events/EventStatusBadge";
import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { ApiRequestError } from "@/src/lib/api/client";
import { getEvent } from "@/src/lib/api/event.api";
import {
  formatEventDate,
  formatEventTime,
  getEventStatus,
} from "@/src/lib/utils/event";

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

async function EventDetails({ id }: { id: string }) {
  let event: Awaited<ReturnType<typeof getEvent>>;
  try {
    event = await getEvent(id);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState message="We could not load this event. Please return to the catalog and try again." />
      </div>
    );
  }

  const status = getEventStatus(event);
  const registered = event.maxAttendees
    ? event.maxAttendees - event.availableSlots
    : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link href="/" className="btn btn-ghost btn-sm mb-6 px-2">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to all events
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="h-2 bg-primary" aria-hidden="true" />
          <div className="card-body p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <EventStatusBadge status={status} />
              <span className="text-sm font-medium text-base-content/60">
                {formatEventDate(event.date)}
              </span>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Event details
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {event.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-base-content/70">
              {event.description ||
                "Join this event for a focused session, useful conversations, and practical takeaways."}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-base-200 p-4">
                <span className="block text-xs font-semibold uppercase tracking-wide text-base-content/55">
                  When
                </span>
                <strong className="mt-1 block font-display text-base">
                  {formatEventTime(event.date)}
                </strong>
                <span className="text-sm text-base-content/60">
                  {formatEventDate(event.date)}
                </span>
              </div>
              <div className="rounded-lg bg-base-200 p-4">
                <span className="block text-xs font-semibold uppercase tracking-wide text-base-content/55">
                  Availability
                </span>
                <strong className="mt-1 block font-display text-base">
                  {event.availableSlots === 0
                    ? "Fully booked"
                    : `${event.availableSlots} seats left`}
                </strong>
                <span className="text-sm text-base-content/60">
                  {event.maxAttendees
                    ? `${registered} of ${event.maxAttendees} booked`
                    : "No capacity listed"}
                </span>
              </div>
            </div>
          </div>
        </article>
        <aside className="card border border-base-300 bg-base-100 shadow-sm lg:sticky lg:top-24">
          <div className="card-body p-6 sm:p-8">
            <EventRegistrationForm event={event} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingState label="Loading event details" />}>
          <EventDetailsPageContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

async function EventDetailsPageContent({ params }: EventDetailsPageProps) {
  const { id } = await params;
  return <EventDetails id={id} />;
}

export function Loading() {
  return <LoadingState label="Loading event details" />;
}

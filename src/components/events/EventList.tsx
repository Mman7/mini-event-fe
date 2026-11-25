"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EventCard } from "@/src/components/events/EventCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { getEventStatus } from "@/src/lib/utils/event";
import { authClient } from "@/src/lib/auth-client";
import { getMyRegistrations } from "@/src/lib/api/registration.api";
import type { Event } from "@/src/types/event.types";

export function EventList({ events }: { events: Event[] }) {
  const { data: session } = authClient.useSession();
  const [query, setQuery] = useState("");
  const [hideFull, setHideFull] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (!session) {
      return;
    }

    let active = true;
    getMyRegistrations()
      .then((registrations) => {
        if (active) {
          setRegisteredEventIds(
            new Set(registrations.map((registration) => registration.eventId)),
          );
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [session]);
  const visibleEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery =
        !normalizedQuery ||
        `${event.title} ${event.description || ""}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesQuery && (!hideFull || getEventStatus(event) !== "full");
    });
  }, [events, hideFull, query]);

  return (
    <>
      <section
        className=" border border-base-300 bg-base-100 p-4 shadow-sm mb-1"
        aria-label="Event filters"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="input input-bordered flex w-full items-center gap-2 md:max-w-xl">
            <Search
              size={16}
              className="text-base-content/50"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search events"
              aria-label="Search events"
            />
          </label>
          <label className="label cursor-pointer justify-start gap-3 md:justify-end">
            <input
              className="toggle toggle-primary"
              type="checkbox"
              checked={hideFull}
              onChange={(event) => setHideFull(event.target.checked)}
            />
            <span className="label-text">Hide fully booked</span>
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-3 text-xs text-base-content/60">
          <span>
            {visibleEvents.length}{" "}
            {visibleEvents.length === 1 ? "event" : "events"} shown
          </span>
          <span className="hidden sm:inline">
            Availability updates when you open an event
          </span>
        </div>
      </section>
      {visibleEvents.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={registeredEventIds.has(event.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}

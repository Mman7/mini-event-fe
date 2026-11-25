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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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
      const hasInvalidRange = fromDate && toDate && fromDate > toDate;
      const matchesDate =
        !hasInvalidRange &&
        (!fromDate || event.date >= fromDate) &&
        (!toDate || event.date <= toDate);
      return (
        matchesQuery &&
        matchesDate &&
        (!hideFull || getEventStatus(event) !== "full")
      );
    });
  }, [events, fromDate, hideFull, query, toDate]);

  const hasActiveFilters = Boolean(query || fromDate || toDate || hideFull);

  function clearFilters() {
    setQuery("");
    setFromDate("");
    setToDate("");
    setHideFull(false);
  }

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="input input-bordered flex items-center gap-2">
              <span className="text-xs font-semibold text-base-content/60">
                From
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                aria-label="Filter events from date"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="text-xs font-semibold text-base-content/60">
                To
              </span>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => setToDate(event.target.value)}
                aria-label="Filter events to date"
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
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-3 text-xs text-base-content/60">
          <div className="flex items-center gap-3">
            <span>
              {visibleEvents.length}{" "}
              {visibleEvents.length === 1 ? "event" : "events"} shown
            </span>
            {hasActiveFilters ? (
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            ) : null}
          </div>
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

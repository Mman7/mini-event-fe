"use client";

import Link from "next/link";
import { EventStatusBadge } from "@/src/components/events/EventStatusBadge";
import {
  formatEventDate,
  formatEventTime,
  getEventStatus,
} from "@/src/lib/utils/event";
import type { Event } from "@/src/types/event.types";

export function EventCard({
  event,
  isRegistered = false,
}: {
  event: Event;
  isRegistered?: boolean;
}) {
  const status = getEventStatus(event);
  const registered = event.maxAttendees
    ? event.maxAttendees - event.availableSlots
    : undefined;
  const progress = event.maxAttendees
    ? Math.min(
        100,
        Math.round(
          ((event.maxAttendees - event.availableSlots) / event.maxAttendees) *
            100,
        ),
      )
    : 0;

  return (
    <article className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="h-2 bg-primary" aria-hidden="true" />
      <div className="card-body gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <EventStatusBadge status={status} />
          <span className="text-right text-xs font-medium text-base-content/55 tabular-nums">
            {formatEventDate(event.date)}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Event session
          </p>
          <h2 className="mt-2 font-display text-xl font-bold leading-tight tracking-tight">
            {event.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-base-content/65">
            {event.description || "No description provided."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-base-200 p-3 text-xs text-base-content/65">
          <div>
            <span className="block font-semibold text-base-content">
              Schedule
            </span>
            <span>{formatEventTime(event.date)}</span>
          </div>
          <div>
            <span className="block font-semibold text-base-content">
              Capacity
            </span>
            <span className="tabular-nums">
              {event.maxAttendees
                ? `${registered} / ${event.maxAttendees} booked`
                : "Open attendance"}
            </span>
          </div>
        </div>
        {event.maxAttendees ? (
          <div>
            <div className="mb-1.5 flex justify-between text-xs">
              <span
                className={
                  status === "full"
                    ? "font-semibold text-error"
                    : status === "limited"
                      ? "font-semibold text-warning"
                      : "font-semibold text-success"
                }
              >
                {event.availableSlots === 0
                  ? "No seats left"
                  : `${event.availableSlots} seats available`}
              </span>
              <span className="tabular-nums text-base-content/55">
                {progress}% filled
              </span>
            </div>
            <progress
              className={`progress w-full ${status === "full" ? "progress-error" : status === "limited" ? "progress-warning" : "progress-success"}`}
              value={progress}
              max="100"
              aria-label={`${progress}% of seats booked`}
            />
          </div>
        ) : null}
        <div className="card-actions mt-auto pt-1">
          <Link
            className="btn btn-primary w-full"
            href={`/events/${encodeURIComponent(event.id)}`}
          >
            {isRegistered
              ? "Already registered"
              : status === "expired" || status === "full"
                ? "View event details"
                : "View & register"}
          </Link>
        </div>
      </div>
    </article>
  );
}

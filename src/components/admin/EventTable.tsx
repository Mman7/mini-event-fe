"use client";

import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { AdminEvent } from "@/src/lib/schemas/admin-event.schema";

export function EventTable({
  events,
  query,
  onQueryChange,
  onDelete,
}: {
  events: AdminEvent[];
  query: string;
  onQueryChange: (value: string) => void;
  onDelete: (event: AdminEvent) => void;
}) {
  return (
    <section className="rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-base-300 p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="input input-bordered flex items-center gap-2 sm:max-w-sm">
          <Search
            size={16}
            className="text-base-content/50"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search event title"
            aria-label="Search event title"
          />
        </label>
        <Link href="/admin/events/create" className="btn btn-primary gap-2">
          <Plus size={16} aria-hidden="true" />
          Create event
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Event title</th>
              <th>Date</th>
              <th>Capacity</th>
              <th>Available</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="font-semibold">{event.title}</td>
                <td>{event.eventDate}</td>
                <td>
                  {event.registeredCount} / {event.maxAttendees}
                </td>
                <td>{event.availableSlots}</td>
                <td>
                  <span
                    className={`badge badge-outline ${event.status === "full" ? "badge-error" : event.status === "expired" ? "badge-neutral" : event.status === "limited" ? "badge-warning" : "badge-success"}`}
                  >
                    {event.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="btn btn-ghost btn-sm btn-square"
                      aria-label={`Edit ${event.title}`}
                    >
                      <Pencil size={15} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square text-error"
                      onClick={() => onDelete(event)}
                      aria-label={`Delete ${event.title}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {events.length === 0 ? (
        <p className="p-8 text-center text-sm text-base-content/60">
          No events match your filters.
        </p>
      ) : null}
    </section>
  );
}

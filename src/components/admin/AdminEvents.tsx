"use client";

import { useEffect, useMemo, useState } from "react";
import { EventTable } from "@/src/components/admin/EventTable";
import { DeleteConfirmation } from "@/src/components/admin/DeleteConfirmation";
import { deleteAdminEvent, getAdminEvents } from "@/src/lib/api/admin.api";
import type { AdminEvent } from "@/src/lib/schemas/admin-event.schema";

export function AdminEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getAdminEvents()
      .then(setEvents)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) =>
        event.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [events, query],
  );

  async function deleteEvent() {
    if (!deleting) return;
    setIsDeleting(true);
    await deleteAdminEvent(deleting.id);
    setEvents((current) => current.filter((event) => event.id !== deleting.id));
    setDeleting(null);
    setIsDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-base-content/60">
          Live events from the admin API
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold">Events</h2>
      </div>
      {error ? (
        <div className="alert alert-error" role="alert">
          <span>{error}</span>
        </div>
      ) : null}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <EventTable
          events={filteredEvents}
          query={query}
          onQueryChange={setQuery}
          onDelete={setDeleting}
        />
      )}
      {deleting ? (
        <DeleteConfirmation
          title="Delete event?"
          message={`Delete ${deleting.title}? This action cannot be undone.`}
          isPending={isDeleting}
          onCancel={() => setDeleting(null)}
          onConfirm={deleteEvent}
        />
      ) : null}
    </div>
  );
}

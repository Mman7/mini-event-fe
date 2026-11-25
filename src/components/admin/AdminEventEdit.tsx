"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EventForm } from "@/src/components/admin/EventForm";
import { getAdminEvent, updateAdminEvent } from "@/src/lib/api/admin.api";
import type { AdminEvent } from "@/src/lib/schemas/admin-event.schema";

export function AdminEventEdit({ id }: { id: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<AdminEvent>();
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getAdminEvent(id)
      .then(setEvent)
      .catch(() => setMissing(true));
  }, [id]);

  if (missing) {
    return (
      <div className="alert alert-error">
        <span>Event not found.</span>
        <Link href="/admin/events" className="link">
          Back to events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold">Edit event</h2>
        <p className="mt-2 text-base-content/65">
          Update the live event details.
        </p>
      </div>
      <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <EventForm
          event={event}
          onSubmit={async (input) => {
            await updateAdminEvent(event.id, input);
            router.push("/admin/events");
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "@/src/components/admin/EventForm";
import { createAdminEvent } from "@/src/lib/api/admin.api";

export function AdminEventCreate() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold">Create event</h2>
        <p className="mt-2 text-base-content/65">
          Create a new event in the live catalog.
        </p>
      </div>
      <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <EventForm
          onSubmit={async (input) => {
            await createAdminEvent(input);
            router.push("/admin/events");
          }}
        />
      </div>
    </div>
  );
}

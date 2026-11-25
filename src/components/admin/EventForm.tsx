"use client";

import { useState } from "react";
import {
  adminEventInputSchema,
  type AdminEvent,
  type AdminEventInput,
} from "@/src/lib/schemas/admin-event.schema";

export function EventForm({
  event,
  onSubmit,
}: {
  event?: AdminEvent;
  onSubmit: (input: AdminEventInput) => void;
}) {
  const [values, setValues] = useState({
    title: event?.title ?? "",
    description: event?.description ?? "",
    eventDate: event?.eventDate ?? "",
    maxAttendees: String(event?.maxAttendees ?? ""),
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AdminEventInput, string>>
  >({});

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const result = adminEventInputSchema.safeParse({
      ...values,
      maxAttendees: Number(values.maxAttendees),
    });
    if (!result.success) {
      const nextErrors: Partial<Record<keyof AdminEventInput, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof AdminEventInput;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    onSubmit(result.data);
  }

  return (
    <form className="max-w-2xl space-y-5" onSubmit={submit} noValidate>
      <div>
        <label className="label" htmlFor="admin-event-title">
          <span className="label-text font-semibold">Title</span>
        </label>
        <input
          id="admin-event-title"
          className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
        />
        {errors.title ? (
          <p className="mt-1 text-sm text-error">{errors.title}</p>
        ) : null}
      </div>
      <div>
        <label className="label" htmlFor="admin-event-description">
          <span className="label-text font-semibold">Description</span>
        </label>
        <textarea
          id="admin-event-description"
          className="textarea textarea-bordered min-h-28 w-full"
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="admin-event-date">
            <span className="label-text font-semibold">Event date</span>
          </label>
          <input
            id="admin-event-date"
            type="date"
            className={`input input-bordered w-full ${errors.eventDate ? "input-error" : ""}`}
            value={values.eventDate}
            onChange={(event) => update("eventDate", event.target.value)}
          />
          {errors.eventDate ? (
            <p className="mt-1 text-sm text-error">{errors.eventDate}</p>
          ) : null}
        </div>
        <div>
          <label className="label" htmlFor="admin-event-capacity">
            <span className="label-text font-semibold">Maximum attendees</span>
          </label>
          <input
            id="admin-event-capacity"
            type="number"
            min="1"
            className={`input input-bordered w-full ${errors.maxAttendees ? "input-error" : ""}`}
            value={values.maxAttendees}
            onChange={(event) => update("maxAttendees", event.target.value)}
          />
          {errors.maxAttendees ? (
            <p className="mt-1 text-sm text-error">{errors.maxAttendees}</p>
          ) : null}
        </div>
      </div>
      <button className="btn btn-primary" type="submit">
        {event ? "Save changes" : "Create event"}
      </button>
    </form>
  );
}

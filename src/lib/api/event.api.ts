import { z } from "zod";
import type { Event } from "@/src/types/event.types";
import { fetchJson } from "@/src/lib/api/client";

// Shape returned by the backend (`eventDate`, nullable `description`).
const backendEventSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    title: z.string(),
    eventDate: z.string(),
    description: z.string().nullish(),
    maxAttendees: z.number().int().nonnegative().optional(),
    availableSlots: z.number().int().nonnegative(),
  })
  .transform(
    (event): Event => ({
      id: event.id,
      title: event.title,
      date: event.eventDate,
      description: event.description ?? undefined,
      availableSlots: event.availableSlots,
      maxAttendees: event.maxAttendees,
    }),
  );

export async function getEvents(): Promise<Event[]> {
  const response: unknown = await fetchJson<unknown>("events");
  return z.array(backendEventSchema).parse(response);
}

export async function getEvent(id: string): Promise<Event> {
  const response: unknown = await fetchJson<unknown>(
    `events/${encodeURIComponent(id)}`,
  );
  return backendEventSchema.parse(response);
}

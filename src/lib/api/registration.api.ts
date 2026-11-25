import { z } from "zod";
import { registrationResponseSchema } from "@/src/lib/schemas/event.schema";
import { fetchJson } from "@/src/lib/api/client";
import type { RegistrationResult } from "@/src/types/api.types";

const myRegistrationSchema = z.object({
  id: z.number(),
  eventId: z.union([z.string(), z.number()]).transform(String),
  eventTitle: z.string(),
  eventDate: z.string(),
  registeredAt: z.string(),
});

export type MyRegistration = z.infer<typeof myRegistrationSchema>;

export async function getMyRegistrations(): Promise<MyRegistration[]> {
  const response: unknown = await fetchJson<unknown>("registrations");
  return z.array(myRegistrationSchema).parse(response);
}

export async function cancelRegistration(
  eventId: string,
): Promise<RegistrationResult> {
  const response: unknown = await fetchJson<unknown>(
    `events/${encodeURIComponent(eventId)}/registrations`,
    { method: "DELETE" },
  );

  return response === undefined || response === null
    ? {}
    : registrationResponseSchema.parse(response);
}

export async function registerForEvent(
  id: string,
): Promise<RegistrationResult> {
  const response: unknown = await fetchJson<unknown>(
    `events/${encodeURIComponent(id)}/registrations`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );

  if (response === undefined || response === null) {
    return {};
  }

  return registrationResponseSchema.parse(response);
}

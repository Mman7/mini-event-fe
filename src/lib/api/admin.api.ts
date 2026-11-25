import { fetchJson } from "@/src/lib/api/client";
import { z } from "zod";
import {
  adminEventSchema,
  type AdminEvent,
  type AdminEventInput,
} from "@/src/lib/schemas/admin-event.schema";
import {
  adminRegistrationSchema,
  type AdminRegistration,
} from "@/src/lib/schemas/admin-registration.schema";

const adminEventListSchema = z.object({
  items: z.array(z.unknown()),
});

const adminRegistrationListSchema = z.object({
  items: z.array(z.unknown()),
});

const dashboardSchema = z.object({
  totalEvents: z.number(),
  confirmedRegistrations: z.number(),
  totalUsers: z.number(),
  upcomingEvents: z.number(),
});

const rawAdminEventSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  description: z.string().nullish(),
  eventDate: z.string(),
  maxAttendees: z.number().int().positive(),
  registeredCount: z.number().int().nonnegative(),
  availableSlots: z.number().int().nonnegative(),
  status: z.enum(["UPCOMING", "FULL", "PAST"]),
});

const rawAdminRegistrationSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: z.enum(["CONFIRMED", "CANCELLED"]),
  registeredAt: z.string(),
  user: z.object({ name: z.string(), email: z.string().email() }),
  event: z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string(),
    eventDate: z.string(),
  }),
});

type RawAdminEvent = z.infer<typeof rawAdminEventSchema>;

function getAdminEventStatus(event: RawAdminEvent): AdminEvent["status"] {
  if (event.status === "FULL") {
    return "full";
  }

  if (event.status === "PAST") {
    return "expired";
  }

  if (event.availableSlots <= 5) {
    return "limited";
  }

  return "available";
}

function normalizeEvent(value: unknown): AdminEvent {
  const event = rawAdminEventSchema.parse(value);
  return adminEventSchema.parse({
    ...event,
    id: String(event.id),
    status: getAdminEventStatus(event),
  });
}

function normalizeRegistration(value: unknown): AdminRegistration {
  const registration = rawAdminRegistrationSchema.parse(value);
  return adminRegistrationSchema.parse({
    id: String(registration.id),
    customerName: registration.user.name,
    email: registration.user.email,
    eventId: String(registration.event.id),
    eventTitle: registration.event.title,
    eventDate: registration.event.eventDate,
    registeredAt: registration.registeredAt,
    status: registration.status === "CANCELLED" ? "cancelled" : "confirmed",
  });
}

export type AdminDashboard = z.infer<typeof dashboardSchema>;

export async function getAdminDashboard(): Promise<AdminDashboard> {
  return dashboardSchema.parse(await fetchJson("admin/dashboard"));
}

export async function getAdminEvents(): Promise<AdminEvent[]> {
  const response = adminEventListSchema.parse(
    await fetchJson("admin/events?page=1&pageSize=100"),
  );
  return response.items.map(normalizeEvent);
}

export async function getAdminEvent(id: string): Promise<AdminEvent> {
  return normalizeEvent(
    await fetchJson(`admin/events/${encodeURIComponent(id)}`),
  );
}

export async function createAdminEvent(
  input: AdminEventInput,
): Promise<AdminEvent> {
  return normalizeEvent(
    await fetchJson("admin/events", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  );
}

export async function updateAdminEvent(
  id: string,
  input: AdminEventInput,
): Promise<AdminEvent> {
  return normalizeEvent(
    await fetchJson(`admin/events/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  );
}

export async function deleteAdminEvent(id: string): Promise<void> {
  await fetchJson(`admin/events/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getAdminRegistrations(): Promise<AdminRegistration[]> {
  const response = adminRegistrationListSchema.parse(
    await fetchJson("admin/registrations?page=1&pageSize=100"),
  );
  return response.items.map(normalizeRegistration);
}

export async function cancelAdminRegistration(id: string): Promise<void> {
  await fetchJson(`admin/registrations/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

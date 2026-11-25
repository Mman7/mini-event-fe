import { z } from "zod";

export const adminEventStatusSchema = z.enum([
  "available",
  "limited",
  "full",
  "expired",
]);

export const adminEventSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().nullish(),
  eventDate: z.string().min(1, "Event date is required."),
  maxAttendees: z.number().int().positive("Capacity must be at least 1."),
  registeredCount: z.number().int().nonnegative(),
  availableSlots: z.number().int().nonnegative(),
  status: adminEventStatusSchema,
});

export const adminEventInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().optional(),
  eventDate: z
    .string()
    .refine(
      (value) => value.length > 0 && !Number.isNaN(new Date(value).getTime()),
      "Enter a valid event date.",
    ),
  maxAttendees: z.coerce.number().int().min(1, "Capacity must be at least 1."),
});

export type AdminEvent = z.infer<typeof adminEventSchema>;
export type AdminEventInput = z.infer<typeof adminEventInputSchema>;

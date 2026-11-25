import { z } from "zod";

export const eventSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string().trim().min(1),
  date: z.string().trim().min(1),
  description: z.string().trim().optional(),
  availableSlots: z.number().int().min(0),
  maxAttendees: z.number().int().positive().optional(),
});

export const eventListSchema = z.array(eventSchema);

export const registrationResponseSchema = z
  .object({
    message: z.string().trim().optional(),
  })
  .passthrough();

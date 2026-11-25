import { z } from "zod";

export const adminRegistrationStatusSchema = z.enum(["confirmed", "cancelled"]);

export const adminRegistrationSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  email: z.string().email(),
  eventId: z.string(),
  eventTitle: z.string(),
  eventDate: z.string(),
  registeredAt: z.string(),
  status: adminRegistrationStatusSchema,
});

export type AdminRegistration = z.infer<typeof adminRegistrationSchema>;

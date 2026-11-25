import { z } from "zod";

export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(120, "Name must be 120 characters or fewer."),
  email: z.string().trim().email("Please enter a valid email address."),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export type Event = {
  id: string;
  title: string;
  date: string;
  description?: string;
  availableSlots: number;
  maxAttendees?: number;
};

export type EventStatus = "available" | "limited" | "full" | "expired";

export type RegistrationInput = {
  name: string;
  email: string;
};

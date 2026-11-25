import type { Event, EventStatus } from "@/src/types/event.types";

export function getEventStatus(event: Event): EventStatus {
  const eventTime = new Date(event.date).getTime();
  if (!Number.isNaN(eventTime) && eventTime <= Date.now()) {
    return "expired";
  }

  if (event.availableSlots === 0) {
    return "full";
  }

  if (
    event.maxAttendees &&
    event.availableSlots <= Math.ceil(event.maxAttendees * 0.2)
  ) {
    return "limited";
  }

  return "available";
}

export function formatEventDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export function formatEventTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Time to be announced";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

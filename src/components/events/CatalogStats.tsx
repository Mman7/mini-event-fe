import { CalendarDays, CircleX, Ticket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getEventStatus } from "@/src/lib/utils/event";
import type { Event } from "@/src/types/event.types";

type StatItem = {
  label: string;
  value: number;
  icon: LucideIcon;
};

export function CatalogStats({ events }: { events: Event[] }) {
  const upcomingEvents = events.filter(
    (event) => getEventStatus(event) !== "expired",
  );
  const openSeats = upcomingEvents.reduce(
    (total, event) => total + event.availableSlots,
    0,
  );
  const fullCount = upcomingEvents.filter(
    (event) => getEventStatus(event) === "full",
  ).length;

  const items: StatItem[] = [
    {
      label: "Upcoming events",
      value: upcomingEvents.length,
      icon: CalendarDays,
    },
    { label: "Seats remaining", value: openSeats, icon: Ticket },
    { label: "Fully booked", value: fullCount, icon: CircleX },
  ];

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon size={20} aria-hidden="true" />
          </span>
          <div>
            <dt className="text-xs font-medium text-base-content/60">
              {label}
            </dt>
            <dd className="font-display text-2xl font-bold tabular-nums">
              {value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

import { AlertTriangle, CircleCheck, CircleX, Clock3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { EventStatus } from "@/src/types/event.types";

const statusCopy: Record<EventStatus, string> = {
  available: "Available",
  limited: "Limited seats",
  full: "Fully booked",
  expired: "Expired",
};

const statusClasses: Record<EventStatus, string> = {
  available: "badge-success",
  limited: "badge-warning",
  full: "badge-error",
  expired: "badge-neutral",
};

const statusIcons: Record<EventStatus, LucideIcon> = {
  available: CircleCheck,
  limited: AlertTriangle,
  full: CircleX,
  expired: Clock3,
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const StatusIcon = statusIcons[status];

  return (
    <span
      className={`badge badge-sm gap-1.5 font-semibold ${statusClasses[status]}`}
    >
      <StatusIcon size={13} aria-hidden="true" />
      {statusCopy[status]}
    </span>
  );
}

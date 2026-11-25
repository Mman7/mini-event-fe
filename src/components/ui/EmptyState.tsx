import { CalendarX2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-100 p-8 text-center">
      <span
        className="mb-3 grid size-11 place-items-center rounded-full bg-base-200"
        aria-hidden="true"
      >
        <CalendarX2 size={20} />
      </span>
      <h2 className="font-display text-lg font-semibold">
        No events available
      </h2>
      <p className="mt-1 max-w-md text-sm text-base-content/65">
        There are no events to show right now. Check back soon for the next
        release.
      </p>
    </div>
  );
}

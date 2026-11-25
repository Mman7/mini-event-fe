import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading events" }: { label?: string }) {
  return (
    <div
      className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-base-300 bg-base-100 p-8 text-center"
      role="status"
    >
      <LoaderCircle
        className="animate-spin text-primary"
        size={24}
        aria-hidden="true"
      />
      <p className="text-sm text-base-content/65">{label}</p>
    </div>
  );
}

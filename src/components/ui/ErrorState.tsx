import { CircleAlert } from "lucide-react";

export function ErrorState({
  message = "We could not load the events right now.",
}: {
  message?: string;
}) {
  return (
    <div className="alert alert-error items-start rounded-xl" role="alert">
      <CircleAlert className="shrink-0" size={20} aria-hidden="true" />
      <div>
        <h2 className="font-semibold">Something went wrong</h2>
        <p className="text-sm opacity-85">{message}</p>
      </div>
    </div>
  );
}

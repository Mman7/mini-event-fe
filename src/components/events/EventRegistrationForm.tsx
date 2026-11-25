"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CalendarX2, CheckCircle2, Clock3, LoaderCircle } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import {
  getMyRegistrations,
  registerForEvent,
} from "@/src/lib/api/registration.api";
import { ApiRequestError } from "@/src/lib/api/client";
import { getEventStatus } from "@/src/lib/utils/event";
import type { Event } from "@/src/types/event.types";

export function EventRegistrationForm({ event }: { event: Event }) {
  const isFull = event.availableSlots === 0;
  const isExpired = getEventStatus(event) === "expired";
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    let active = true;
    getMyRegistrations()
      .then((registrations) => {
        if (active) {
          setHasRegistered(
            registrations.some(
              (registration) => registration.eventId === event.id,
            ),
          );
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [event.id, session]);

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (
      isSubmitting ||
      isFull ||
      isExpired ||
      isSessionPending ||
      hasRegistered
    ) {
      return;
    }

    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await registerForEvent(event.id);
      setHasRegistered(true);
      setFeedback({
        type: "success",
        message:
          response.message || "You are registered. We will see you there.",
      });
    } catch (error) {
      const message =
        error instanceof ApiRequestError || error instanceof Error
          ? error.message
          : "Registration could not be completed. Please try again.";
      setFeedback({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isFull) {
    return (
      <div
        className="rounded-xl border border-error/25 bg-error/10 p-5"
        role="status"
      >
        <CalendarX2 size={20} className="mb-3 text-error" aria-hidden="true" />
        <p className="font-display font-semibold text-error">
          Registration is closed
        </p>
        <p className="mt-1 text-sm text-base-content/70">
          This event has reached its maximum capacity.
        </p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div
        className="rounded-xl border border-base-300 bg-base-200 p-5"
        role="status"
      >
        <Clock3
          size={20}
          className="mb-3 text-base-content/60"
          aria-hidden="true"
        />
        <p className="font-display font-semibold">Registration expired</p>
        <p className="mt-1 text-sm text-base-content/70">
          This event has already taken place.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="rounded-lg bg-base-200 p-4 text-sm">
        {session ? (
          <>
            <span className="block text-xs font-semibold uppercase tracking-wide text-base-content/55">
              Registering as
            </span>
            <strong className="mt-1 block font-display text-base">
              {session.user.name}
            </strong>
            <span className="text-base-content/60">{session.user.email}</span>
          </>
        ) : (
          <span className="text-base-content/70">
            Sign in to register. You will return to this event afterwards.
          </span>
        )}
      </div>
      {feedback ? (
        <div
          className={`alert ${feedback.type === "success" ? "alert-success" : "alert-error"} text-sm`}
          role={feedback.type === "success" ? "status" : "alert"}
        >
          {feedback.type === "success" ? (
            <>
              <CheckCircle2 size={20} aria-hidden="true" />
              <div>
                <p className="font-semibold">Registration confirmed</p>
                <p>{feedback.message}</p>
              </div>
            </>
          ) : (
            <span>{feedback.message}</span>
          )}
        </div>
      ) : null}
      <button
        className={`btn w-full ${hasRegistered ? "btn-success btn-outline" : "btn-primary"}`}
        type="submit"
        disabled={isSubmitting || hasRegistered}
      >
        {hasRegistered ? (
          "Already registered"
        ) : isSubmitting ? (
          <>
            <LoaderCircle
              className="animate-spin"
              size={16}
              aria-hidden="true"
            />{" "}
            Registering...
          </>
        ) : (
          "Register for this event"
        )}
      </button>
    </form>
  );
}

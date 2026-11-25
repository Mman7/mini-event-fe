"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Clock3,
  X,
} from "lucide-react";
import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";
import { authClient } from "@/src/lib/auth-client";
import { ApiRequestError } from "@/src/lib/api/client";
import {
  cancelRegistration,
  getMyRegistrations,
  type MyRegistration,
} from "@/src/lib/api/registration.api";
import { formatEventDate } from "@/src/lib/utils/event";

function formatRegistrationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function RegistrationsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [myRegistrations, setMyRegistrations] = useState<
    MyRegistration[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [registrationToCancel, setRegistrationToCancel] =
    useState<MyRegistration | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  async function handleCancelRegistration() {
    if (!registrationToCancel || isCancelling) {
      return;
    }

    setIsCancelling(true);
    setError(null);
    try {
      await cancelRegistration(registrationToCancel.eventId);
      setMyRegistrations(
        (current) =>
          current?.filter((item) => item.id !== registrationToCancel.id) ?? [],
      );
      setRegistrationToCancel(null);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError || requestError instanceof Error
          ? requestError.message
          : "Registration could not be cancelled.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    let active = true;
    getMyRegistrations()
      .then((registrations) => {
        if (active) {
          setMyRegistrations(registrations);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError instanceof ApiRequestError ||
              requestError instanceof Error
              ? requestError.message
              : "Registrations could not be loaded.",
          );
          setMyRegistrations([]);
        }
      });

    return () => {
      active = false;
    };
  }, [session]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="sr-only">Checking your session</span>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            My registrations
          </h1>
          {!user ? (
            <div className="mt-6 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <p className="text-base-content/70">
                Log in to see the events you have registered for.
              </p>
              <Link href="/login" className="btn btn-primary btn-sm mt-4">
                Login
              </Link>
            </div>
          ) : error ? (
            <div className="alert alert-error mt-6" role="alert">
              <span>{error}</span>
            </div>
          ) : myRegistrations === null ? (
            <div className="mt-6 flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
              <span className="sr-only">Loading registrations</span>
            </div>
          ) : myRegistrations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center">
              <ClipboardList
                size={28}
                className="mx-auto text-base-content/40"
                aria-hidden="true"
              />
              <p className="mt-3 font-semibold">No registrations yet</p>
              <Link href="/" className="btn btn-ghost btn-sm mt-3">
                Browse events
              </Link>
            </div>
          ) : (
            <ul className="mt-6 grid gap-3">
              {myRegistrations.map((registration) =>
                (() => {
                  const isExpired =
                    new Date(registration.eventDate).getTime() <= Date.now();

                  return (
                    <li
                      key={`${registration.eventId}-${registration.registeredAt}`}
                      className="flex flex-col gap-2 rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-display font-semibold">
                          {registration.eventTitle}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-base-content/65">
                          <CalendarDays size={14} aria-hidden="true" />
                          {formatEventDate(registration.eventDate)}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-base-content/50">
                          <Clock3 size={13} aria-hidden="true" />
                          Registered{" "}
                          {formatRegistrationDate(registration.registeredAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`badge badge-outline ${isExpired ? "badge-neutral" : "badge-success"}`}
                        >
                          {isExpired ? "Expired" : "Registered"}
                        </span>
                        <Link
                          href={`/events/${encodeURIComponent(registration.eventId)}`}
                          className="btn btn-primary btn-sm"
                        >
                          View info
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-error btn-outline btn-sm"
                          onClick={() => setRegistrationToCancel(registration)}
                        >
                          Cancel
                        </button>
                      </div>
                    </li>
                  );
                })(),
              )}
            </ul>
          )}
        </div>
      </main>
      <Footer />
      {registrationToCancel ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-neutral/50 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isCancelling) {
              setRegistrationToCancel(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-registration-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="cancel-registration-title"
                  className="font-display text-xl font-bold"
                >
                  Cancel registration?
                </h2>
                <p className="mt-2 text-sm leading-6 text-base-content/65">
                  Cancel your registration for {registrationToCancel.eventTitle}
                  ? This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                aria-label="Close confirmation dialog"
                onClick={() => setRegistrationToCancel(null)}
                disabled={isCancelling}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setRegistrationToCancel(null)}
                disabled={isCancelling}
              >
                Keep registration
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={handleCancelRegistration}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Cancel registration"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

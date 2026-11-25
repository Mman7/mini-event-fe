"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, ClipboardList, Plus } from "lucide-react";
import { StatCard } from "@/src/components/admin/StatCard";
import {
  getAdminDashboard,
  getAdminEvents,
  getAdminRegistrations,
} from "@/src/lib/api/admin.api";
import type { AdminEvent } from "@/src/lib/schemas/admin-event.schema";
import type { AdminRegistration } from "@/src/lib/schemas/admin-registration.schema";

export function AdminDashboard() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    confirmedRegistrations: 0,
    totalUsers: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    getAdminDashboard()
      .then(setMetrics)
      .catch(() => undefined);
    getAdminEvents()
      .then(setEvents)
      .catch(() => setEvents([]));
    getAdminRegistrations()
      .then(setRegistrations)
      .catch(() => setRegistrations([]));
  }, []);

  const fullEvents = events.filter((event) => event.status === "full").length;

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Admin workspace
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Keep the event calendar moving.
        </h2>
        <p className="mt-2 max-w-2xl text-base-content/65">
          Manage events and registrations from one focused workspace.
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Events"
          value={metrics.totalEvents}
          icon={CalendarDays}
        />
        <StatCard
          label="Total Registrations"
          value={metrics.confirmedRegistrations}
          icon={ClipboardList}
          tone="info"
        />
        <StatCard
          label="Upcoming Events"
          value={metrics.upcomingEvents}
          icon={CalendarDays}
          tone="success"
        />
        <StatCard
          label="Fully Booked Events"
          value={fullEvents}
          icon={CalendarDays}
          tone="warning"
        />
      </div>
      <div className="alert alert-info">
        <span>
          {metrics.totalUsers} registered users have access to the event
          platform.
        </span>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/events/create"
          className="btn btn-primary justify-start gap-3"
        >
          <Plus size={18} aria-hidden="true" />
          Create New Event
        </Link>
        <Link
          href="/admin/events"
          className="btn btn-outline justify-start gap-3"
        >
          <CalendarDays size={18} aria-hidden="true" />
          View All Events
        </Link>
        <Link
          href="/admin/registrations"
          className="btn btn-outline justify-start gap-3"
        >
          <ClipboardList size={18} aria-hidden="true" />
          View All Registrations
        </Link>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold">
            Recent registrations
          </h3>
          <div className="mt-4 space-y-3">
            {registrations.slice(0, 3).map((registration) => (
              <div
                key={registration.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate font-medium">
                  {registration.customerName}
                </span>
                <span className="truncate text-base-content/55">
                  {registration.eventTitle}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/registrations"
            className="btn btn-ghost btn-sm mt-4 gap-2"
          >
            Open registrations <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold">Upcoming events</h3>
          <div className="mt-4 space-y-3">
            {events
              .filter((event) => event.status !== "expired")
              .slice(0, 3)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate font-medium">{event.title}</span>
                  <span className="whitespace-nowrap text-base-content/55">
                    {event.availableSlots} seats
                  </span>
                </div>
              ))}
          </div>
          <Link
            href="/admin/events"
            className="btn btn-ghost btn-sm mt-4 gap-2"
          >
            Open events <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

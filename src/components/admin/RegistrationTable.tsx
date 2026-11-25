"use client";

import { Search, XCircle } from "lucide-react";
import type { AdminRegistration } from "@/src/lib/schemas/admin-registration.schema";

export function RegistrationTable({
  registrations,
  query,
  onQueryChange,
  onCancel,
}: {
  registrations: AdminRegistration[];
  query: string;
  onQueryChange: (value: string) => void;
  onCancel: (registration: AdminRegistration) => void;
}) {
  return (
    <section className="rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <div className="border-b border-base-300 p-4">
        <label className="input input-bordered flex items-center gap-2 sm:max-w-sm">
          <Search
            size={16}
            className="text-base-content/50"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search customer or event"
            aria-label="Search registrations"
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Event</th>
              <th>Event date</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td>
                  <span className="font-semibold">
                    {registration.customerName}
                  </span>
                  <span className="block text-xs text-base-content/55">
                    {registration.email}
                  </span>
                </td>
                <td>{registration.eventTitle}</td>
                <td>{registration.eventDate}</td>
                <td>
                  {new Date(registration.registeredAt).toLocaleDateString()}
                </td>
                <td>
                  <span
                    className={`badge ${registration.status === "confirmed" ? "badge-success" : "badge-ghost"}`}
                  >
                    {registration.status}
                  </span>
                </td>
                <td>
                  {registration.status === "confirmed" ? (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm gap-2 text-error"
                      onClick={() => onCancel(registration)}
                    >
                      <XCircle size={15} aria-hidden="true" />
                      Cancel
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {registrations.length === 0 ? (
        <p className="p-8 text-center text-sm text-base-content/60">
          No registrations match your search.
        </p>
      ) : null}
    </section>
  );
}

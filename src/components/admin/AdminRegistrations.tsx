"use client";

import { useEffect, useMemo, useState } from "react";
import { RegistrationTable } from "@/src/components/admin/RegistrationTable";
import { DeleteConfirmation } from "@/src/components/admin/DeleteConfirmation";
import {
  cancelAdminRegistration,
  getAdminRegistrations,
} from "@/src/lib/api/admin.api";
import { ApiRequestError } from "@/src/lib/api/client";
import type { AdminRegistration } from "@/src/lib/schemas/admin-registration.schema";

export function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState<AdminRegistration | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleAdminError(requestError: unknown) {
    if (
      requestError instanceof ApiRequestError &&
      (requestError.status === 401 || requestError.status === 403)
    ) {
      window.location.replace("/");
      return;
    }
    setError(
      requestError instanceof Error
        ? requestError.message
        : "Unable to load registrations.",
    );
  }

  useEffect(() => {
    getAdminRegistrations()
      .then(setRegistrations)
      .catch(handleAdminError)
      .finally(() => setIsLoading(false));
  }, []);

  async function cancelRegistration() {
    if (!cancelling) return;
    setIsCancelling(true);
    try {
      await cancelAdminRegistration(cancelling.id);
      setRegistrations((current) =>
        current.map((item) =>
          item.id === cancelling.id ? { ...item, status: "cancelled" } : item,
        ),
      );
      setCancelling(null);
    } catch (requestError) {
      handleAdminError(requestError);
    } finally {
      setIsCancelling(false);
    }
  }

  const filtered = useMemo(
    () =>
      registrations.filter((registration) =>
        `${registration.customerName} ${registration.email} ${registration.eventTitle}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [registrations, query],
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-base-content/60">
          Live registrations from the admin API
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold">Registrations</h2>
      </div>
      {error ? (
        <div className="alert alert-error" role="alert">
          <span>{error}</span>
        </div>
      ) : null}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <RegistrationTable
          registrations={filtered}
          query={query}
          onQueryChange={setQuery}
          onCancel={setCancelling}
        />
      )}
      {cancelling ? (
        <DeleteConfirmation
          title="Cancel registration?"
          message={`Cancel ${cancelling.customerName}'s registration for ${cancelling.eventTitle}?`}
          isPending={isCancelling}
          onCancel={() => setCancelling(null)}
          onConfirm={cancelRegistration}
        />
      ) : null}
    </div>
  );
}

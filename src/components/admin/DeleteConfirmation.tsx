"use client";

import { X } from "lucide-react";

export function DeleteConfirmation({
  title,
  message,
  isPending,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-neutral/50 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onCancel();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="admin-confirm-title"
              className="font-display text-xl font-bold"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-base-content/65">
              {message}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            onClick={onCancel}
            disabled={isPending}
            aria-label="Close dialog"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            Keep it
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

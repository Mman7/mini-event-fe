import type { ApiError } from "@/src/types/api.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export class ApiRequestError extends Error {
  status: number;

  constructor({ status, message }: ApiError) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function getApiUrl(path: string) {
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function getErrorMessage(response: Response) {
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null) {
      const record = body as Record<string, unknown>;
      const message = record.message ?? record.error;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  } catch {
    // The response body is not JSON; use the HTTP status below.
  }

  return `Request failed with status ${response.status}.`;
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(getApiUrl(path), {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Unable to reach the event service. Please try again.");
  }

  if (!response.ok) {
    throw new ApiRequestError({
      status: response.status,
      message: await getErrorMessage(response),
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    const body: unknown = await response.json();
    // The backend wraps successful responses as { success, data } or { success, message }.
    if (
      typeof body === "object" &&
      body !== null &&
      (body as Record<string, unknown>).success === true &&
      "data" in body
    ) {
      return (body as { data: T }).data;
    }
    return body as T;
  } catch {
    throw new Error("The event service returned an invalid response.");
  }
}

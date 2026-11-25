"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/src/lib/auth-client";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const userRole = session?.user
    ? (session.user as typeof session.user & { role?: string }).role
    : undefined;

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (!isPending && session && userRole !== "ADMIN") {
      router.replace("/");
    }
  }, [isPending, pathname, router, session, userRole]);

  if (isPending || !session || userRole !== "ADMIN") {
    return (
      <div className="grid min-h-screen place-items-center bg-base-200 px-4">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-3 text-sm text-base-content/65">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";
import { authClient } from "@/src/lib/auth-client";

type Mode = "sign-in" | "sign-up";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectTo =
    redirectParam?.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/";
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (isSignUp && !name.trim()) {
      setError("Enter your name to create an account.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name: name.trim(), email, password })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setError(
          result.error.message ?? "Something went wrong. Please try again.",
        );
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {isSignUp ? "Create account" : "Sign in"}
          </h1>
          <p className="mt-2 text-sm text-base-content/65">
            Sign in to see the events you have registered for.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            {isSignUp ? (
              <div>
                <label className="label" htmlFor="login-name">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <input
                  id="login-name"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError(null);
                  }}
                  autoComplete="name"
                />
              </div>
            ) : null}
            <div>
              <label className="label" htmlFor="login-email">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                id="login-email"
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label" htmlFor="login-password">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                id="login-password"
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(null);
                }}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
            {error ? (
              <div className="alert alert-error text-sm" role="alert">
                <span>{error}</span>
              </div>
            ) : null}
            <button
              className="btn btn-primary w-full gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSignUp ? (
                <UserPlus size={16} aria-hidden="true" />
              ) : (
                <LogIn size={16} aria-hidden="true" />
              )}
              {isSubmitting
                ? "Please wait..."
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            <button
              type="button"
              className="link link-hover"
              onClick={() => {
                setMode(isSignUp ? "sign-in" : "sign-up");
                setError(null);
              }}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
            </button>
          </p>
          <p className="mt-6 text-center text-sm">
            <Link href="/" className="link link-hover text-base-content/65">
              Back to all events
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

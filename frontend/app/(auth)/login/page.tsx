"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-forest-500 focus:ring-2 focus:ring-forest-100";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (or just logged in): go to the dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      // the effect above sends the user to the dashboard
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold">Welcome back</h2>
      <p className="mt-2 text-sm text-muted">Log in to see your orders and chat with the assistant.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-forest-700 disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-line bg-sun-100/50 px-4 py-3 text-sm">
        <p className="font-medium">Try the demo</p>
        <button
          type="button"
          onClick={() => {
            setEmail("aarav.sharma@example.com");
            setPassword("DemoPass123");
          }}
          className="mt-1 text-forest-600 underline underline-offset-2 hover:text-forest-700"
        >
          Fill in the demo customer
        </button>
      </div>

      <p className="mt-8 text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-medium text-forest-600 hover:text-forest-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
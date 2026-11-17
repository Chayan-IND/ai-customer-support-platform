"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-forest-500 focus:ring-2 focus:ring-forest-100";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, signup } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (or just signed up): go to the dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Checks we can do in the browser, before calling the backend
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(fullName, email, password);
      // the effect above sends the user to the dashboard
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold">Create your account</h2>
      <p className="mt-2 text-sm text-muted">
        Sign up to track orders and get help from the assistant.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>

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
            maxLength={72}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            maxLength={72}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Type it again"
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
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-forest-600 hover:text-forest-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
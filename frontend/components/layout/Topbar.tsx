"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";

// The backend does not send a name yet, so we build a friendly one from the email:
// "aarav.sharma@example.com" -> "Aarav Sharma"
function displayName(email: string): string {
  const local = email.split("@")[0];
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function initials(name: string): string {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return letters || "U";
}

export default function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const name = user ? displayName(user.email) : "";
  const role = user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-6">
      <div className="relative w-full max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search orders, tickets..."
          className="w-full rounded-xl border border-line bg-paper py-2 pl-9 pr-3 text-sm outline-none focus:border-forest-500 focus:bg-surface"
        />
      </div>

      <div className="ml-4 flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:bg-paper"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-600 text-sm font-semibold text-white">
            {initials(name)}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted">{role}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition hover:bg-paper"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
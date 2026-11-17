"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useAuth } from "@/lib/auth";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Not logged in: go to the login page
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // While we check the saved token (or are redirecting), show a spinner
  // instead of flashing the dashboard to someone who is not logged in
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-muted">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
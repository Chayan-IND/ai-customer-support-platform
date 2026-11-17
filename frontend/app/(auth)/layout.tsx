import type { ReactNode } from "react";
import { Headset, MessageSquare, Package, ShieldCheck } from "lucide-react";

const highlights = [
  { icon: MessageSquare, text: "Ask about any order in plain language" },
  { icon: Package, text: "Track deliveries, returns and refunds in one place" },
  { icon: ShieldCheck, text: "Refunds are always approved by a real person" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel (hidden on small screens) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-forest-900 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-forest-700/60" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-forest-600/30" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun-500 text-forest-900">
            <Headset size={22} />
          </div>
          <span className="font-display text-xl font-semibold">SupportAI</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            Support that answers
            <span className="text-sun-500"> before you have to ask twice.</span>
          </h1>
          <ul className="mt-10 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-forest-100">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-forest-100/70">
          A demo store with an AI support assistant.
        </p>
      </aside>

      {/* Right: the form */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-600 text-white">
              <Headset size={20} />
            </div>
            <span className="font-display text-lg font-semibold">SupportAI</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
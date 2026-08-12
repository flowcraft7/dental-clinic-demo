"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const navItems = [
  { href: "/admin/dashboard", label: "Appointments" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/patients", label: "Patients" },
  { href: "/admin/content", label: "Site Content" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
      if (!data.session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (!checked) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center text-ink">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-ivory flex">
      <aside className="w-56 bg-ink flex flex-col p-6">
        <span className="font-display text-lg font-semibold text-ivory mb-10">
          Admin Portal
        </span>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? "bg-teal text-ivory"
                  : "text-ivory/60 hover:bg-ivory/10 hover:text-ivory"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="text-ivory/50 text-sm hover:text-coral transition-colors text-left"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
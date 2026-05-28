"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { GraduationCap, LayoutDashboard, LogOut, Menu, MessageSquareText, MoonStar, NotebookPen, ScrollText, Sparkles, SunMedium, UserCircle2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload Notes", href: "/dashboard#upload", icon: NotebookPen },
  { label: "Chat With Notes", href: "/chat", icon: MessageSquareText },
  { label: "Exam Mode", href: "/exam", icon: GraduationCap },
  { label: "Quiz Generator", href: "/quiz", icon: ScrollText },
  { label: "Revision Tools", href: "/revision", icon: Sparkles },
  { label: "Account", href: "/account", icon: UserCircle2 },
];

export function AppShell({
  title,
  userName,
  children,
  defaultTheme = "dark",
  themeLocked = true,
}: {
  title: string;
  userName?: string;
  children: ReactNode;
  defaultTheme?: "light" | "dark";
  themeLocked?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);

  useEffect(() => {
    if (themeLocked) {
      setTheme(defaultTheme);
      return;
    }

    const savedTheme = window.localStorage.getItem("synapzi-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme ?? (prefersDark ? "dark" : "light"));
  }, [defaultTheme, themeLocked]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (!themeLocked) {
      window.localStorage.setItem("synapzi-theme", theme);
    }
  }, [theme, themeLocked]);

  async function handleLogout() {
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-4 px-3 py-3 sm:px-4 sm:py-4">
        <aside className={`glass-panel fixed inset-y-3 left-3 z-40 w-72 rounded-[1.75rem] p-4 shadow-[0_30px_120px_rgba(15,23,42,0.18)] transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 font-black text-slate-950 shadow-lg shadow-cyan-500/20">S</div>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">Synapzi AI</p>
                <p className="text-xs text-[var(--muted)]">Student dashboard</p>
              </div>
            </div>
            <button type="button" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
              <Menu className="h-5 w-5 rotate-90" />
            </button>
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 via-white/5 to-emerald-400/10 p-4 dark:from-cyan-400/10 dark:via-slate-950/60 dark:to-emerald-400/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Workspace</p>
            <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">Premium study tools</p>
            <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-400">Upload, chat, revise, and prepare for exams in one focused flow.</p>
          </div>

          <nav className="mt-5 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const itemPath = item.href.split("#")[0];
              const active = pathname === itemPath;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 hover:-translate-y-0.5 ${
                    active
                      ? "bg-gradient-to-r from-cyan-400/15 to-emerald-400/10 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.12)] ring-1 ring-cyan-300/20 dark:text-white"
                      : "text-slate-600 hover:bg-white/50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:ml-0">
          <header className="glass-panel sticky top-3 z-30 flex items-center justify-between rounded-[1.5rem] px-4 py-4 shadow-[0_18px_70px_rgba(15,23,42,0.12)] sm:px-5">
            <div className="flex items-center gap-3">
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/60 transition hover:-translate-y-0.5 lg:hidden dark:bg-white/5" onClick={() => setMobileOpen(true)} aria-label="Open sidebar">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{title}</p>
                <p className="text-xs text-[var(--muted)]">Minimal learning platform</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!themeLocked ? (
                <button
                  type="button"
                  onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/70 px-3 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 dark:bg-white/5"
                >
                  {theme === "dark" ? <SunMedium className="mr-2 h-4 w-4" /> : <MoonStar className="mr-2 h-4 w-4" />}
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              ) : null}
              <Link href="/account" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/70 shadow-sm transition hover:-translate-y-0.5 dark:bg-white/5" aria-label="Open account page">
                <UserCircle2 className="h-5 w-5" />
              </Link>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{userName || "Student"}</p>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 pb-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

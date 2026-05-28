"use client";

import { BookMarked, Mail, MapPin, Phone, UserCircle2 } from "lucide-react";
import type { StudyLanguage, UserProfile } from "@/lib/synapzi";

export function AccountCard({
  profile,
  onChange,
  onSave,
  busy,
  statusMessage,
}: {
  profile: UserProfile;
  onChange: (nextProfile: UserProfile) => void;
  onSave: () => void | Promise<void>;
  busy?: boolean;
  statusMessage?: string;
}) {
  function updateField<K extends keyof UserProfile>(field: K, value: UserProfile[K]) {
    onChange({ ...profile, [field]: value });
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Profile details</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Edit your account information</h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <BookMarked className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Full name
            <input value={profile.fullName} onChange={(event) => updateField("fullName", event.target.value)} className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" placeholder="Your name" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Phone number
            <input value={profile.phone} onChange={(event) => updateField("phone", event.target.value)} className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" placeholder="+91 90000 00000" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Email address
            <input value={profile.email} onChange={(event) => updateField("email", event.target.value)} type="email" className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" placeholder="you@example.com" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            School / college
            <input value={profile.school} onChange={(event) => updateField("school", event.target.value)} className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" placeholder="Your institution" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            City
            <input value={profile.city} onChange={(event) => updateField("city", event.target.value)} className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" placeholder="City" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Preferred language
            <select value={profile.preferredLanguage} onChange={(event) => updateField("preferredLanguage", event.target.value as StudyLanguage)} className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 shadow-sm outline-none focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white">
              <option>English</option>
              <option>Hindi</option>
              <option>Kannada</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 sm:col-span-2">
            Study goal
            <textarea value={profile.goal} onChange={(event) => updateField("goal", event.target.value)} rows={4} className="rounded-[1.25rem] border border-white/10 bg-white/80 px-4 py-3 text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" placeholder="What do you want the app to help you do?" />
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={onSave} disabled={busy} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? "Saving..." : "Save profile"}
          </button>
          <p className="text-sm text-slate-500 dark:text-slate-400">This profile powers the account section, dashboard identity, and future personalization.</p>
        </div>

        {statusMessage ? <p className="mt-4 text-sm text-cyan-700 dark:text-cyan-200">{statusMessage}</p> : null}
      </div>
    </section>
  );
}
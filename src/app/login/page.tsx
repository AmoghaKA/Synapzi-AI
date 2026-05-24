"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signInWithGoogle() {
    router.push("/dashboard");
  }

  function signIn() {
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-panel w-full max-w-md rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Login</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Welcome back to Synapzi AI</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Sign in with Google or email/password to open your student dashboard.</p>

        <button type="button" onClick={signInWithGoogle} className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-slate-400">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="space-y-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" className="w-full rounded-full border border-white/10 bg-white/80 px-4 py-3 text-sm outline-none dark:bg-slate-950/50 dark:text-white" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="w-full rounded-full border border-white/10 bg-white/80 px-4 py-3 text-sm outline-none dark:bg-slate-950/50 dark:text-white" />
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={signIn} className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white">Sign in</button>
            <button type="button" onClick={signIn} className="rounded-full border border-white/10 bg-white/70 px-5 py-3 text-sm font-semibold dark:bg-white/5">Sign up</button>
          </div>
        </div>

      </section>
    </main>
  );
}

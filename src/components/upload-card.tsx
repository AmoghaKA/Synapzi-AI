"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

export function UploadCard({
  onUploadFile,
  onSaveText,
  busy,
}: {
  onUploadFile: (file: File) => void;
  onSaveText: (text: string) => void;
  busy?: boolean;
}) {
  const [text, setText] = useState("");

  return (
    <section id="upload" className="glass-panel rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Upload notes</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Upload PDF or paste notes</h2>
        </div>

        <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
          <input type="file" accept="application/pdf" className="hidden" onChange={(event) => event.target.files?.[0] && onUploadFile(event.target.files[0])} />
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload PDF
        </label>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste notes here..."
        className="mt-5 min-h-44 w-full rounded-[1.25rem] border border-white/10 bg-white/80 p-4 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => onSaveText(text)}
          className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Working..." : "Save notes"}
        </button>
      </div>
    </section>
  );
}

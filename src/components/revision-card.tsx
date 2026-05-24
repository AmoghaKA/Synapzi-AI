"use client";

import type { NoteItem } from "@/lib/synapzi";

export function RevisionCard({
  notes,
  activeNoteId,
  onNoteChange,
  summary,
  onGenerate,
  busy,
}: {
  notes: NoteItem[];
  activeNoteId: string;
  onNoteChange: (id: string) => void;
  summary: { shortSummary: string; bulletNotes: string[]; keyConcepts: string[]; revisionNotes: string[]; importantQuestions: string[]; formulaSheet: string[] } | null;
  onGenerate: () => void;
  busy?: boolean;
}) {
  return (
    <section className="glass-panel rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Revision tools</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Quick revision notes from your selected note</h2>
        </div>
        <div className="flex gap-3">
          <select value={activeNoteId} onChange={(event) => onNoteChange(event.target.value)} className="rounded-full border border-white/10 bg-white/80 px-3 py-2 text-sm dark:bg-slate-950/50">
            {notes.map((note) => <option key={note.id} value={note.id}>{note.title}</option>)}
          </select>
          <button type="button" onClick={onGenerate} className="rounded-full bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">{busy ? "Generating..." : "Generate"}</button>
        </div>
      </div>

      {!summary ? (
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">Click generate to create revision notes, important questions, and a formula sheet.</p>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.25rem] bg-white/60 p-4 dark:bg-white/5">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Short summary</p>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{summary.shortSummary}</p>
          </div>
          <div className="rounded-[1.25rem] bg-white/60 p-4 dark:bg-white/5">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Key concepts</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {summary.keyConcepts.map((item) => <span key={item} className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-200">{item}</span>)}
            </div>
          </div>
          <div className="rounded-[1.25rem] bg-white/60 p-4 dark:bg-white/5">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Revision notes</p>
            <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {summary.revisionNotes.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
          <div className="rounded-[1.25rem] bg-white/60 p-4 dark:bg-white/5">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Important questions</p>
            <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {summary.importantQuestions.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
          <div className="rounded-[1.25rem] bg-white/60 p-4 dark:bg-white/5 lg:col-span-2">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Formula sheet</p>
            <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {summary.formulaSheet.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, Clock3, FileText, GraduationCap, Sparkles, Target, UploadCloud, ShieldCheck, TimerReset } from "lucide-react";
import type { ExamArtifact, NoteItem, StudyLanguage } from "@/lib/synapzi";

export function ExamModeCard({
  notes,
  activeNoteId,
  onNoteChange,
  language,
  onLanguageChange,
  onUploadFile,
  onGenerateFromText,
  onGenerateFromNote,
  artifact,
  busy,
  statusMessage,
}: {
  notes: NoteItem[];
  activeNoteId: string;
  onNoteChange: (id: string) => void;
  language: StudyLanguage;
  onLanguageChange: (language: StudyLanguage) => void;
  onUploadFile: (file: File) => void | Promise<void>;
  onGenerateFromText: (text: string) => void | Promise<void>;
  onGenerateFromNote: () => void | Promise<void>;
  artifact: ExamArtifact | null;
  busy?: boolean;
  statusMessage?: string;
}) {
  const [draft, setDraft] = useState("");

  const selectedNote = useMemo(() => notes.find((note) => note.id === activeNoteId) ?? notes[0], [notes, activeNoteId]);

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Exam Mode
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 text-balance dark:text-white sm:text-5xl">
              Fast, reliable exam prep built from your own notes.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Upload a PDF, paste notes, or use a saved note. Exam Mode generates important topics, probable exam questions, concise revision notes, formulas, and definitions in a clean one-night revision layout.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Important topics", "Prioritized from the note"],
                ["Probable questions", "Expected exam prompts"],
                ["Fast revision", "Quick enough for tonight"],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-[1.25rem] border border-white/10 bg-white/60 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:bg-white/5">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{title}</p>
                  <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">{detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/60 px-3 py-2 dark:bg-white/5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Source-grounded answers
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/60 px-3 py-2 dark:bg-white/5">
                <TimerReset className="h-4 w-4 text-cyan-300" />
                One-night study flow
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-5 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Preparation inputs</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Use a saved note, upload a PDF, or paste text</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={activeNoteId} onChange={(event) => onNoteChange(event.target.value)} className="rounded-full border border-white/10 bg-white/80 px-3 py-2 text-sm shadow-sm dark:bg-slate-950/50 dark:text-white">
                {notes.map((note) => (
                  <option key={note.id} value={note.id}>
                    {note.title}
                  </option>
                ))}
              </select>
              <select value={language} onChange={(event) => onLanguageChange(event.target.value as StudyLanguage)} className="rounded-full border border-white/10 bg-white/80 px-3 py-2 text-sm shadow-sm dark:bg-slate-950/50 dark:text-white">
                <option>English</option>
                <option>Hindi</option>
                <option>Kannada</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
              <input
                type="file"
                accept="application/pdf,text/plain"
                className="hidden"
                onChange={(event) => event.target.files?.[0] && onUploadFile(event.target.files[0])}
              />
              <UploadCloud className="h-4 w-4" />
              Upload PDF or text file
            </label>

            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Paste your notes here for instant Exam Mode analysis..."
              className="min-h-48 w-full rounded-[1.5rem] border border-white/10 bg-white/80 p-4 text-sm leading-7 text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onGenerateFromText(draft)}
                disabled={busy || !draft.trim()}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Analyzing..." : "Analyze pasted notes"}
              </button>
              <button
                type="button"
                onClick={onGenerateFromNote}
                disabled={busy || !selectedNote}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-white"
              >
                Use saved note
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {statusMessage ? <p className="text-sm text-cyan-700 dark:text-cyan-200">{statusMessage}</p> : null}
            {selectedNote ? <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Selected note: {selectedNote.title}</p> : null}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-panel rounded-[2rem] p-5 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Exam output</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">One-night preparation bundle</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 shadow-inner dark:text-cyan-300">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {busy && !artifact ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-5 grid gap-4"
              >
                <div className="h-32 animate-pulse rounded-[1.5rem] bg-gradient-to-br from-white/10 to-white/5" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-44 animate-pulse rounded-[1.5rem] bg-gradient-to-br from-white/10 to-white/5" />
                  <div className="h-44 animate-pulse rounded-[1.5rem] bg-gradient-to-br from-white/10 to-white/5" />
                </div>
              </motion.div>
            ) : artifact ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-5 grid gap-4"
              >
                <div className="rounded-[1.5rem] border border-white/10 bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:bg-white/5">
                  <div className="flex items-center gap-3 text-cyan-300/90">
                    <Clock3 className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.28em]">Quick summary</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{artifact.quickSummary}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:bg-white/5">
                    <div className="flex items-center gap-3 text-cyan-300/90">
                      <Target className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.28em]">Important topics</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {artifact.importantTopics.map((item) => (
                        <li key={item} className="rounded-2xl bg-white/60 px-3 py-2 dark:bg-slate-950/40">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:bg-white/5">
                    <div className="flex items-center gap-3 text-cyan-300/90">
                      <BookOpenCheck className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.28em]">Quick revision</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {artifact.quickRevisionNotes.map((item) => (
                        <li key={item} className="rounded-2xl bg-white/60 px-3 py-2 dark:bg-slate-950/40">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:bg-white/5">
                    <div className="flex items-center gap-3 text-cyan-300/90">
                      <FileText className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.28em]">Probable questions</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {artifact.probableQuestions.map((item) => (
                        <li key={item} className="rounded-2xl bg-white/60 px-3 py-2 dark:bg-slate-950/40">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:bg-white/5">
                    <div className="flex items-center gap-3 text-cyan-300/90">
                      <Sparkles className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.28em]">Fast revision mode</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      {artifact.fastRevisionMode.map((item, index) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/60 px-3 py-3 text-sm leading-7 text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-semibold text-cyan-300">{index + 1}</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:bg-white/5">
                    <div className="flex items-center gap-3 text-cyan-300/90">
                      <FileText className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.28em]">Definitions</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {artifact.definitions.map((item) => (
                        <li key={item} className="rounded-2xl bg-white/60 px-3 py-2 dark:bg-slate-950/40">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:bg-white/5">
                    <div className="flex items-center gap-3 text-cyan-300/90">
                      <GraduationCap className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.28em]">Formula sheet</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {artifact.formulas.map((item) => (
                        <li key={item} className="rounded-2xl bg-white/60 px-3 py-2 dark:bg-slate-950/40">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mt-5 rounded-[1.5rem] border border-dashed border-white/15 bg-gradient-to-br from-white/40 to-white/20 p-6 dark:from-white/5 dark:to-white/0">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Generate the exam bundle to see the important topics, probable questions, quick revision notes, formulas, and definitions appear here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
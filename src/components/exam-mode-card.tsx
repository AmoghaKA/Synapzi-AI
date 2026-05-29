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
        <div className="p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Exam Mode</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Fast, reliable exam prep</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Upload a PDF, paste notes, or use a saved note — concise, priority-based revision for one-night study.</p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Important topics · Probable questions · Fast revision</p>
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
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:-translate-y-1 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:from-cyan-600 dark:to-sky-600 dark:hover:from-cyan-500 dark:hover:to-sky-500">
              <input
                type="file"
                accept="application/pdf,text/plain"
                className="hidden"
                onChange={(event) => event.target.files?.[0] && onUploadFile(event.target.files[0])}
              />
              <UploadCloud className="h-4 w-4 text-white" />
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-5"
              >
                <div className="h-4 w-3/4 animate-pulse bg-white/10 rounded"></div>
                <div className="mt-3 h-3 w-1/2 animate-pulse bg-white/8 rounded"></div>
              </motion.div>
            ) : artifact ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-5"
              >
                <div className="prose max-w-none text-slate-900 dark:text-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Exam bundle</p>
                  <h3 className="mt-1 text-2xl font-semibold">One-night preparation bundle</h3>

                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{artifact.quickSummary}</p>

                  {artifact.lastMinuteTips && artifact.lastMinuteTips.length > 0 ? (
                    <>
                      <h4 className="mt-4 font-semibold text-cyan-600">Last-minute tips</h4>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                        {artifact.lastMinuteTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  <h4 className="mt-4 font-semibold">Important topics</h4>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {artifact.importantTopics.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="mt-4 font-semibold">Probable questions</h4>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {artifact.probableQuestions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="mt-4 font-semibold">Quick revision</h4>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{artifact.quickRevisionNotes.join(' • ')}</p>

                  <h4 className="mt-4 font-semibold">Formulas & Definitions</h4>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{[...artifact.formulas, ...artifact.definitions].slice(0, 12).join(' • ')}</p>

                  {artifact.additionalNotes && artifact.additionalNotes.length > 0 ? (
                    <>
                      <h4 className="mt-4 font-semibold">Notes</h4>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{artifact.additionalNotes.join(' • ')}</p>
                    </>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-5">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">Generate the exam bundle to see the important topics, probable questions, quick revision notes, formulas, and definitions appear here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
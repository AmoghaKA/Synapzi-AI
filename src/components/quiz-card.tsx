"use client";

import type { NoteItem } from "@/lib/synapzi";

export function QuizCard({
  notes,
  activeNoteId,
  onNoteChange,
  questions,
  answers,
  onAnswerChange,
  onGenerate,
  onSubmit,
  score,
  busy,
}: {
  notes: NoteItem[];
  activeNoteId: string;
  onNoteChange: (id: string) => void;
  questions: Array<{ id: string; type: string; question: string; options?: string[]; answer: string; explanation: string }>;
  answers: Record<string, string>;
  onAnswerChange: (id: string, value: string) => void;
  onGenerate: () => void;
  onSubmit: () => void;
  score: number | null;
  busy?: boolean;
}) {
  return (
    <section className="glass-panel rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Quiz generator</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Generate simple practice questions</h2>
        </div>
        <div className="flex gap-3">
          <select value={activeNoteId} onChange={(event) => onNoteChange(event.target.value)} className="rounded-full border border-white/10 bg-white/80 px-3 py-2 text-sm dark:bg-slate-950/50">
            {notes.map((note) => <option key={note.id} value={note.id}>{note.title}</option>)}
          </select>
          <button type="button" onClick={onGenerate} className="rounded-full bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">{busy ? "Generating..." : "Generate Quiz"}</button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {questions.map((question) => (
          <article key={question.id} className="rounded-[1.25rem] border border-white/10 bg-white/60 p-4 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{question.type}</p>
            <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">{question.question}</p>
            <div className="mt-3 space-y-2">
              {(question.options ?? [""]).map((option) => (
                <label key={option} className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 text-sm dark:bg-slate-950/50">
                  <input type="radio" name={question.id} checked={answers[question.id] === option} onChange={() => onAnswerChange(question.id, option)} />
                  {option || "Type your answer below"}
                </label>
              ))}
              {question.type === "Short answer" ? (
                <input value={answers[question.id] ?? ""} onChange={(event) => onAnswerChange(question.id, event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/80 px-3 py-2 text-sm dark:bg-slate-950/50 dark:text-white" placeholder="Write your answer" />
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onSubmit} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">Submit</button>
        {score !== null ? <p className="text-sm text-slate-600 dark:text-slate-300">Score: {score}/{questions.length}</p> : null}
      </div>
    </section>
  );
}

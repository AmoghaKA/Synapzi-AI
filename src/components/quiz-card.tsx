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
    <section className="glass-panel rounded-xl p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Quiz Generator</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Practice questions from your notes</h2>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center gap-3">
          <select value={activeNoteId} onChange={(event) => onNoteChange(event.target.value)} className="h-10 rounded-full border border-white/10 bg-white px-3 text-sm shadow-sm dark:bg-slate-900/60 dark:text-white">
            {notes.map((note) => (
              <option key={note.id} value={note.id}>{note.title}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={onGenerate}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:brightness-105 disabled:opacity-60"
          >
            {busy ? "Generating..." : "Generate Quiz"}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {questions.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">No questions yet — generate a quiz from a note.</p>
        ) : null}

        {questions.map((question, idx) => {
          const response = (answers[question.id] ?? "").trim().toLowerCase();
          const correct = (question.answer ?? "").trim().toLowerCase();
          const isCorrect = response && (response === correct || correct.includes(response) || response.includes(correct));

          return (
            <article key={question.id} className="py-4 border-b border-white/8">
              <div className="flex items-start justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{question.type}</p>
                <span className="text-xs text-slate-400">Q{idx + 1}</span>
              </div>

              <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{question.question}</p>

              <div className="mt-3 grid gap-2">
                {(question.options ?? []).map((option, oi) => {
                  const selected = answers[question.id] === option;
                  // determine display state after submit
                  const showFeedback = score !== null && selected;
                  const correctOption = score !== null && option.trim().toLowerCase() === correct;

                  const baseClass = selected
                    ? 'text-left w-full rounded-lg px-3 py-2 text-sm border transition'
                    : 'text-left w-full rounded-lg px-3 py-2 text-sm border transition bg-white/5 border-white/6 hover:bg-white/10 dark:bg-slate-900/30';

                  const stateClass = showFeedback
                    ? isCorrect
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : correctOption
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-600 border-rose-600 text-white'
                    : selected
                      ? 'bg-cyan-600 border-cyan-600 text-white'
                      : '';

                  const letter = String.fromCharCode(65 + oi);

                  return (
                    <button
                      key={option + oi}
                      type="button"
                      onClick={() => onAnswerChange(question.id, option)}
                      className={`${baseClass} ${stateClass}`}
                    >
                      <span className="inline-flex items-center justify-center mr-3 h-6 w-6 rounded-full bg-white/10 text-xs font-semibold text-slate-200">{letter}</span>
                      {option}
                    </button>
                  );
                })}

                {question.type === "Short Answer" ? (
                  <div>
                    <input
                      value={answers[question.id] ?? ""}
                      onChange={(event) => onAnswerChange(question.id, event.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white px-3 py-2 text-sm dark:bg-slate-900/60 dark:text-white"
                      placeholder="Write your answer"
                    />
                    {score !== null ? (
                      <p className={`mt-2 text-sm ${isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {isCorrect ? 'Correct' : `Answer: ${question.answer}`}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {score !== null && question.type !== 'Short Answer' ? (
                <div className="mt-2 text-sm">
                  {isCorrect ? <span className="text-emerald-600">Your answer is correct</span> : <span className="text-rose-500">Incorrect — correct: <span className="font-medium text-slate-900 dark:text-white">{question.answer}</span></span>}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:brightness-105 disabled:opacity-60"
        >
          Submit
        </button>
        {score !== null ? <p className="text-sm text-slate-600 dark:text-slate-300">Score: {score}/{questions.length}</p> : null}
      </div>
    </section>
  );
}

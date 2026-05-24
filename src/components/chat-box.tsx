"use client";

import { useState } from "react";
import type { NoteItem, StudyLanguage } from "@/lib/notemind";

export function ChatBox({
  notes,
  activeNoteId,
  onNoteChange,
  language,
  onLanguageChange,
  onSend,
  messages,
  busy,
}: {
  notes: NoteItem[];
  activeNoteId: string;
  onNoteChange: (id: string) => void;
  language: StudyLanguage;
  onLanguageChange: (language: StudyLanguage) => void;
  onSend: (question: string) => void;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  busy?: boolean;
}) {
  const [question, setQuestion] = useState("");

  return (
    <section className="glass-panel flex min-h-[70vh] flex-col rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Chat with notes</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Ask questions grounded in your uploaded notes</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <select value={activeNoteId} onChange={(event) => onNoteChange(event.target.value)} className="rounded-full border border-white/10 bg-white/80 px-3 py-2 text-sm dark:bg-slate-950/50">
            {notes.map((note) => (
              <option key={note.id} value={note.id}>{note.title}</option>
            ))}
          </select>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value as StudyLanguage)} className="rounded-full border border-white/10 bg-white/80 px-3 py-2 text-sm dark:bg-slate-950/50">
            <option>English</option>
            <option>Hindi</option>
            <option>Kannada</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto rounded-[1.25rem] bg-white/40 p-4 dark:bg-white/5">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-7 ${message.role === "user" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-cyan-500/10 text-slate-700 dark:text-slate-200"}`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask something from your notes..."
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/80 px-4 py-3 text-sm outline-none dark:bg-slate-950/50 dark:text-white"
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            onSend(question);
            setQuestion("");
          }}
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
        >
          {busy ? "Sending..." : "Send"}
        </button>
      </div>
    </section>
  );
}

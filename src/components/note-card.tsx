"use client";

import Link from "next/link";
import { BookOpenText, MessageSquareText, ScrollText, Trash2 } from "lucide-react";
import type { NoteItem } from "@/lib/synapzi";

export function NoteCard({
  note,
  onDelete,
}: {
  note: NoteItem;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="glass-panel rounded-[1.5rem] p-5 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-950 dark:text-white">{note.title}</p>
          <p suppressHydrationWarning className="mt-1 text-sm text-[var(--muted)]">{note.createdAt}</p>
        </div>
        <div className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-200">Note</div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{note.text}</p>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Link href={`/dashboard?note=${note.id}`} className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/70 px-3 py-2 text-xs font-medium transition hover:bg-white dark:bg-white/5">
          <BookOpenText className="mr-1.5 h-3.5 w-3.5" />
          Summary
        </Link>
        <Link href={`/chat?note=${note.id}`} className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/70 px-3 py-2 text-xs font-medium transition hover:bg-white dark:bg-white/5">
          <MessageSquareText className="mr-1.5 h-3.5 w-3.5" />
          Chat
        </Link>
        <Link href={`/quiz?note=${note.id}`} className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/70 px-3 py-2 text-xs font-medium transition hover:bg-white dark:bg-white/5">
          <ScrollText className="mr-1.5 h-3.5 w-3.5" />
          Quiz
        </Link>
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          className="inline-flex items-center justify-center rounded-2xl border border-rose-200/70 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </article>
  );
}

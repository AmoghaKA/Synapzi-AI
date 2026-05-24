"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { AppShell } from "@/components/app-shell";
import { NoteCard } from "@/components/note-card";
import { UploadCard } from "@/components/upload-card";
import { getFirebaseServices } from "@/lib/firebase";
import { extractNoteText, getNoteSummary, removeNote, saveNote, type NoteArtifact, type NoteItem, type StudyLanguage } from "@/lib/notemind";

const demoUserId = "demo-user";
const sampleNotes: NoteItem[] = [
  {
    id: "sample-note",
    title: "Sample Physics Notes",
    text: "Force, motion, and energy are key ideas in this chapter. Use the dashboard to upload a PDF and generate quizzes.",
    source: "Sample content",
    userId: demoUserId,
    createdAt: new Date().toLocaleString(),
  },
];

export default function DashboardPage() {
  const [notes, setNotes] = useState<NoteItem[]>(sampleNotes);
  const [selectedNoteId, setSelectedNoteId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("note") ?? "";
  });
  const [summary, setSummary] = useState<NoteArtifact | null>(null);
  const [busy, setBusy] = useState(false);
  const [language] = useState<StudyLanguage>("English");

  useEffect(() => {
    const services = getFirebaseServices();
    if (!services) {
      return;
    }

    const noteQuery = query(collection(services.db, "notes"), where("userId", "==", demoUserId));
    return onSnapshot(noteQuery, (snapshot) => {
      const nextNotes = snapshot.docs.map((item) => {
        const data = item.data() as Record<string, unknown>;
        return {
          id: item.id,
          title: String(data.title ?? "Untitled note"),
          text: String(data.text ?? ""),
          source: String(data.source ?? "Manual entry"),
          userId: String(data.userId ?? demoUserId),
          createdAt: data.createdAt && typeof data.createdAt === "object" && "toDate" in data.createdAt ? (data.createdAt as { toDate: () => Date }).toDate().toLocaleString() : new Date().toLocaleString(),
        } satisfies NoteItem;
      });
      setNotes(nextNotes.length ? nextNotes : sampleNotes);
      setSelectedNoteId((current) => current || nextNotes[0]?.id || "");
    });
  }, []);

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedNoteId) ?? notes[0], [notes, selectedNoteId]);

  async function handleUploadFile(file: File) {
    setBusy(true);
    try {
      const extracted = await extractNoteText(file);
      await saveNote(demoUserId, { title: extracted.title, text: extracted.text, source: file.name });
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveText(text: string) {
    if (!text.trim()) {
      return;
    }

    setBusy(true);
    try {
      await saveNote(demoUserId, { title: "Pasted notes", text: text.trim(), source: "Manual entry" });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(noteId: string) {
    await removeNote(noteId);
  }

  async function handleSummary(note: NoteItem) {
    setSelectedNoteId(note.id);
    const data = await getNoteSummary(note.text, language);
    setSummary(data.artifact);
  }

  return (
    <AppShell title="Dashboard" userName="Student">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <UploadCard busy={busy} onUploadFile={handleUploadFile} onSaveText={handleSaveText} />

          <section className="glass-panel rounded-[1.75rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Notes</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Uploaded notes</h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{notes.length} saved</p>
            </div>

            <div className="mt-5 grid gap-4">
              {notes.map((note) => (
                <div key={note.id} className={selectedNoteId === note.id ? "ring-2 ring-cyan-300/40 rounded-[1.5rem]" : ""}>
                  <NoteCard note={note} onDelete={handleDelete} />
                  <div className="-mt-2 px-5 pb-4">
                    <button type="button" onClick={() => handleSummary(note)} className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-white">
                      Summary
                    </button>
                  </div>
                </div>
              ))}
              {!notes.length ? <p className="text-sm text-slate-500">No notes yet. Upload a PDF or paste text to start.</p> : null}
            </div>
          </section>
        </div>

        <section className="glass-panel rounded-[1.75rem] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Selected note</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{selectedNote?.title || "Choose a note"}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{selectedNote?.text || "Upload or select a note to preview summaries, chat, quizzes, and revision tools."}</p>

          {summary ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.25rem] bg-white/60 p-4 dark:bg-white/5 md:col-span-2">
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
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Bullet points</p>
                <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {summary.bulletNotes.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

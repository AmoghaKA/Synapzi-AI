"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RevisionCard } from "@/components/revision-card";
import { getNoteSummary, loadNotes, type NoteArtifact, type NoteItem, type StudyLanguage } from "@/lib/notemind";

const demoUserId = "demo-user";

export default function RevisionPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNoteId, setActiveNoteId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("note") ?? "";
  });
  const [summary, setSummary] = useState<NoteArtifact | null>(null);
  const [busy, setBusy] = useState(false);
  const [language] = useState<StudyLanguage>("English");

  useEffect(() => {
    loadNotes(demoUserId).then((nextNotes) => {
      setNotes(nextNotes);
      setActiveNoteId((current) => current || nextNotes[0]?.id || "");
    });
  }, []);

  const selectedNote = useMemo(() => notes.find((note) => note.id === activeNoteId) ?? notes[0], [notes, activeNoteId]);

  async function handleGenerate() {
    if (!selectedNote) {
      return;
    }

    setBusy(true);
    try {
      const data = await getNoteSummary(selectedNote.text, language);
      setSummary(data.artifact);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title="Revision" userName="Student">
      <RevisionCard
        notes={notes}
        activeNoteId={activeNoteId}
        onNoteChange={setActiveNoteId}
        summary={summary}
        onGenerate={handleGenerate}
        busy={busy}
      />
    </AppShell>
  );
}

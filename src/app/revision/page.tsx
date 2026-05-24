"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RevisionCard } from "@/components/revision-card";
import { getNoteSummary, loadNotes, type NoteArtifact, type NoteItem, type StudyLanguage } from "@/lib/notemind";
import { useAuthUser } from "@/lib/use-auth-user";

export default function RevisionPage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
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
    if (!user && !loading) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadNotes(user.uid).then((nextNotes) => {
      setNotes(nextNotes);
      setActiveNoteId((current) => current || nextNotes[0]?.id || "");
    });
  }, [user]);

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
    <AppShell title="Revision" userName={user?.displayName || user?.email || "Student"}>
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

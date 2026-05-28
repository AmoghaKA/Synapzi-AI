"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ExamModeCard } from "@/components/exam-mode-card";
import { extractNoteText, getExamMode, loadNotes, type ExamArtifact, type NoteItem, type StudyLanguage } from "@/lib/synapzi";

const demoUserId = "demo-user";

export default function ExamPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNoteId, setActiveNoteId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("note") ?? "";
  });
  const [language, setLanguage] = useState<StudyLanguage>("English");
  const [artifact, setArtifact] = useState<ExamArtifact | null>(null);
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Upload a PDF, paste notes, or choose a saved note to generate an exam pack.");

  useEffect(() => {
    loadNotes(demoUserId).then((nextNotes) => {
      setNotes(nextNotes);
      setActiveNoteId((current) => current || nextNotes[0]?.id || "");
    });
  }, []);

  const selectedNote = useMemo(() => notes.find((note) => note.id === activeNoteId) ?? notes[0], [notes, activeNoteId]);

  async function analyzeText(text: string, label: string) {
    const cleanedText = text.trim();
    if (!cleanedText) {
      return;
    }

    setBusy(true);
    setStatusMessage(`Analyzing ${label} for exam prep...`);
    try {
      const data = await getExamMode(cleanedText, language);
      setArtifact(data.artifact);
      setStatusMessage(`Exam Mode ready from ${label}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      setStatusMessage(`Unable to generate Exam Mode right now. ${message}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleUploadFile(file: File) {
    setBusy(true);
    setStatusMessage("Extracting notes from your file...");
    try {
      const extracted = await extractNoteText(file);
      await analyzeText(extracted.text, extracted.title || file.name);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try another file.";
      setStatusMessage(`Unable to read this file. ${message}`);
      setBusy(false);
    }
  }

  async function handleGenerateFromNote() {
    if (!selectedNote) {
      return;
    }

    await analyzeText(selectedNote.text, selectedNote.title);
  }

  return (
    <AppShell title="Exam Mode" userName="Student">
      <ExamModeCard
        notes={notes}
        activeNoteId={activeNoteId}
        onNoteChange={setActiveNoteId}
        language={language}
        onLanguageChange={setLanguage}
        onUploadFile={handleUploadFile}
        onGenerateFromText={(text) => analyzeText(text, "pasted notes")}
        onGenerateFromNote={handleGenerateFromNote}
        artifact={artifact}
        busy={busy}
        statusMessage={statusMessage}
      />
    </AppShell>
  );
}
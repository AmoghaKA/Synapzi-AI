"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { QuizCard } from "@/components/quiz-card";
import { createNoteQuiz, loadNotes, type NoteItem, type StudyLanguage } from "@/lib/notemind";

const demoUserId = "demo-user";

export default function QuizPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNoteId, setActiveNoteId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("note") ?? "";
  });
  const [language] = useState<StudyLanguage>("English");
  const [questions, setQuestions] = useState<Array<{ id: string; type: string; question: string; options?: string[]; answer: string; explanation: string }>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

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
      const data = await createNoteQuiz(selectedNote.text, language);
      setQuestions(data.quiz);
      setAnswers({});
      setScore(null);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit() {
    if (!questions.length) {
      return;
    }

    let nextScore = 0;
    for (const question of questions) {
      const response = answers[question.id]?.trim().toLowerCase() ?? "";
      const answer = question.answer.trim().toLowerCase();
      if (response && (response === answer || answer.includes(response) || response.includes(answer))) {
        nextScore += 1;
      }
    }
    setScore(nextScore);
  }

  return (
    <AppShell title="Quiz" userName="Student">
      <QuizCard
        notes={notes}
        activeNoteId={activeNoteId}
        onNoteChange={setActiveNoteId}
        questions={questions}
        answers={answers}
        onAnswerChange={(id, value) => setAnswers((current) => ({ ...current, [id]: value }))}
        onGenerate={handleGenerate}
        onSubmit={handleSubmit}
        score={score}
        busy={busy}
      />
    </AppShell>
  );
}

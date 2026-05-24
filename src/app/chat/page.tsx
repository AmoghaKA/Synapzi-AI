"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ChatBox } from "@/components/chat-box";
import { askNoteQuestion, loadNotes, type ChatMessage, type NoteItem, type StudyLanguage } from "@/lib/notemind";

const demoUserId = "demo-user";

export default function ChatPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNoteId, setActiveNoteId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("note") ?? "";
  });
  const [language, setLanguage] = useState<StudyLanguage>("English");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: "Pick a note and ask a question. I will answer only from the uploaded content." }]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadNotes(demoUserId).then((nextNotes) => {
      setNotes(nextNotes);
      setActiveNoteId((current) => current || nextNotes[0]?.id || "");
    });
  }, []);

  const selectedNote = useMemo(() => notes.find((note) => note.id === activeNoteId) ?? notes[0], [notes, activeNoteId]);

  async function handleSend(question: string) {
    if (!selectedNote || !question.trim()) {
      return;
    }

    setBusy(true);
    setMessages((current) => [...current, { role: "user", content: question }]);
    try {
      const data = await askNoteQuestion(selectedNote.text, question, language);
      setMessages((current) => [...current, { role: "assistant", content: data.answer || "Answer not found in uploaded notes." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title="Chat" userName="Student">
      <ChatBox
        notes={notes}
        activeNoteId={activeNoteId}
        onNoteChange={setActiveNoteId}
        language={language}
        onLanguageChange={setLanguage}
        onSend={handleSend}
        messages={messages}
        busy={busy}
      />
    </AppShell>
  );
}

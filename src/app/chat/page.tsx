"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ChatBox } from "@/components/chat-box";
import { askNoteQuestion, loadNotes, type ChatMessage, type NoteItem, type StudyLanguage } from "@/lib/notemind";
import { useAuthUser } from "@/lib/use-auth-user";

export default function ChatPage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
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
    <AppShell title="Chat" userName={user?.displayName || user?.email || "Student"}>
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

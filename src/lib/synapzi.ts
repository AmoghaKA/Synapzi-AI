import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where, type DocumentData } from "firebase/firestore";
import { getFirebaseServices } from "@/lib/firebase";

export type StudyLanguage = "English" | "Hindi" | "Kannada";

export type NoteItem = {
  id: string;
  title: string;
  text: string;
  source: string;
  userId: string;
  createdAt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type NoteArtifact = {
  shortSummary: string;
  bulletNotes: string[];
  keyConcepts: string[];
  revisionNotes: string[];
  importantQuestions: string[];
  formulaSheet: string[];
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function extractNoteText(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiBase}/notes/extract`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to extract note text.");
  }

  const data = (await response.json()) as { text: string; title?: string };
  return {
    title: data.title || file.name.replace(/\.[^.]+$/, ""),
    text: data.text.trim(),
  };
}

export async function saveNote(userId: string, note: Omit<NoteItem, "id" | "userId" | "createdAt">) {
  const services = getFirebaseServices();
  if (!services) {
    throw new Error("Firebase is not configured.");
  }

  const result = await addDoc(collection(services.db, "notes"), {
    userId,
    title: note.title,
    text: note.text,
    source: note.source,
    createdAt: serverTimestamp(),
  });

  return result.id;
}

export async function loadNotes(userId: string) {
  const services = getFirebaseServices();
  if (!services) {
    return [] as NoteItem[];
  }

  const noteQuery = query(collection(services.db, "notes"), where("userId", "==", userId));
  const snapshot = await getDocs(noteQuery);

  return snapshot.docs.map((item) => {
    const data = item.data() as DocumentData;
    return {
      id: item.id,
      title: String(data.title ?? "Untitled note"),
      text: String(data.text ?? ""),
      source: String(data.source ?? "Manual entry"),
      userId: String(data.userId ?? userId),
      createdAt: data.createdAt?.toDate?.().toLocaleString?.() ?? new Date().toLocaleString(),
    } satisfies NoteItem;
  });
}

export async function removeNote(noteId: string) {
  const services = getFirebaseServices();
  if (!services) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(services.db, "notes", noteId));
}

async function postJson<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }

  return (await response.json()) as T;
}

export async function getNoteSummary(noteText: string, language: StudyLanguage) {
  return postJson<{ artifact: NoteArtifact }>('/ai/summary', { noteText, language });
}

export async function askNoteQuestion(noteText: string, question: string, language: StudyLanguage) {
  return postJson<{ answer: string }>('/ai/chat', { noteText, question, language });
}

export async function createNoteQuiz(noteText: string, language: StudyLanguage) {
  return postJson<{ quiz: Array<{ id: string; type: string; question: string; options?: string[]; answer: string; explanation: string }> }>('/ai/quiz', { noteText, language });
}
